---
title: JSON 完全指南
createTime: 2026-10-22
permalink: /library/tech/json/
description: 语法、解析、序列化、大数陷阱与 JSON vs 对象，接口数据的日常
---

<CategoryTag name="技术" link="/library/tech/" />

JSON 是前后端之间的「普通话」。天天用，但有几个坑
不知道什么时候踩。这篇讲语法、API、和那些「见鬼了」的问题。

## 一、语法：就六种类型

```json
{
  "string": "文字",
  "number": 42,
  "float": 3.14,
  "bool": true,
  "null": null,
  "array": [1, "two", false],
  "object": { "nested": "可以嵌套" }
}
```

三条铁律：

1. **键必须双引号**（单引号、无引号都是非法的）；
2. **不能有注释**（想要注释用 JSON5/YAML）；
3. **不能有尾逗号**（最后一项后面加 `,` 解析失败）。

常见语法错误：`{name: 'x'}`（键没引号+单引号值）、
`[1, 2, ]`（尾逗号）、`NaN`/`undefined`（JSON 没有这两个值）。

## 二、JS 里操作：两个 API

```js
// 解析：字符串 → 值
const obj = JSON.parse('{"name":"张三"}')

// 序列化：值 → 字符串
const str = JSON.stringify({ name: '张三', age: 25 })
// '{"name":"张三","age":25}'

// 美化输出（调试用）
JSON.stringify(obj, null, 2)      // 两空格缩进
```

`stringify` 的隐藏技能：

```js
// 1. 只序列化指定字段（敏感信息过滤）
JSON.stringify(user, ['name', 'age'])

// 2. 自定义输出（第三个参数）
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'string') return value.toUpperCase()
  return value
})

// 3. 缩进可以是数字或字符串
JSON.stringify(obj, null, '\t')   // Tab 缩进
```

## 三、五个「见鬼了」时刻

### 1. 大整数精度丢失（最经典）

```js
JSON.parse('{"id": 1234567890123456789}')
// { id: 1234567890123456800 }  ← 最后几位变了！
```

JS 的 number 是 IEEE 754 双精度，**超过 2^53 的整数存不准**。
Twitter/微博的推文 ID、数据库雪花 ID 都这毛病。

**解法**：

- 接口返回 ID 用**字符串**（`"id": "1234567890123456789"`）；
- 或用 `JSON.parse` 的 reviver + BigInt：

```js
JSON.parse(str, (key, value) => {
  if (typeof value === 'number' && !Number.isSafeInteger(value)) {
    return BigInt(value)     // 注意：BigInt 不能直接 JSON.stringify
  }
  return value
})
```

- 库方案：`json-bigint`、`lossless-json`。

### 2. undefined 会消失

```js
JSON.stringify({ a: 1, b: undefined })
// '{"a":1}'  ← b 没了！
```

数组里更怪：

```js
JSON.stringify([undefined, null])
// '[null,null]'  ← undefined 变 null
```

**所以接口里「没值」用 null，别用 undefined** ——
undefined 序列化就人间蒸发，前端少个字段。

### 3. Date 变成 ISO 字符串

```js
JSON.stringify({ d: new Date() })
// '{"d":"2026-10-22T08:00:00.000Z"}'  ← 变成字符串了
```

反过来 parse 出来是字符串，不是 Date。要 Date：
`new Date(obj.d)`。时区问题：ISO 带 Z（UTC），
显示时转本地（[时间处理](../time-tools.md)）。

### 4. 循环引用报错

```js
const a = {}
a.self = a
JSON.stringify(a)
// TypeError: Converting circular structure to JSON
```

**解法**：序列化前打断环（删引用、或用 WeakSet 记录已访问的跳过）。

### 5. toJSON 方法会「劫持」序列化

```js
const obj = {
  value: 42,
  toJSON() { return { wrapped: this.value } }
}
JSON.stringify(obj)
// '{"wrapped":42}'  ← 不是你想的那个结构！
```

Date 就是靠这个「变成」字符串的。自定义类想控制序列化输出，
实现 `toJSON` 就行。

## 四、JSON vs JS 对象：三个区别

| | JSON | JS 对象 |
| --- | --- | --- |
| 键 | 必须双引号字符串 | 可以是变量、数字、符号 |
| 值 | 六种类型 | 函数、undefined、Symbol 都行 |
| 用途 | **数据传输格式** | 程序内数据结构 |

「JSON 是一种字符串格式，JS 对象是内存里的东西」——
`JSON.parse/stringify` 是两边的桥。

## 五、工具与技巧

```bash
# 命令行美化/查询（jq 是神器）
curl -s https://api.github.com/users/techjiang | jq '.name, .public_repos'

# jq 过滤数组
curl -s .../posts | jq '.[] | select(.likes > 10) | .title'
```

- 在线格式化：[JSON Crack](https://jsoncrack.com)（可视化）、
  [JSON Hero](https://jsonhero.io)；
- VS Code 直接美化：格式化命令对 .json 文件有效；
- 接口调试看 JSON：DevTools Network → Response 自动格式化。

## 六、TypeScript 里用 JSON

```ts
// 类型断言 + 校验（别直接 as，先验证）
interface User { id: string; name: string }

function parseUser(json: string): User {
  const data = JSON.parse(json)
  // 生产环境用 zod/valibot 校验，别裸 as
  return data as User
}

// fetch 的惯用法
const res = await fetch('/api/user')
const user: User = await res.json()    // res.json() 返回 Promise<any>
```

**接口返回别直接 `as User`** —— 后端改了字段，TS 类型还在骗你。
配 zod 这类运行时校验，类型和现实才一致（[TS 入门](../ts-basics.md)）。

## 小结

JSON 日常三件套：**parse/stringify 两个 API + 六种类型记心中**。
三个保命知识点：**大整数用字符串传、没值用 null 别用 undefined、
Date 会变字符串**。遇到「JSON 见鬼了」，多半是这三个在作怪。
