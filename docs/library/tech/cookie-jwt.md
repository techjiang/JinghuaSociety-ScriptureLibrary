---
title: Cookie、Session 与 JWT：登录态的三条路
createTime: 2026-10-22
permalink: /library/tech/cookie-jwt/
description: 三种保持登录状态的方案对比、安全设置与选型建议
---
「保持登录」是所有 Web 应用的基本需求，实现却不止一条路。
Cookie+Session 是老牌方案，JWT 是新贵，Token 满天飞。
这篇把三条路讲清楚，顺便把坑挖出来。

## 一、HTTP 是无状态的：问题起点

HTTP 请求之间互不认识。你登录后发的第二个请求，服务端默认
不知道你是刚才登录的那个人。所以需要一种「带着身份证」的机制。

三条路：**Cookie 自动带、Session 服务端存、JWT 自包含**。

## 二、方案一：Session + Cookie

最经典的组合。

```text
登录成功 → 服务端生成 session_id，存进 Redis（key=session_id, value=用户信息）
          → 通过 Set-Cookie 把 session_id 发给浏览器
之后请求 → 浏览器自动带上 Cookie: session_id=abc
          → 服务端拿 id 查 Redis → 知道你是谁
```

**优点**：服务端说了算，能随时踢人（删 Redis 记录即可）。
**缺点**：服务端要存状态，多台服务器要共享存储（Redis 集群）；
跨域场景麻烦（Cookie 默认不跨域发送）。

安全设置（Set-Cookie 的完整形态）：

```http
Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400
```

逐项说明：

| 属性 | 作用 |
| --- | --- |
| `HttpOnly` | JS 读不到，防 XSS 偷 Cookie |
| `Secure` | 只走 HTTPS，明文传输不发 |
| `SameSite=Lax/Strict` | 跨站请求不带，防 CSRF |
| `Path=/` | 全站有效 |
| `Max-Age` | 有效期（秒） |

**这三个属性（HttpOnly + Secure + SameSite）是登录 Cookie 的底线**，
少一个都是给攻击者留门。CSRF 的细节见
[Web 安全入门](./web-security.md)。

## 三、方案二：JWT（JSON Web Token）

换了个思路：**服务端不存状态，Token 自己带信息**。

JWT 分三段，点号分隔：

```text
eyJhbGciOiJIUzI1NiJ9  .  eyJzdWIiOiIxMjMifQ  .  SflKxwRJSMeKKF2QT4…
     Header（算法）          Payload（数据）         Signature（签名）
```

- **Payload**： Base64 编码的 JSON，**不是加密，谁都能解开看**！
  别往里放密码；
- **Signature**：用服务端密钥对前两段签名，**防篡改** ——
  改了 payload，签名对不上，服务端拒收。

流程：

```text
登录 → 服务端签发 JWT（含 user_id、过期时间）→ 前端存起来
      （localStorage 或 Cookie）
请求 → 前端在 Authorization 头带 JWT
      → 服务端验签名、看过期 → 信任 payload 里的 user_id
```

**优点**：服务端无状态，水平扩展容易；跨域/移动端友好
（不依赖 Cookie 机制）。
**缺点****：

1. **签发后难吊销** —— 有效期内的 JWT，服务端不查存储就不知道
   它是否已被「注销」。用户改密码、被封号，旧 Token 还能用
   （直到过期）。解法：短有效期（如 15 分钟）+ Refresh Token 轮换，
   或者维护黑名单（又变回有状态了）；
2. **体积大**：几百字节，每个请求都带，比 session_id 费流量；
3. **泄了就是全量信息**：Payload 谁都能解，所以 JWT 里别放敏感数据。

## 四、方案三：OAuth 2.0 第三方登录

「用微信/GitHub 登录」走的是另一套：**授权码模式**。

```text
① 用户点「用 GitHub 登录」→ 跳转 GitHub 授权页
② 用户同意 → GitHub 回调你的站点，带上授权码 code
③ 你的后端拿 code + 自己的 client_secret 找 GitHub 换 access_token
④ 你的后端拿 access_token 找 GitHub 要用户信息 → 建立自己的登录态
```

关键点：`client_secret` 只在后端，前端永远看不到；
回调的 `code` 一次性使用。这比「前端直连第三方」安全得多。

本站没接第三方登录（静态站没有后端逻辑），但原理值得懂 ——
企业应用几乎都会接。

## 五、选型：一张决策表

| 场景 | 推荐 |
| --- | --- |
| 传统服务端渲染应用 | Session + Cookie |
| 前后端分离，单服务 | Session 或 JWT 都行，图省心用 Session |
| 微服务/多端（Web+App+小程序） | JWT + Refresh Token |
| 要「踢人下线」功能 | Session（或 JWT + 黑名单） |
| 第三方登录 | OAuth 2.0 授权码模式 |

**我的默认建议**：没有多端和微服务需求，**Session + Cookie 更省心**。
JWT 的「无状态」在单体应用里是伪需求，反而把吊销难题引进来。
别为了「技术上酷」选方案，要为「问题匹配」选。

## 六、前端存的两种方式对比

JWT 前端存哪，也是老官司：

| 存储 | 优点 | 缺点 |
| --- | --- | --- |
| Cookie（HttpOnly） | XSS 偷不走，自动发送 | 要防 CSRF；跨域要配 CORS 带凭证 |
| localStorage | 简单，不自动发送（没 CSRF 问题） | **XSS 可直接读走** |

两害相权：**能放 HttpOnly Cookie 就放**。XSS 的防御面
（转义输出 + CSP）比 CSRF（SameSite + Token）更薄，
别把 Token 放进 XSS 一读就走的 localStorage。

## 七、自检清单

- [ ] 登录 Cookie 有 HttpOnly + Secure + SameSite；
- [ ] Session 存储有过期时间（Redis TTL）；
- [ ] JWT 有效期别太长（access 15 分钟级别）；
- [ ] JWT Payload 里没有敏感信息；
- [ ] 退出登录 = 服务端删记录 / 前端清 Token，两边都做；
- [ ] 密码传输全程 HTTPS；
- [ ] 登录接口有防爆破（限流/验证码）。

## 小结

三条路各管一段：**Session+Cookie 经典可控，JWT 无状态难吊销，
OAuth 专管第三方**。中小项目无脑 Session 起步，
多端微服务再上 JWT（配短有效期 + 刷新机制）。
登录态是安全的第一道门，属性别少配，存储别乱放。
