---
title: 异步编程实战：从回调到 async/await
createTime: 2026-10-22
permalink: /library/tutorial/js-async/
description: Promise 链、async/await、并发控制与错误处理，附真实场景代码
---
异步是 JS 的核心难题。请求接口、读文件、定时器 —— 全都不能「马上拿到」。
写法从回调地狱演进到 async/await，但坑一个没少。这篇讲现代写法
（Promise + async/await）和实战中最容易栽的跟头。

## 一、Promise 基础：三个状态

一个 Promise 就是个「以后有结果」的凭证：

```text
pending（进行中）→ fulfilled（成功，拿到值）
                 → rejected（失败，拿到原因）
```

状态一旦定了就不能改。所以：

```js
const p = fetch('/api/user')
p.then((res) => res.json()).then((data) => console.log(data))
p.then((data) => console.log('还会触发'))  // then 可以加多个，都按顺序执行
```

## 二、async/await：异步写成同步样

```js
async function loadUser(id) {
  const res = await fetch(`/api/user/${id}`)
  const user = await res.json()
  return user.name
}
```

`await` 的意思是「等这个 Promise 出结果，拿到值再往下走」。
读起来跟同步代码一模一样，这就是它干掉的回调地狱。

三个铁律：

1. **await 只在 async 函数里用**（顶层 await 在 ESM 里可以，但兼容性注意）；
2. **await 一个非 Promise 也行**（原样返回），但没意义；
3. **async 函数永远返回 Promise**（return 的值会被包起来）。

## 三、错误处理：try/catch 包围 await

```js
async function loadUser(id) {
  try {
    const res = await fetch(`/api/user/${id}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)  // fetch 不 reject 4xx/5xx！
    return await res.json()
  } catch (err) {
    console.error('加载用户失败:', err)
    return null  // 或者抛给调用方，看设计
  }
}
```

**最容易踩的坑：fetch 不会因为 404/500  reject**，它只在网络层失败
（断网、DNS 错误）时 reject。HTTP 错误码要自己查 `res.ok`。

## 四、并发：别一个个挨着等

新手常犯的错：

```js
// 慢！三个请求排队，总时间 = 三个加起来
const a = await fetch('/api/a')
const b = await fetch('/api/b')
const c = await fetch('/api/c')
```

互相独立的请求，应该同时发：

```js
const [a, b, c] = await Promise.all([
  fetch('/api/a'),
  fetch('/api/b'),
  fetch('/api/c'),
])
```

`Promise.all`：**全部成功才 resolve，一个失败整体失败**。
实际场景里，一个接口挂了你可能还想拿其他的：

```js
const results = await Promise.allSettled([
  fetch('/api/a'),
  fetch('/api/b'),
  fetch('/api/c'),
])
// results: [{status:'fulfilled', value:…}, {status:'rejected', reason:…}, …]
```

`allSettled` 永远成功，逐个看状态 —— **聚合接口场景的第一选择**。

还有一个 `Promise.race`：谁先出结果用谁（比如给请求加超时）：

```js
const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('超时')), ms)),
  ])
```

## 五、顺序执行的并发：控制数量

十个请求同时发，浏览器同域最多 6 个并发，服务端也可能限流。
需要「一批批来」：

```js
async function runInBatches(items, batchSize, task) {
  const results = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(task))
    results.push(...batchResults)
  }
  return results
}

// 每次并发 3 个处理 100 个任务
await runInBatches(urls, 3, (url) => fetch(url))
```

简单场景够用了。要精细控制（优先级、动态并发数），上
`p-limit` 这类库。

## 六、实战：带重试的请求

真实项目里，接口偶尔抽风，重试一次就好：

```js
async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (i === retries) throw err  // 最后一次还失败，抛出去
      // 退避：等 1s、2s、4s… 别把对方打得更惨
      await new Promise((r) => setTimeout(r, 2 ** i * 1000))
    }
  }
}
```

指数退避（等的时间翻倍）是基本礼仪 —— 对方已经过载了，
你 100ms 重试一次是鞭尸。

## 七、async 函数的两个注意

### 别忘 await

```js
async function bad() {
  const data = fetchData()      // 忘了 await！返回的是 Promise
  console.log(data.length)      // undefined，因为 Promise 没有 length
}
```

ESLint 的 `require-await` 规则能抓这个。装了 ESLint 就打开。

### for 循环里 await 的取舍

```js
// 挨个处理（有依赖关系时正确）
for (const item of items) {
  await process(item)
}

// 同时处理（无依赖时更快，但并发要控制）
await Promise.all(items.map((item) => process(item)))
```

`forEach` 里写 await **不work**（forEach 不等 Promise）：

```js
items.forEach(async (item) => {
  await process(item)  // forEach 不等它，函数早就返回了
})
console.log('done')   // 这里 done 时，process 一个都没完成
```

要等全部完成，用 `for...of` + await，或者 `Promise.all` + map。

## 八、Node 与浏览器的差异

- 浏览器里 `fetch` 是标配；Node 18+ 也有全局 `fetch`，18 以下用 `axios` 或 `node-fetch`；
- Node 里还有回调风格的老 API（`fs.readFile`），新代码用 `fs/promises` 的版本：

```js
const { readFile } = await import('node:fs/promises')
const content = await readFile('./config.json', 'utf-8')
```

- 定时器 `setTimeout` 在两边一样，但 Node 有 `setImmediate`/`process.nextTick`（微任务之前执行，少用）。

## 小结

现代异步三板斧：**async/await 写主流程、Promise.all/allSettled 管并发、
try/catch 兜错误**。牢记「fetch 不 reject 4xx」和「forEach 不等 await」
这两个坑，就避开八成异步事故。执行顺序的细节（微任务宏任务）在
[事件循环](../js-event-loop.md) 那篇，两篇配合看效果最佳。
