---
title: ES6+ 常用语法速成
createTime: 2026-10-22
permalink: /library/tutorial/es6-syntax/
description: 解构、展开、箭头函数、可选链、Promise、模块——每天必用的现代 JS
---

<CategoryTag name="教程" link="/library/tutorial/" />

# ES6+ 常用语法速成

ES6（ES2015）已经十年了，之后的 ES2016-ES2023 又加了不少好用的。
这篇只收**每天都在用**的，冷门特性（Proxy、Reflect、Generator）
一句带过。会 ES5 的人，这篇是迁移手册。

## 一、let 和 const：告别 var

```js
var a = 1      // 老写法：函数作用域、会提升、能重复声明
let b = 2      // 块级作用域，不能重复声明
const c = 3    // 块级作用域，不能重新赋值
```

**规矩：默认 const，要变的用 let，永远不用 var。**
const 的「不能重新赋值」指的是绑定不变，对象内容照改：

```js
const user = { name: '张三' }
user.name = '李四'     // ✅ 可以（改属性）
user = {}              // ❌ 报错（换绑定）
```

## 二、解构：一步取多个值

```js
// 数组解构
const [first, second] = [1, 2]
const [, skip] = [1, 2]                    // 跳过第一个

// 对象解构（最常用）
const user = { name: '张三', age: 25, address: { city: '北京' } }
const { name, age } = user
const { address: { city } } = user          // 嵌套解构

// 函数参数解构
function greet({ name, greeting = '你好' }) {   // 顺便带默认值
  return `${greeting}，${name}`
}
greet({ name: '张三' })                    // '你好，张三'

// 交换变量（经典面试题，实际也常用）
let a = 1, b = 2
;[a, b] = [b, a]                           // a=2, b=1
```

## 三、展开语法：数组和对象的「合并神器」

```js
// 数组合并
const arr1 = [1, 2]
const arr2 = [3, 4]
const merged = [...arr1, ...arr2]          // [1,2,3,4]
const copy = [...arr1]                     // 浅拷贝

// 对象合并（后面的覆盖前面的）
const defaults = { role: 'user', lang: 'zh' }
const custom = { lang: 'en' }
const config = { ...defaults, ...custom }  // { role:'user', lang:'en' }

// 函数收集剩余参数
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0)
}
sum(1, 2, 3)                               // 6
```

React/Vue 里「不可变更新」全靠它（`setUser({...user, name})`），
详见 [React 篇](../react-quickstart.md)。

## 四、箭头函数：this 不再乱跑

```js
const add = (a, b) => a + b
const double = (x) => x * 2
const get = () => ({ name: '张三' })       // 返回对象要加括号

// 和 this：箭头函数没有自己的 this，用外层的
class Counter {
  count = 0
  // 老写法：方法里 this 可能丢
  startBad() { setInterval(function () { this.count++ }, 1000) }   // this 是 undefined！
  // 箭头函数：this 永远指向实例
  startGood() { setInterval(() => { this.count++ }, 1000) }
}
```

回调、数组方法里一律箭头函数，省心。

## 五、模板字符串：告别拼串

```js
const name = '张三'
// 老：'你好，' + name + '！'
const msg = `你好，${name}！`
const html = `<div class="card">${name}</div>`    // 多行也支持
```

## 六、可选链与空值合并：少写一百个 if

```js
const user = { profile: { name: '张三' } }

// 老写法：层层判断
const city = user && user.address && user.address.city

// 可选链 ?.
const city = user?.address?.city           // 中间断了返回 undefined
arr?.[0]                                   // 数组也行
fn?.()                                     // 函数存在才调

// 空值合并 ??（只认 null/undefined，0 和 '' 是合法值）
const port = config.port ?? 3000           // config.port 是 0 时也用 0
// 对比 ||：0 || 3000 = 3000（把 0 当假值，坑！）
```

**`||` 和 `??` 的区别是经典坑**：`||` 把所有假值（0、''、false）
都当「没有」，`??` 只认 null/undefined。配置默认值用 `??`。

## 七、Promise 与 async/await

```js
// Promise：异步操作的「凭证」
const p = fetch('/api/user')
p.then(res => res.json()).then(data => console.log(data))
p.catch(err => console.error(err))

// async/await：异步写成同步样（现代主流）
async function loadUser() {
  try {
    const res = await fetch('/api/user')
    return await res.json()
  } catch (err) {
    console.error(err)
  }
}
```

深入（事件循环、并发控制）在[异步实战](../js-async.md)和
[事件循环](../js-event-loop.md)，这篇记住「await 等 Promise」就够。

## 八、模块：import/export

```js
// math.js
export const add = (a, b) => a + b          // 命名导出
export default function multiply(a, b) { return a * b }   // 默认导出

// app.js
import multiply, { add } from './math.js'   // 默认与命名共存
import * as math from './math.js'           // 全部导入
```

浏览器原生支持（`<script type="module">`），构建工具全支持。
细节在 [JS 模块化](../js-modules.md)。

## 九、数组/对象新方法

```js
// 数组
arr.includes(3)                            // 有没有（比 indexOf 直观）
arr.find(u => u.id === 1)                  // 找第一个匹配的元素
arr.findIndex(u => u.id === 1)             // 找下标
arr.flat()                                 // [[1],[2]] → [1,2]
arr.flatMap(x => [x, x * 2])               // map + flat
Array.from({ length: 3 }, (_, i) => i)     // [0,1,2] 生成数组
new Set(arr).size                          // 去重后数量

// 对象
Object.entries({ a: 1 })                   // [['a',1]]（遍历神器）
Object.assign({}, a, b)                    // 合并（展开语法的前身）
Object.keys(obj) / Object.values(obj)
```

数组方法的完整实战在 [JS 数组方法](../js-array.md)。

## 十、class 简写

```js
class User {
  name = '匿名'                    // 类字段（不用写构造函数）
  #secret = '私有'                 // 真私有（外部访问不到）

  constructor(name) {
    if (name) this.name = name
  }

  greet() { return `你好，${this.name}` }    // 方法简写

  static create(name) { return new User(name) }   // 静态方法
}
```

## 小结

ES6+ 日常九件套：**const/let、解构、展开、箭头函数、
模板字符串、可选链、??、async/await、import/export**。
老项目见到这些语法别慌，都是「语法糖包着老逻辑」。
迁移建议：新文件直接用，老文件别大改 —— 能跑就别动，
这是[重构笔记](../../articles/reading-refactoring.md)的智慧。
