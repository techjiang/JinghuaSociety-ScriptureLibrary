---
title: JavaScript 垃圾回收入门
createTime: 2026-10-22
permalink: /library/tech/garbage-collection/
description: 引用计数为什么被淘汰、可达性分析、内存泄漏的四种常见姿势
---

# JavaScript 垃圾回收入门

JS 自动管理内存：创建对象自动分配，不用了自动回收。
所以很多人一辈子不关心 GC —— 直到页面越来越卡、
Node 服务 OOM。这篇讲清原理和最常见的泄漏姿势。

## 一、自动回收：可达性分析

现代 JS 引擎（V8）用**可达性（Reachability）**判断垃圾：

```text
从「根」（全局对象、当前调用栈、DOM 引用）出发，
能顺着引用链找到的 = 活着；
找不到的 = 垃圾，回收。
```

```js
let user = { name: '张三' }     // user 引用着对象 → 可达
user = null                     // 引用断了 → 对象不可达 → 下次 GC 回收
```

**关键认知：GC 不是「引用计数归零就回收」**（那是老古董算法，
搞不定循环引用）。可达性分析能处理循环：

```js
function leak() {
  const a = {}
  const b = {}
  a.ref = b          // 互相引用
  b.ref = a
}
leak()
// 函数执行完，a 和 b 从外部不可达 → 整组回收，循环引用不是事
```

## 二、分代回收：新对象死得快

V8 的经验法则：**大多数对象「朝生暮死」**（临时对象、
函数返回值），少数活很久（全局配置、缓存）。

所以分代管理：

```text
新生代（Young Generation）：
  新对象先放这，小（几 MB 到几十 MB），
  「Scavenge」算法频繁快速回收（复制活着的到另一区）

老生代（Old Generation）：
  熬过两次 GC 还活的，晋升到这，大，
  「Mark-Sweep-Compact」算法偶尔大扫除（标记-清除-整理）
```

**推论**：你的临时对象（每次请求创建的）在新生代，
回收成本低；**长期缓存类对象进老生代，回收贵** ——
所以缓存要有上限，别无限涨。

## 三、内存泄漏的四种常见姿势

### 1. 意外的全局变量

```js
function leak() {
  bigData = new Array(1000000)     // 忘了 const/let！变成全局属性
}
// bigData 挂在 window 上，永远可达 → 永不回收
```

**防**：`'use strict'`（严格模式禁止隐式全局，直接报错）、
ESLint 的 `no-implicit-globals` 规则。

### 2. 忘清除的定时器/监听

```js
// 组件挂了个定时器，卸载忘了清
const timer = setInterval(() => {
  updateSomething()          // 闭包引用了整个组件状态 → 全泄漏
}, 1000)
// 组件没了，timer 还在跑，闭包里的东西全活着
```

```js
// ✅ 卸载时清
onUnmounted(() => clearInterval(timer))

// ✅ 事件监听同理
window.addEventListener('resize', handler)
onUnmounted(() => window.removeEventListener('resize', handler))
```

**框架里用 useDebounceFn/useEventListener 这类 composable 自动清理**，
别手写。

### 3. DOM 引用没释放

```js
const elements = {}

function bindClick(id) {
  elements[id] = document.getElementById(id)   // 存了一堆 DOM 引用
  elements[id].onclick = () => console.log(id)
}

function removeElement(id) {
  document.getElementById(id).remove()         // DOM 从页面删了
  // 但 elements[id] 还指着它 → 不可达性分析认为它活着 → 泄漏！
}
```

**防**：删 DOM 时，把引用它的变量也清掉
（`delete elements[id]`）。Vue/React 的 ref 同理 ——
组件卸载，ref 置空。

### 4. 闭包持有大对象

```js
function createHandler() {
  const hugeData = loadHugeFile()      // 几 MB 数据
  return function clickHandler(e) {
    console.log(e.target.id)           // 其实只用了个 id
    // hugeData 被闭包「顺带」持有，handler 活着它就活着
  }
}
```

**防**：闭包里只留需要的。用完了 `hugeData = null` 断引用，
或者把需要的数据结构重组成「只带必要的」。

## 四、排查工具

### 浏览器（Chrome DevTools）

```text
Memory 面板 → Heap snapshot
  1. 操作页面（触发可疑流程）
  2. 拍快照 A
  3. 再操作一遍
  4. 拍快照 B
  5. 对比 B - A：多出来的对象就是嫌疑（看 Retained Size 大的）
```

**Retained Size**（释放后能省的内存）比 Shallow Size 更有参考价值。
看到「Detached DOMTree」多了一堆 → 典型的 DOM 泄漏。

### Node

```bash
node --expose-gc app.js            # 手动触发 GC（调试用）
```

或 `process.memoryUsage()` 打点监控，`heapdump` 库生成快照，
Chrome DevTools 加载分析。

**Node OOM 的典型场景**：全局缓存无上限、队列堆积、
`process.on('uncaughtException')` 里继续跑（状态已脏）。

## 五、实用建议（不是玄学）

1. **别过早优化内存**。JS 引擎很聪明，大多数代码的 GC 压力
  它扛得住。先写对，卡了再查；
2. **优先防「泄漏」而非「少分配」**。泄漏是 bug，
  分配多是特性（临时对象便宜得很）；
3. **长生命周期对象要盯**：全局缓存、连接池、事件总线 ——
   它们只涨不跌就是泄漏前兆；
4. **用框架的清理机制**（onUnmounted/useEffect cleanup），
   别手动管定时器 —— 忘一次毁所有。

## 六、WeakRef 与 WeakMap（冷门但有用）

```js
const cache = new WeakMap()      // 键是弱引用
let key = { id: 1 }
cache.set(key, '数据')
key = null                        // key 不可达 → 整个条目可被回收
```

**WeakMap/WeakSet 适合当缓存**：不影响对象的回收命运，
对象没了缓存自动消失。普通 Map 当缓存 = 泄漏养成计划。

## 小结

GC 三句话：**可达性分析定生死、新对象死得快所以分代、
定时器/DOM 引用/全局变量是泄漏三巨头**。
排查靠快照对比（Memory 面板），预防靠「卸载时清理 +
缓存有上限 + 闭包别贪心」。多数人一辈子不用管 GC ——
但管的人，出的都是别人修不动的 bug。
