---
title: 一次网络请求的完整旅程
createTime: 2026-10-22
permalink: /library/tech/request-lifecycle/
description: 从敲下回车到看到像素，中间发生的十件事——全链路一图流
---

<CategoryTag name="技术" link="/library/tech/" />

# 一次网络请求的完整旅程

在浏览器敲回车，到页面显示，中间只过了 200 毫秒 ——
但这 200 毫秒里发生了十几件事。把全链路走一遍，
前面所有单点知识（DNS、TCP、HTTP、渲染）就串成了地图。

## 一、全景图

```text
① URL 解析
② DNS 查询（域名 → IP）
③ TCP 三次握手（或 QUIC）
④ TLS 握手（HTTPS）
⑤ 发送 HTTP 请求
⑥ 服务端处理（Nginx → 应用 → 数据库）
⑦ 返回 HTTP 响应
⑧ 浏览器解析 HTML → 构建 DOM
⑨ 请求子资源（CSS/JS/图片，重复 ②-⑦）
⑩ 渲染树 → 布局 → 绘制 → 显示
```

单点深入阅读：[DNS](../dns.md)、[TCP 握手](../tcp-handshake.md)、
[HTTPS/TLS](../https-tls.md)、[HTTP 缓存](../http-cache.md)、
[浏览器渲染](../browser-render.md)。

## 二、逐段拆解

### ① URL 解析：先搞清楚要什么

```text
https://techjiang.github.io/JinghuaSociety-ScriptureLibrary/
└─协议─┘└──────── 主机名 ────────┘└─────── 路径 ───────┘
```

浏览器从地址里提取：协议（https）、主机（techjiang.github.io）、
端口（https 默认 443）、路径。还处理：

- **HSTS 列表**：这个域名以前声明过「必须 HTTPS」→ 直接跳 HTTPS；
- **编码**：中文/空格转 percent-encoding（`%E4%B8%AD`）。

### ② DNS：域名变 IP

```text
浏览器缓存 → 系统缓存 → hosts 文件 → DNS 服务器（递归+迭代）
```

第一次访问慢在这（几十到几百毫秒）；第二次浏览器缓存直接命中。
CDN 场景还会「就近分配节点」（见 [CDN](../cdn.md)）。

### ③ TCP 握手：建立可靠连接

三次握手（[详细](../tcp-handshake.md)）：

```text
客户端 SYN → 服务端 SYN+ACK → 客户端 ACK
```

一个 RTT（往返）。同城机房一次握手 10-30ms，跨国 150ms+。
HTTP/3 用 QUIC，把这步和 TLS 合并，省一个 RTT。

### ④ TLS 握手：谈加密

1.3 版本一轮搞定：客户端问「你证书 + 我们用啥算法」，
服务端答，双方算密钥。之后所有流量加密。

（细节在 [HTTPS](../https-tls.md)，一句话：非对称换密钥，
对称传数据。）

### ⑤ 发请求：HTTP 报文

```http
GET /JinghuaSociety-ScriptureLibrary/ HTTP/1.1
Host: techjiang.github.io
User-Agent: Mozilla/5.0 …
Accept: text/html …
Cookie: session_id=abc…
```

浏览器自动带 Cookie（同源的）， UA、 Accept 等协商头。

### ⑥ 服务端处理：黑盒里的流水线

```text
Nginx（TLS 终止、静态缓存、反向代理）
  → 应用（Node/Python/Java：路由 → 鉴权 → 业务逻辑）
    → 数据库（查询，可能还有 Redis 缓存）
  → 拼响应
```

本站是纯静态：Nginx 直接吐 HTML，跳过应用层 ——
这也是它快的原因（少几跳）。

### ⑦ 返回响应：状态码 + 头 + 体

```http
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache
Set-Cookie: …
Content-Encoding: gzip

<html>…
```

浏览器看状态码（[状态码指南](./status-codes.md)）、
看缓存头决定要不要存（[缓存详解](../http-cache.md)）、解压 gzip。

### ⑧ 解析 HTML：构建 DOM

字节流 → 字符 → 标签 → 节点树（DOM）。
遇到 `<script src>` **暂停解析**，下载执行完才继续
（这就是 `defer/async` 存在的原因）；
遇到 `<link rel="stylesheet">` 也阻塞渲染（没 CSS 不敢画）。

### ⑨ 子资源：把 ②-⑦ 再来 N 遍

```text
index.html 解析完 →
  发现 css/js/图片 →
  每个都：DNS（已缓存）→ 连接（已建立，复用）→ 请求 → 响应
```

HTTP/1.1 一个连接排队发；HTTP/2 多路复用并行。
**优化大头在这**：合并请求、缓存、懒加载、CDN
（[性能优化](../web-performance.md)）。

### ⑩ 渲染：从 DOM 到像素

```text
DOM + CSSOM → 渲染树 → 布局（算位置）→ 绘制（填像素）→ 合成（上屏）
```

重排/重绘的优化在这（[浏览器渲染](../browser-render.md)）。
`DOMContentLoaded`（DOM 建好）和 `load`（资源全完）两个事件
标记关键节点。

## 三、200 毫秒都花在哪

一个典型加载的时间账（首次访问，同城机房）：

```text
DNS 查询          20ms   ██
TCP 握手           15ms   █
TLS 握手           30ms   ███
请求 HTML          10ms   █
服务端处理          40ms   ████
下载 HTML           15ms   ██
解析 + 子资源请求    50ms   █████
渲染                20ms   ██
────────────────────────
总计               ~200ms
```

**二次访问**：DNS/握手都省了（缓存+keep-alive），
静态资源本地命中 —— 能压到 50ms 以内。
这就是缓存的价值：**第一次付全额，后面付零头。**

## 四、排查问题按层定位

出问题时，按这条链逐段查：

| 症状 | 先查哪层 |
| --- | --- |
| 域名打不开 | DNS（dig +trace） |
| 连接超时 | 网络/防火墙/服务端没监听 |
| 502/504 | Nginx → 应用层（挂了/太慢） |
| 页面白屏但接口通 | 前端 JS 报错（Console） |
| 接口 200 但数据旧 | 缓存（CDN/浏览器） |
| 样式乱 | CSS 加载失败/被拦 |
| 慢但都能通 | 看 Network 瀑布流找最慢的那段 |

**DevTools Network 瀑布流就是这条链的可视化** ——
每段的耗时、等待、下载，一眼定位瓶颈在哪一跳。

## 五、一张「术语地图」

把本站相关文章按旅程顺序排：

```text
URL → [DNS 解析] → [TCP 握手] → [HTTPS] → [HTTP 缓存]
→ [状态码] → [CDN] → [JSON] → [浏览器存储] → [浏览器渲染]
→ [性能优化] → [SSR/SSG] → [SQL 注入] → [Web 安全]
```

单点都懂了，这张地图就是你的「排查路线图」。

## 小结

一次请求的旅程：**解析 URL → DNS → 握手 → TLS → 发请求 →
服务端 → 响应 → 解析 DOM → 子资源 → 渲染**。
十个环节，每个都可能出问题，每个都有对应优化。
把这张地图刻在脑子里，遇到故障按层排查，
比瞎猜快十倍 —— 这就是全链路思维。
