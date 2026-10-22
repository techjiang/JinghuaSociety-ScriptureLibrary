---
title: HTTP 缓存详解
createTime: 2026-10-21
permalink: /library/tech/http-cache/
description: 强缓存、协商缓存、缓存位置，以及一套生产可用的缓存策略
---

# HTTP 缓存详解

缓存是前端性能优化里性价比最高的一项：一次配置，全站受益。
但它也是被误解最多的一项 —— 很多人分不清 `Cache-Control` 和 `ETag`
谁管哪段，出了问题就只会「强制刷新一下」。

这篇把机制讲清楚，再给一套能直接用的策略。

## 一、缓存发生在哪

浏览器拿到一个资源，缓存可能命中在三个地方：

1. **内存缓存（Memory Cache）**：最快，关了标签页就没；
2. **磁盘缓存（Disk Cache）**：慢一点，持久，重启浏览器还在；
3. **Service Worker 缓存**：PWA 那套，能完全拦截请求，最灵活。

前两个是浏览器自动管的，我们写代码控制不了具体存哪，只能通过响应头
决定「能不能存、存多久、怎么校验」。

## 二、两类缓存：强缓存和协商缓存

### 强缓存：根本不问服务器

浏览器看响应头里的新鲜度，在有效期内**直接拿本地副本，一个请求都不发**。
相关头：

- `Cache-Control: max-age=3600` —— 一小时内有效（单位秒），HTTP/1.1 主力；
- `Expires: Wed, 21 Oct 2026 00:00:00 GMT` —— 绝对过期时间，HTTP/1.0 遗留，
  受客户端时钟影响，能被改，不如 `max-age` 可靠。

两个同时存在时 `Cache-Control` 优先。另外几个常用指令：

| 指令 | 含义 |
| --- | --- |
| `no-store` | 完全不缓存，每次都重新下载 |
| `no-cache` | 可以存，但每次用之前必须回服务器验证 |
| `private` | 只给浏览器缓存，CDN/代理别存 |
| `public` | 谁都能存（包括中间代理） |
| `immutable` | 我这辈子都不会变，有效期內别再问了 |

注意 `no-cache` 这个名字有迷惑性：它不是「不缓存」，是「每次都要验证」。
真正「不缓存」是 `no-store`。这个坑过不少人。

### 协商缓存：问问服务器还能不能用

强缓存过期后，浏览器带着「本地副本的标识」去问服务器：我这份还能用吗？
服务器说能（304 Not Modified，不带 body，很省流量）就用副本；
说不能（200 + 新内容）就下载新的。

标识有两种配对方式：

**Last-Modified / If-Modified-Since**（时间戳配对）

- 首次响应：`Last-Modified: Wed, 21 Oct 2026 08:00:00 GMT`
- 再次请求：浏览器带 `If-Modified-Since: 上面那个时间`
- 服务器比对文件修改时间，没变就回 304

**ETag / If-None-Match**（内容指纹配对）

- 首次响应：`ETag: "33a64df5"`
- 再次请求：浏览器带 `If-None-Match: "33a64df5"`
- 服务器比对内容指纹（通常是内容哈希），没变就回 304

ETag 优先级高于 Last-Modified。为什么需要两套？因为 Last-Modified
有两个毛病：一是秒级精度，一秒内多次改辨别不出；二是文件内容没变、
只是改了个名字再改回来，时间戳也会变。ETag 看内容，更准。

## 三、一次完整请求长什么样

```text
第一次请求 index.html
  浏览器：给我 index.html
  服务器：200 OK
         Cache-Control: no-cache
         ETag: "abc123"
  （浏览器存下副本 + ETag）

一分钟后用户刷新
  浏览器：我这有份 ETag 是 "abc123" 的 index.html，还能用吗？
  服务器：304 Not Modified（没 body，几十字节）
  （浏览器用本地副本渲染）

换成请求 main.8f3k2.js（带 hash 的静态资源）
  浏览器：给我 main.8f3k2.js
  服务器：200 OK
         Cache-Control: max-age=31536000, immutable
  浏览器：存！一年内谁问我都不理
```

![HTTP 缓存决策流程](/images/http-cache-flow.svg)

*图：一次页面刷新时，浏览器和服务器的完整内心戏*

看出区别了吗：**HTML 走协商缓存（可能要更新），静态资源走强缓存
（文件名带 hash，内容变则文件名变）**。这是现代构建工具的标准玩法。

## 四、一套生产可用的策略

假设前端用 Vite/Webpack 构建，产物带内容 hash：

**HTML 文件**：

```nginx
location / {
  add_header Cache-Control "no-cache";
}
```

HTML 是入口，必须每次验证，不然发了新版用户还在用旧页面。

**带 hash 的静态资源**（JS/CSS/图片，文件名如 `main.8f3k2.js`）：

```nginx
location ~* \.(js|css|png|jpg|svg|woff2)$ {
  add_header Cache-Control "max-age=31536000, immutable";
}
```

文件名带 hash，内容一改文件名就变，等于天然版本号，缓存一年都安全。
`immutable` 告诉浏览器连验证都省了，刷新时一个字都不问。

**API 请求**：一般不缓存，或者 `no-store`：

```nginx
location /api/ {
  add_header Cache-Control "no-store";
}
```

接口数据实时性优先，缓存了反而容易出怪问题。

## 五、踩坑记录

**坑一：发了新版本，用户没变化**
九成是 HTML 被强缓存了。检查 HTML 的响应头，是不是被谁加了
`max-age`。HTML 用 `no-cache`，让用户每次拿到最新入口。

**坑二：304 了但内容明明是新的**
用了 Last-Modified，而文件时间戳没变（比如某些 CI 会把 mtime 抹平）。
换 ETag 方案，看内容不看时间。

**坑三：本地明明好了，线上不行**
中间有 CDN。CDN 也读 `Cache-Control`，`max-age` 太长的话节点会囤旧货。
HTML 上 CDN 一般要单独配置回源校验，别只改源站。

**坑四：debug 时缓存捣乱**
DevTools 打开 Network 面板，勾 `Disable cache`（仅 DevTools 打开时生效），
或者硬刷新 `Ctrl+Shift+R`。注意这只是本地行为，不代表用户那边。

## 六、自检命令

```bash
curl -I https://你的网站/index.html
```

`-I` 只看响应头。能看到 `Cache-Control`、`ETag` 之类的字段，
对照上面的策略逐项检查，比在浏览器里瞎猜快得多。

## 小结

记住三句话：**HTML 走协商缓存，hash 资源走长期强缓存，接口别缓存**。
机制上，强缓存靠 `Cache-Control` 定生死，协商缓存靠 ETag/Last-Modified
对指纹。配置一次，受益全年，这就是缓存的性价比。
