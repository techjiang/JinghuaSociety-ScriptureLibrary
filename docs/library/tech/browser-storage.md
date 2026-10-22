---
title: 浏览器存储完全指南
createTime: 2026-10-22
permalink: /library/tech/browser-storage/
description: Cookie/localStorage/sessionStorage/IndexedDB/Cache Storage 的对比与选型
---

# 浏览器存储完全指南

浏览器给了五种存数据的地方，很多项目只用 localStorage 一种。
每种有自己的脾气：容量、生命周期、API、能不能被 Service Worker 碰。
选错了，要么存不下，要么隐私出事。这篇横向对比加选型建议。

## 一、五兄弟姐妹总览

| | Cookie | localStorage | sessionStorage | IndexedDB | Cache Storage |
| --- | --- | --- | --- | --- | --- |
| 容量 | ~4KB | ~5MB | ~5MB | 磁盘配额（GB 级） | 磁盘配额 |
| 生命周期 | 可设过期 | 永久 | 标签页关闭就没 | 永久 | 永久 |
| 和服务端交互 | 每次请求自动带 | 不参与 | 不参与 | 不参与 | 不参与 |
| API | `document.cookie` | 同步 KV | 同步 KV | 异步、事务、索引 | 异步 |
|  Workers 能碰 | ✅ | ❌ | ❌ | ✅ | ✅ |
| 适合存 | 登录态、偏好 | 令牌、设置 | 表单草稿 | 结构化大数据 | 离线资源 |

## 二、逐个说

### localStorage：最常用的同步 KV

```js
// 存（值会被 toString，对象要先 JSON.stringify）
localStorage.setItem('user', JSON.stringify({ name: '张三' }))

// 取
const user = JSON.parse(localStorage.getItem('user') || 'null')

// 删
localStorage.removeItem('user')
```

特点：

- **同步 API**，大数据量会卡渲染线程（存 1MB 字符串试试）；
- 同域名所有标签页共享（一个页面改，其他页面能收到
  `storage` 事件）；
- 永不过期，用户不清理就一直在。

适用：用户设置、主题偏好、不大的令牌。
不适用：大量数据、频繁读写、敏感数据。

### sessionStorage：一次性的便签

API 和 localStorage 一模一样，区别在**生命周期跟随标签页**：
关掉页面就没了；同域名的**不同标签页不共享**（各存各的）。

经典场景：多步表单的中间状态。用户在新标签页又开一个表单，
两份草稿互不干扰。

### IndexedDB：浏览器里的数据库

存大量结构化数据的正规军：

```js
// 打开/创建数据库（版本号变了会触发升级回调）
const request = indexedDB.open('my-db', 1)

request.onupgradeneeded = (e) => {
  const db = e.target.result
  const store = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true })
  store.createIndex('by_date', 'createdAt')
}

request.onsuccess = (e) => {
  const db = e.target.result
  // 写入
  const tx = db.transaction('notes', 'readwrite')
  tx.objectStore('notes').add({ text: '笔记内容', createdAt: Date.now() })
}
```

特点：

- 异步，不卡界面；
- 支持索引、事务、游标 —— 是数据库，不是 KV；
- 容量 GB 级（看浏览器和磁盘）。

适用：离线应用数据、大量记录（笔记、消息、日志）。
不适用：简单配置（杀鸡用牛刀，API 还啰嗦）。

**别裸写 IndexedDB**，封装库省一半代码：
[`idb`](https://github.com/jakearchibald/idb)（Google 出品，Promise 化，
几 KB）、[Dexie](https://dexie.org)（功能全）。

### Cache Storage：给离线用的

配合 Service Worker 用，存的是 **HTTP 请求和响应的配对**：

```js
// Service Worker 里
const cache = await caches.open('v1')
await cache.add('/index.html')
await cache.addAll(['/style.css', '/app.js'])

// 请求来的时候先查缓存
const cached = await cache.match('/style.css')
if (cached) return cached
```

这是 PWA 离线能力的底座。普通业务基本用不上 ——
除非你要做「没网也能用」的应用。

### Cookie：为了 HTTP 而生的老兵

现在用法越来越窄：**只干它擅长的 —— 跟着请求自动跑**。
登录态（HttpOnly Cookie）、服务端需要的少量标识。

别再拿 Cookie 存业务数据了：每次请求都带（浪费流量）、
4KB 上限、API 难用（`document.cookie` 那套字符串操作谁用谁知道）。

## 三、隐私模式与清理

- **隐身/隐私模式**：localStorage 能用，但关窗即焚（各浏览器实现有差异）；
- **用户清理**：浏览器的「清除浏览数据」会清掉 localStorage 和
  IndexedDB（Cookie 可选）。所以**重要数据必须能重新获取** ——
  本地存储当缓存，不当唯一真相源；
- **配额**：localStorage 写满了会抛 `QuotaExceededError`。
  大批量写入要做 try/catch 和 LRU 清理。

## 四、storage 事件：跨标签页通信

```js
window.addEventListener('storage', (e) => {
  console.log(`${e.key} 从 ${e.oldValue} 变成 ${e.newValue}`)
})
```

一个标签页改了 localStorage，**同域名其他标签页**收到事件。
做「多标签页同步登出」「主题同步切换」就用它。
注意：**当前改的标签页不触发**（只通知别人）。

## 五、选型决策

```text
要存的数据
  ├─ 登录态/服务端要读的小标识 → Cookie（HttpOnly）
  ├─ 用户设置、主题、不大的令牌 → localStorage
  ├─ 表单草稿、单次流程状态 → sessionStorage
  ├─ 结构化大数据、离线查询 → IndexedDB
  └─ 离线可用的页面/资源 → Cache Storage（Service Worker）
```

安全红线：

- **令牌优先 HttpOnly Cookie**，必须放 localStorage 时，
  把 XSS 防御做到位（转义 + CSP）；
- 任何本地存储都别存密码、身份证号这类东西 ——
  用户电脑不属于你的信任域。

## 小结

浏览器存储五个坑位：**Cookie 管请求自带、localStorage 管常用配置、
sessionStorage 管临时草稿、IndexedDB 管大数据、Cache 管离线**。
日常开发前三個覆盖九成场景。记住「本地存储是缓存不是数据库」，
用户清了数据你的应用不能崩 —— 这是底线。
