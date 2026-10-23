---
title: URL 编码与 Base64
createTime: 2026-10-22
permalink: /library/tech/url-encoding/
description: 为什么中文变 %E4%B8%AD、encodeURIComponent 用错出事、Base64 不是加密
---

<CategoryTag name="技术" link="/library/tech/" />

# URL 编码与 Base64

两个「日常见但说不清」的编码话题。URL 编码是「怎么安全地把
任意字符塞进 URL」，Base64 是「怎么把二进制塞进文本」。
搞混它们（比如以为 Base64 能保护数据）会出安全笑话。

## 一、URL 只能「安全地」包含这些字符

URL 的合法字符集有限：字母、数字、`-._~` 和少数保留字符
（`:/?#[]@!$&'()*+,;=`）。**中文、空格、引号、`%` 本身
都不安全** —— 可能被服务器误解、截断、或让链接失效。

所以有了 **percent-encoding（百分号编码）**：

```text
中 → %E4%B8%AD      （UTF-8 字节，每字节变 %XX）
空格 → %20
/ → %2F
# → %23
```

浏览器地址栏看到中文但复制出来是 `%E4%B8%AD` —— 同一个东西，
显示层和解码层的区别。

## 二、三个 JS API：别用错

```js
encodeURI('https://site.com/搜索 page?a=1')      // 只编码「URL 非法」字符
// 'https://site.com/%E6%90%9C%E7%B4%A2%20page?a=1'
// 注意：? = & 这些「URL 语法字符」不动

encodeURIComponent('a=1&b=2')                    // 编码「一切」非安全字符
// 'a%3D1%26b%3D2'
// ? = & / 全编码

decodeURI / decodeURIComponent                   // 反向
```

**选哪个**：

| 场景 | 用啥 |
| --- | --- |
| 编码整个 URL | `encodeURI` |
| 编码**参数值** | `encodeURIComponent` |
| 编码路径片段 | `encodeURIComponent` |
| 解码拿到的值 | 对应的 decode |

**经典 bug**：用 `encodeURI` 编码参数值，值里带 `&` →

```js
const keyword = '猫 & 狗'
const url = '/search?q=' + encodeURI(keyword)
// '/search?q=%E7%8C%AB%20&%20%E7%8B%97'
// & 没编码！服务端解析成 q=猫 + 空参数 —— 搜索词被截断
```

正确：

```js
const url = `/search?q=${encodeURIComponent(keyword)}`
// '/search?q=%E7%8C%AB%20%26%20%E7%8B%97'  ← & 变 %26，安全
```

**记法：动整体用 URI，动零件用 Component。**

## 三、实战：拼 URL 的现代姿势

别手动拼，用 `URLSearchParams`：

```js
const params = new URLSearchParams({
  q: '猫 & 狗',
  page: 2,
  sort: '-created_at'
})
params.toString()
// 'q=%E7%8C%AB+%26+%7%8B%97&page=2&sort=-created_at'
```

自动编码，不操心。Node 里处理 query 也是它。

读取当前页参数：

```js
const params = new URLSearchParams(location.search)
params.get('q')        // 自动解码回 '猫 & 狗'
```

**`+` 在 query 里表示空格**（form 编码的老传统），
路径里空格是 `%20`。`URLSearchParams` 帮你处理这个差异。

## 四、Base64：二进制穿文本

Base64 把**任意字节**转成 64 个安全字符（A-Z a-z 0-9 + /）：

```js
// 编码：字符串 → Base64
btoa('Hello')                      // 'SGVsbG8='

// 解码
atob('SGVsbG8=')                   // 'Hello'
```

原理：3 字节（24 bit）→ 4 个 6-bit 组 → 每组映射一个字符。
所以**体积涨 1/3**（4/3）。

**注意 `btoa` 只认 Latin1 字符**。中文先转 UTF-8：

```js
// 中文这样搞（现代方案）
const bytes = new TextEncoder().encode('中文')
const binStr = String.fromCharCode(...bytes)
const b64 = btoa(binStr)           // 正确编码

// Node 里更直接
Buffer.from('中文').toString('base64')
```

Data URL（图片内嵌）：

```text
data:image/png;base64,iVBORw0KGgo...
```

小图标直接内联进 CSS/HTML，省一个请求 —— 但**大图别用**
（+33% 体积还不能缓存）。

## 五、Base64 不是加密（重要！说三遍）

```js
btoa('password123')      // 'cGFzc3dvcmQxMjM='
```

这个字符串**任何人都能一秒解开**：

```js
atob('cGFzc3dvcmQxMjM=')   // 'password123'
```

Base64 是**编码（encoding）不是加密（encryption）**：
编码为了「传输安全」（不丢字符），加密为了「内容保密」（没钥匙看不懂）。
把密码 Base64 一下存起来 / 传起来 = 裸奔，只是裸奔得好看点。

**真要加密**：HTTPS（传输层）+ bcrypt/argon2（密码存储）+
对称加密（数据内容）。Base64 在这个链条里的角色：
「把二进制塞进 JSON/URL 的搬运工」。

## 六、JWT 里的 Base64（印证上文）

JWT 三段（Header.Payload.Signature）全是 Base64URL：

```text
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.SflKxw...
```

把前两段贴进 [jwt.io](https://jwt.io) 就能读出内容 ——
**Payload 谁都能看**（所以别放敏感信息），安全性全靠
第三段签名（服务端密钥签的，改不了）。详见
[Cookie/Session/JWT](./cookie-jwt.md)。

## 七、速查

```text
URL 编码：encodeURIComponent（零件）/ encodeURI（整体）
Base64：btoa/atob（浏览器）、Buffer（Node）
解码对应：decodeURIComponent / atob
体积：URL 编码涨 1-3 倍、Base64 涨 1/3
安全：两者都不提供任何保密性
```

## 小结

编码两兄弟：**URL 编码管「URL 里安全地塞字符」，
Base64 管「文本里塞二进制」**。用法记两条：
`encodeURIComponent` 管参数值、`btoa` 前中文先 UTF-8。
最重要的一条：**Base64 是编码不是加密** ——
把它当保密措施的系统，等于把保险箱密码写在保险箱上。
