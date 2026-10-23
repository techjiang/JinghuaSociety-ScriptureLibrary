---
title: 浏览器缓存与存储辨析
createTime: 2026-10-22
permalink: /library/tech/cache-vs-storage/
description: HTTP 缓存、Service Worker 缓存、Storage 各管一摊，别混用
---

<CategoryTag name="技术" link="/library/tech/" />

# 浏览器缓存与存储辨析

「缓存」这个词在浏览器里有三个完全不同的东西：
**HTTP 缓存**（网络层）、**Cache Storage**（SW 层）、
**Web Storage**（应用层）。用途、API、生命周期全不一样。
混用的结果：该更新的不更新，该存的没存。这篇一次分清。

## 一、三兄弟对比

| | HTTP 缓存 | Cache Storage | localStorage |
| --- | --- | --- | --- |
| 是什么 | 浏览器自动的网络响应缓存 | Service Worker 管理的请求/响应对 | JS 的 KV 存储 |
| 谁控制 | 响应头（Cache-Control） | 你的 SW 代码 | 你的 JS 代码 |
| 存什么 | HTML/CSS/JS/图片 的响应 | 同上，甚至整个应用 | 字符串 KV |
| 页面关了 | 还在（磁盘缓存） | 还在 | 还在 |
| 清缓存 | 用户清浏览数据 | SW 代码/清浏览数据 | 用户清/代码清 |
| 典型用途 | 加速重复访问 | 离线应用（PWA） | 用户设置、令牌 |

（sessionStorage 和 IndexedDB 在
[浏览器存储那篇](./browser-storage.md) 细讲。）

## 二、HTTP 缓存：浏览器的自动驾驶

**特征：全自动，你不用写代码，靠响应头控制。**

```http
Cache-Control: max-age=31536000, immutable   → 强缓存，一年内不问
Cache-Control: no-cache                       → 每次用前回服务器验证
Cache-Control: no-store                       → 根本不存
```

流程：

```text
请求 → 强缓存有效？ → 直接用（0 请求）
      ↓ 过期
      带验证信息问服务器 → 304 用副本 / 200 下新的
```

策略（[HTTP 缓存详解](./http-cache.md) 的结论）：

- HTML：`no-cache`（入口要新）；
- hash 静态资源：`max-age=1年`（内容变文件名变）；
- API：`no-store`。

**它的「存储上限」浏览器自己管**，LRU 淘汰，你不用操心。

## 三、Cache Storage：离线应用的军火库

**特征：全手动，Service Worker 代码控制。**

```js
// Service Worker 里
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('v1').then((cache) =>
      cache.addAll(['/', '/style.css', '/app.js'])     // 预存核心资源
    )
  )
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached || fetch(e.request)                       // 缓存优先，回源兜底
    )
  )
})
```

和 HTTP 缓存的区别：**SW 缓存是「应用逻辑」不是「浏览器策略」** ——
断网时返回什么、先网后缓存还是先缓存后网，全你说了算。

**它解决的 HTTP 缓存解决不了的问题**：完全离线可用。
（本站没接 SW —— 静态站 + HTTP 缓存已经够快，
PWA 那套留给「要当 App 用」的场景。）

## 四、Web Storage：应用的数据格子

**特征：JS 主动读写，跟网络无关。**

```js
localStorage.setItem('theme', 'dark')     // 存
localStorage.getItem('theme')             // 取
```

和缓存最大的区别：**这是「数据」不是「网络副本」**。

- 用户的主题偏好、草稿、令牌 —— 属于「应用状态」；
- 它不参与 HTTP 请求（不会自动发给服务器）；
- 不会被 HTTP 缓存头影响；
- 上限约 5MB，同步 API（大数据卡渲染）。

**别拿 localStorage 当缓存用**（有人把接口数据塞里面）——
没有过期机制、没有容量管理、同步 IO 卡顿。
接口数据的正确归宿是 HTTP 缓存（或内存 + SW）。

## 五、决策树：数据该放哪

```text
这份数据是？
├─ 网络响应的「副本」（接口数据、静态资源）
│   ├─ 让浏览器自动管 → HTTP 缓存（Cache-Control）
│   └─ 要完全离线可控 → Cache Storage + Service Worker
├─ 应用状态（用户设置、草稿、登录态）
│   ├─ 小（<5MB）、简单 → localStorage
│   └─ 大、结构化 → IndexedDB
└─ 一次性会话数据 → sessionStorage
```

**最常见的错误**：把接口返回塞 localStorage「防重复请求」。
后果：数据永远不更新（没有失效逻辑）、5MB 爆满、
同步 IO 卡页面。正确做法：让 HTTP 缓存干它的本职工作。

## 六、一个综合例子

一个新闻站的缓存全景：

```text
index.html          → Cache-Control: no-cache      （入口每次验证）
main.8f3k2.js       → max-age=1年                  （hash 资源永缓存）
/api/articles       → no-store                     （数据实时）
用户偏好（夜间模式） → localStorage                  （应用状态）
离线可读的文章      → IndexedDB                     （结构化大数据）
「安装到桌面」能力   → SW + Cache Storage           （PWA，可选）
```

每层干每层的事，谁也不越界 —— 这就是「分层清晰」的缓存架构。

## 七、排障：缓存捣乱时看哪

| 症状 | 查哪 |
| --- | --- |
| 改了代码用户没变化 | HTTP 缓存（HTML 的 no-cache 配了吗） |
| 接口返回旧数据 | HTTP 缓存（API 别缓存）/ 你自己的内存缓存 |
| 断网全白 | 没接 SW（或 SW 缓存策略太激进） |
| localStorage 数据「灵异消失」 | 用户清了/隐私模式/超额被挤 |
| DevTools 看着是新的 | Disable cache 勾了（只影响你自己） |

**DevTools Network 的 Size 列会告诉你**：
`(memory cache)`、`(disk cache)` —— 命中哪种一目了然。

## 小结

浏览器「缓存/存储」三兄弟：**HTTP 缓存自动管网络副本、
Cache Storage 手动管离线资源、Web Storage 存应用数据**。
分工记一句话：**网络层的事别用应用层存，应用层的数据别塞缓存**。
各自归位，天下太平。
