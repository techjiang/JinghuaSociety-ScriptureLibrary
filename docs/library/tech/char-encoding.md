---
title: 字符编码：ASCII、Unicode 与 UTF-8
createTime: 2026-10-22
permalink: /library/tech/char-encoding/
description: 乱码是怎么来的、UTF-8 为什么赢、前端后端的编码 checklist
---

<CategoryTag name="技术" link="/library/tech/" />

「网页上一堆 `锟斤拷`」—— 乱码是编码没对齐造成的。
原理一天能讲清，但不知道原理的人会反复踩。
这篇把 ASCII → Unicode → UTF-8 的演进讲明白，
附前后端防乱码清单。

## 一、计算机只认识数字

字符要存进计算机，先得变成数字。这套「字符 ↔ 数字」的对照表，
就是**字符编码**。

### ASCII：美国人的 128 个字符

1963 年的老标准：7 位表示 128 个字符（大小写字母、数字、
标点、控制字符）。

```text
A = 65    a = 97    0 = 48    空格 = 32
```

一个字节（8 位）存一个字符，剩下 1 位没用。
**问题：只有英文**。中文几千字，128 个坑怎么够？

## 二、各搞各的：GB2312 → GBK → Big5

中国人发明了自己的编码：

```text
GB2312（1980）：6763 个汉字，2 字节表示一个汉字
GBK（1995）：GB2312 超集，21003 字，兼容 ASCII
Big5：台湾/香港用，繁体
```

**「兼容 ASCII」的意思**：英文字母仍用 1 字节（和 ASCII 一样），
汉字用 2 字节。所以纯英文文本 GBK 和 ASCII 看起来一样 ——
这是故意的，让老系统不至于全崩。

**乱码的根源**：一个 GBK 编码的文件，用 UTF-8 的方式解读
（或反过来）—— 字节还是那些字节，但对照表错了，
于是「锟斤拷」这种鬼东西就出现了。

```text
「中文」两个汉字 GBK 编码：D6 D0 CE C4（4 字节）
用 UTF-8 读：D6 D0 → 一个字符，CE C4 → 一个字符 → 锟斤拷（恰好对上）
```

## 三、Unicode：全世界的字符表

与其每个国家一套编码，不如**一张大表收录所有字符**。
这就是 Unicode（统一码）：每个字符一个唯一编号，叫**码点**
（Code Point）。

```text
U+0041  = A
U+4E2D  = 中
U+1F600 = 😀
```

Unicode 只是个「编号表」—— 它不规定**怎么存进字节**
（U+4E2D 存成 1 字节还是 4 字节？）。存储方案叫 **UCS**，
其中最成功的是 UTF-8。

## 四、UTF-8：变长编码的胜利

UTF-8 规则（优雅得值得记）：

```text
码点范围        字节数   格式
U+0000-007F      1      0xxxxxxx
U+0080-07FF      2      110xxxxx 10xxxxxx
U+0800-FFFF      3      1110xxxx 10xxxxxx xxxxxx
U+10000-10FFFF   4      11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

特点（也是它赢的原因）：

1. **ASCII 字符 1 字节，和 ASCII 完全兼容** ——
   老的英文系统零成本升级；
2. **变长**：常用字（中文 3 字节）不浪费，生僻字（4 字节）也能表示；
3. **自描述**：开头的 1 的个数告诉读者「这字符占几字节」，
   从任意位置能找到字符边界（不会把汉字劈成两半）；
4. **字节序无关**：不像 UTF-16 要分大小端。

```text
「中」U+4E2D = 0100 1110 0010 1101（二进制）
按 3 字节模板填充：1110xxxx 10xxxxxx 10xxxxxx
→ E4 B8 AD ← 你熟悉的 %E4%B8%AD 就是它
```

**2026 年的答案：UTF-8 统治世界**（Web 90%+、
JSON、现代数据库默认）。GBK 只剩历史系统。

## 五、前端防乱码清单

```html
<!-- 1. HTML 声明编码（放最前，head 第一行附近）-->
<meta charset="UTF-8">

<!-- 2. CSS 文件乱码：@charset 声明（仅非 UTF-8 时需要）-->
<style>@charset "UTF-8";</style>
```

```js
// 3. fetch 拿文本：默认按响应头，可显式指定
const text = await fetch('/api').then(r => r.text())      // 看 Content-Type
const text2 = await fetch('/api').then(r => r.arrayBuffer()).then(b =>
  new TextDecoder('utf-8').decode(b)                       // 强制 UTF-8 解码
)

// 4. 文件上传/下载：Blob 指定 type
const blob = new Blob([content], { type: 'text/plain; charset=utf-8' })
```

**Node 读写文件**：

```js
fs.writeFileSync('a.txt', content, 'utf8')     // 写：显式编码
fs.readFileSync('a.txt', 'utf8')               // 读：显式编码
// 不写默认 utf8，但写了更明确（团队协作防呆）
```

## 六、后端/数据库防乱码

```sql
-- MySQL 建库用 utf8mb4（真正的 UTF-8，支持 emoji）
CREATE DATABASE db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 注意：MySQL 的 "utf8" 是假 UTF-8（只到 3 字节，存不了 emoji！）
-- "utf8mb4" 才是真 UTF-8 —— 这个坑坑了十年
```

```http
# HTTP 响应头（Nginx/应用层）
Content-Type: text/html; charset=utf-8
```

```js
// Express
res.set('Content-Type', 'application/json; charset=utf-8')
```

**数据库连接字符串也要指定**：

```text
mysql://...?charset=utf8mb4          # 连接层编码对齐
```

**任何一环错，全链乱**。排查顺序：
**文件本身 → HTTP 头 → 数据库 → 连接层**，
用 `hexdump`/`xxd` 看文件的真实字节最靠谱。

## 七、趣闻与冷知识

- **BOM（字节序标记）**：UTF-8 文件开头有时有 `EF BB BF` 三字节。
  Windows 记事表爱加。**Web 场景建议去掉** ——
  CSS/JS 带 BOM 可能出怪问题；
- **UTF-16 的遗产**：Windows 内部 API、Java String 用 UTF-16。
  Java 的 `char` 存不下 emoji（超出 16 位）——
  「字符串长度 = 字符数」的假设在 emoji 时代崩了；
- **中文域名**：`中文.com` 浏览器自动转 punycode
  （`xn--fiq228c.com`），底层还是 ASCII。

## 小结

编码史三步：**ASCII（英文 128）→ 各国编码（GBK 们，
乱码之源）→ Unicode + UTF-8（一统天下）**。
防乱码 checklist：**HTML meta、HTTP 头、utf8mb4、
连接串 charset、读写文件显式编码**。
记住「UTF-8 是显示层的最大公约数，编码对齐是每一层的责任」——
乱码从来不是某一层的错，是「你以为对齐了，其实没有」。
