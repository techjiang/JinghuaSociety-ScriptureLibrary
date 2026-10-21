---
title: JavaScript 事件循环
createTime: 2026-10-21
permalink: /tech/js-event-loop/
description: 调用栈、任务队列、微任务，把 setTimeout 和 Promise 的执行顺序讲透
---

# JavaScript 事件循环

面试常考题，但我不打算按面试套路讲。就从一个真实困惑出发：
**下面这段代码，输出顺序是什么？**

```js
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')
```

答案是 `1 → 4 → 3 → 2`。注意 `2` 明明是 0 毫秒延时，却排在最后。
搞懂这件事，就搞懂了事件循环。

## 一、JavaScript 是单线程

JS 设计出来是给浏览器用的，要操作 DOM。如果多个线程同时改 DOM，
一个删一个改，页面就乱了。所以 JS 的主线程只有一个：
**同一时刻只干一件事**。

那计时器、网络请求这些「等」的活谁干？浏览器内核（或 Node 的 C++ 层）。
JS 主线程只管发起，等有了结果，再把回调扔回主线程执行。

## 二、调用栈和任务队列

主线程的执行结构分两部分：

**调用栈（Call Stack）**：同步代码在这执行，后进先出。
函数调用就入栈，return 就出栈。

```js
function a() { console.log('a') }
function b() { a(); console.log('b') }
b()
// 栈：b 入 → a 入 → a 出（打印 a）→ b 出（打印 b）
```

**任务队列（Task Queue）**：异步操作（定时器、事件、IO）完成后，
它们的回调在这排队，等调用栈空了再进来执行。

![事件循环模型](/images/event-loop.svg)

*图：调用栈空了先清微任务，微任务见底才取一个宏任务，如此循环*

事件循环（Event Loop）就干一件事：**盯着调用栈，空了就把任务队列里的
第一个回调拿出来执行**。循环往复，直到没有任务。

## 三、两种任务：宏任务和微任务

任务队列其实分两档，优先级不同：

**宏任务（Macrotask）**：
- `setTimeout` / `setInterval`
- DOM 事件回调（click、scroll）
- `fetch` 的 onload、`XMLHttpRequest`
- Node 里的文件 IO、网络 IO

**微任务（Microtask）**：
- `Promise.then/catch/finally`
- `async/await` 后面的代码（await 挂起后恢复的部分）
- `queueMicrotask()` 显式创建的
- `MutationObserver`

规则：**每一轮循环里，调用栈空了之后，先把微任务队列全部清空，
才去取一个宏任务执行**。微任务之间也按顺序，而且微任务执行期间
产生的新的微任务，也会在这一轮被清掉（直到队列见底）。

## 四、回到开头那道题

逐行跑一遍：

```js
console.log('1')                    // 同步，打印 1
setTimeout(() => console.log('2'), 0)  // 定时器回调进【宏任务】队列
Promise.resolve().then(() => console.log('3'))  // then 回调进【微任务】队列
console.log('4')                    // 同步，打印 4
```

同步代码跑完（输出 1、4），调用栈空了。这时事件循环先清微任务：
输出 3。微任务见底，才取宏任务：输出 2。

所以顺序是 `1 → 4 → 3 → 2`。**0 毫秒只是「尽快」的意思，不是「插队」，
宏任务再急也得等微任务全清完**。

## 五、async/await 的糖

`async/await` 本质是 Promise 的语法糖：

```js
async function main() {
  console.log('a')
  await Promise.resolve()
  console.log('c')
}
main()
console.log('b')
```

输出 `a → b → c`。`await` 那行执行后，函数在这里「挂起」，
控制权还给外层，外层继续同步执行（打印 b）。
当前同步代码跑完、微任务清理时，恢复 `main` 的执行（打印 c）。

记法：**await 后面的代码，相当于塞进了微任务队列**。

## 六、一个常见陷阱：setTimeout(fn, 0) 不保证准时

```js
setTimeout(() => console.log('timeout'), 0)
// 如果主线程这时候卡了个 3 秒的同步计算，timeout 至少等 3 秒
```

因为定时器只负责「到点后把你放进队列」，执行时机取决于主线程什么时候
空出来。所以大计算量任务最好切片（分片 + setTimeout 接力）或者丢
Web Worker，别占着主线程。

## 七、浏览器和 Node 的差异

模型一样，细节有别：

- **浏览器**：事件循环由渲染时机驱动，`requestAnimationFrame`
  在渲染前执行，比定时器更适合做动画；
- **Node**：阶段更多（timers → pending → poll → check → close），
  `process.nextTick` 的优先级甚至高过 Promise 微任务；
  `setImmediate` 和 `setTimeout(fn, 0)` 在 Node 里的顺序不固定，
  取决于代码跑在哪个阶段。

写业务代码其实感知不到这些差异，但面试爱问。知道「模型同源、调度细节
不同」就够了。

## 八、速查表

| 场景 | 归宿 |
| --- | --- |
| 普通同步代码 | 调用栈，立即执行 |
| `setTimeout` / `setInterval` | 宏任务队列 |
| 事件回调（click 等） | 宏任务队列 |
| `Promise.then` | 微任务队列 |
| `await` 后续代码 | 微任务队列（挂起恢复） |
| `queueMicrotask` | 微任务队列 |
| `requestAnimationFrame` | 渲染前，独立时机 |

## 小结

事件循环就一句话：**同步代码优先，同步完了清空所有微任务，微任务清了
才轮到一个宏任务，如此循环**。把这句话和开头那道题对照一遍，
以后谁再问你 `setTimeout 0` 和 `Promise.then` 谁快，直接甩结论。
