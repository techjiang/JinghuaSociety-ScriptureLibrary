---
title: JS 类型判断与转换
createTime: 2026-10-22
permalink: /library/tech/js-typeof/
description: typeof 的六个坑、instanceof、Object.prototype.toString 与显式转换规则
---

# JS 类型判断与转换

JS 的类型系统「 weakly typed 」——判断难、转换乱。
这篇收拢日常真会遇到的：typeof 的坑、精确判断的方法、
`==` 转换表，以及「1 + '1'」为什么是 '11'。

## 一、七种内置类型

```text
string  number  boolean  undefined  null  symbol  bigint   ← 原始类型（7 种）
object                                                      ← 对象（含数组、函数、null）
```

注意：**函数是对象**（typeof 特例返回 'function'），
**null 也是对象**（typeof 的著名 bug）。数组没有独立 typeof。

## 二、typeof：快但不准

```js
typeof 'x'          // 'string'   ✅
typeof 1            // 'number'   ✅
typeof true         // 'boolean'  ✅
typeof undefined    // 'undefined' ✅
typeof 10n          // 'bigint'   ✅
typeof Symbol()     // 'symbol'   ✅
typeof function () {} // 'function' ✅（但它是对象）

typeof null         // 'object'   ❌ 坑！（历史 bug，将错就错）
typeof []           // 'object'   ❌ 分不清是数组还是对象
typeof {}           // 'object'   ❌
typeof new Date()   // 'object'   ❌
```

**typeof 只用来区分原始类型**。要区分「数组/对象/null/Date」，
往下看。

## 三、精确判断三件套

### 1. 数组

```js
Array.isArray([])              // true（跨 iframe 也准）
Array.isArray({})              // false
```

### 2. null

```js
value === null                 // 直接比，最准
```

### 3. 一切内置对象（Date/RegExp/Error…）

```js
Object.prototype.toString.call(new Date())      // '[object Date]'
Object.prototype.toString.call([])              // '[object Array]'
Object.prototype.toString.call(null)            // '[object Null]'
Object.prototype.toString.call(/re/)            // '[object RegExp]'
```

封装一个万能类型判断：

```js
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
getType([])          // 'array'
getType(null)        // 'null'
getType(new Date())  // 'date'
getType({})          // 'object'
```

### 4. 普通对象（纯字典）

```js
function isPlainObject(v) {
  if (typeof v !== 'object' || v === null) return false
  const proto = Object.getPrototypeOf(v)
  return proto === Object.prototype || proto === null
}
isPlainObject({})                  // true
isPlainObject(new Date())          // false
isPlainObject([])                  // false
```

### instanceof：能不用就不用

```js
[] instanceof Array                // true（当前 realm 内）
```

**跨 window/iframe 失效**（两个 Array 构造函数）：

```js
iframe.contentWindow.Array !== Array      // true
iframe.contentWindow.arr instanceof Array // false！明明就是数组
```

所以能用 `Array.isArray` 就别用 `instanceof Array`。
instanceof 查的是原型链 —— 判断自定义类实例可以用。

## 四、类型转换：显式的三种

```js
String(123)              // '123'    任何值 → 字符串
Number('123')            // 123      字符串 → 数字
Boolean(0)               // false    任何值 → 布尔
```

**Number() 的严格**（转不了就是 NaN）：

```js
Number('123')            // 123
Number('12.3')           // 12.3
Number('')               // 0      ← 坑！空串是 0
Number('12px')           // NaN    ← 严格：不纯数字就 NaN
Number(null)             // 0      ← 坑
Number(undefined)        // NaN
Number([])               // 0      ← 坑（空数组 toString 是 ''）
Number([5])              // 5      ← 单元素数组 toString 是 '5'
```

**parseInt/parseFloat**（字符串解析，容错高）：

```js
parseInt('123px')        // 123    ← 截到非数字为止
parseInt('12', 16)       // 18     ← 别忘基数！
parseFloat('3.14rem')    // 3.14
parseInt('')             // NaN    ← 和 Number('') 不同
```

**取舍**：纯数字串转数字用 `Number`（严格）；
带单位的字符串（`'100px'`）用 `parseInt`。

## 五、隐式转换：== 的灾难现场

`==` 会「尽量把两边转成一样再比」，规则反直觉：

```js
0 == ''                  // true    （都转数字：0 == 0）
0 == '0'                 // true
'' == '0'                // false   （都是字符串，直接比）
null == undefined        // true    （特殊规定）
NaN == NaN               // false   （NaN 跟谁都不等，用 Number.isNaN）
[] == false             // true    （数组 toString '' → 0 == false）
```

**规则只有一条值得记：别用 ==，一律 ===。**

```js
if (x === undefined)      // ✅
if (x === null)           // ✅
if (x)                    // ✅ 布尔上下文（下面说）
```

Lint 规则 `eqeqeq` 全项目打开，永绝后患。

## 六、真值/假值：if 里到底在判断什么

**八个假值**（其余全真）：

```text
false  undefined  null  0  NaN  ''  (空字符串)  0n（BigInt 零）
```

**「对象永远是真」**：

```js
if ({}) console.log('跑')            // 跑！
if ([]) console.log('跑')            // 跑！（空数组也是 true）
if (function () {}) console.log('跑') // 跑！
if (new Boolean(false)) console.log('跑')  // 跑！（包装对象是真）
```

**判空数组/对象要用长度**：

```js
if (arr.length === 0)      // 空数组
if (Object.keys(obj).length === 0)   // 空对象
```

## 七、实用场景套路

### 接口数据兜底

```js
const list = data?.items ?? []            // 没数据给空数组（?? 只认 null/undefined）
const page = Number(query.page) || 1      // 解析失败 NaN → || 1
const name = String(rawName ?? '匿名')    // 兜底成字符串
```

### 表单值处理

```js
const age = parseInt(input.value, 10)     // 别忘基数
if (Number.isNaN(age)) showError('年龄得是数字')

// 范围检查
if (!Number.isFinite(age) || age < 0 || age > 150) showError('不合理')
```

### 安全的 JSON 取值

```js
function safeGet(obj, path, fallback) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? fallback
}
safeGet(res, 'data.user.name', '未知')     // 中间断了给兜底
```

## 小结

类型三件套：**typeof 分原始（null 是 object 的坑）、
toString.call 分内置对象、Array.isArray 分数组**。
转换记三条：**Number 严格（'' → 0）、parseInt 容错（'12px' → 12）、
`==` 一律换 `===`**。八个假值里对象永真 ——
「判空」永远用 `.length` 或 `Object.keys`。
类型这块，JS 的坑就这些，踩完毕业。
