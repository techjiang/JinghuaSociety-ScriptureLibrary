---
title: 跨域与 CORS 详解
createTime: 2026-10-21
permalink: /library/tech/cors/
description: 同源策略是什么、CORS 怎么放行、预检何时发生，附 Express/Nginx 配置
---
每个前端都被跨域问题毒打过：本地 `localhost:5173` 请求
`localhost:3000` 的接口，Console 一片红，
`Access-Control-Allow-Origin` 几个字看到想吐。这篇把它讲透：
为什么会有跨域、CORS 怎么放行、以及几种常见配置怎么写。

## 一、同源策略：浏览器定的规矩

**同源** = 协议 + 域名 + 端口 三者全同。
`http://a.com:80` 和 `http://a.com:81` 都算跨域（端口不同）。

同源策略是浏览器的安全机制：默认情况下，`a.com` 页面里的 JS
不能读 `b.com` 的响应内容。这是为了防止恶意网站偷你的数据 ——
你登录着银行，钓鱼网站页面里 JS 偷偷请求银行的接口，
如果浏览器不拦，你的余额就没了。

注意关键词是**浏览器拦**。同源策略不约束：

- 表单提交、`<img>` 加载、脚本引入（这些天生跨域可用）；
- 服务端到服务端的请求（没有浏览器，没有同源策略）；
- `curl`、Postman 这些工具（它们不是浏览器）。

所以「Postman 请求接口好好的，浏览器里就报错」不是玄学，
是两个世界。

## 二、CORS：一套「放行」机制

CORS（Cross-Origin Resource Sharing，跨域资源共享）就是
浏览器和服务端之间的谈判协议：服务端通过响应头声明
「我允许哪些源来读我」，浏览器看了放行，不放则拦截。

![CORS 请求流程](/images/cors-flow.svg)

*图：简单请求直接带 Origin，复杂请求先 OPTIONS 预检*

### 核心响应头

服务端在响应里加这几个头：

```http
Access-Control-Allow-Origin: https://a.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

逐个说：

| 头 | 作用 |
| --- | --- |
| `Allow-Origin` | 允许哪个源。`*` 是任意，但带了 Cookie 就不能用 `*` |
| `Allow-Methods` | 允许的方法（GET/POST/PUT/DELETE 等） |
| `Allow-Headers` | 允许的自定义请求头 |
| `Allow-Credentials` | 允许带 Cookie（此时 Origin 不能是 `*`，要写具体域名） |
| `Max-Age` | 预检结果缓存多久（秒），省得每次都问 |

### 简单请求 vs 预检请求

浏览器把跨域请求分两类：

**简单请求**：GET/HEAD/POST，且 Content-Type 是
`application/x-www-form-urlencoded`、`multipart/form-data`
或 `text/plain` 之一，没带自定义头。这种直接发，
服务端在响应里带 `Allow-Origin` 就行。

**预检请求**：PUT/DELETE 方法、`application/json` 的 POST、
带 `Authorization` 头 —— 这些会先自动发一个 `OPTIONS` 请求，
问服务端「我这样的请求你允许吗」，得到允许才发真正的请求。
这就是 Network 里经常看到一条 OPTIONS 的原因。

预检是浏览器的保护机制：先问后做，别把「危险请求」
（可能改数据的）直接打过去。

## 三、常见配置写法

### Express（Node）

```js
const express = require('express')
const app = express()

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'https://a.com')
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.set('Access-Control-Allow-Credentials', 'true')
  // 预检请求直接放行
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})
```

生产项目用 `cors` 中间件更省心：

```js
const cors = require('cors')
app.use(cors({
  origin: 'https://a.com',   // 别图省事写 true
  credentials: true,
}))
```

### Nginx 反向代理（前后端不同域的常用解法）

```nginx
location /api/ {
    proxy_pass http://localhost:3000/;
    proxy_set_header Host $host;

    add_header Access-Control-Allow-Origin 'https://a.com' always;
    add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE' always;
    add_header Access-Control-Allow-Headers 'Content-Type, Authorization' always;
    add_header Access-Control-Allow-Credentials 'true' always;
}
```

### 开发环境：配代理，而不是全局开 CORS

Vite/Vue CLI 自带的 dev server 代理，本地开发最舒服：

```ts
// vite.config.ts
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}
```

原理：浏览器以为在请求同源的 `/api`，Vite 转发给后端，
**根本没有跨域这回事**。比在后端写一堆 CORS 头干净得多。

## 四、踩坑记录

**坑一：Allow-Origin 写了具体域名，还是报错**
看看是不是协议或端口没对上。`http://a.com` 和
`https://a.com` 是两个源，`Allow-Origin` 必须完整匹配
（协议+域名+端口），差一个字符都不行。

**坑二：带 Cookie 时用了 `*`**
`Allow-Credentials: true` 和 `Allow-Origin: *` 不能共存，
浏览器直接拒。要么写具体域名，要么别带 Cookie。

**坑三：OPTIONS 404/405**
预检请求到了服务端，但服务端没处理 OPTIONS 方法
（比如只注册了 GET/POST 路由）。加个 OPTIONS 的处理，
或者用 cors 中间件。

**坑四：代理配了还是 404**
`proxy_pass` 的路径重写没弄对。`/api/users` 转发到
`http://localhost:3000/api/users` 还是 `/users`，
取决于 `proxy_pass` 结尾带不带 `/`。这个细节能抠半小时，
建议直接看 Nginx 文档的例子对照。

## 五、一句话总结

**跨域是浏览器在保护用户，CORS 是服务端给浏览器的放行条**。
开发环境用 dev server 代理绕过，生产环境用 Nginx 代理
或后端配 CORS 头。记住「预检是浏览器先问后做」，
Network 里那条 OPTIONS 就不再神秘。
