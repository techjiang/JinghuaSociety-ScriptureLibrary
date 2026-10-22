---
title: JavaScript 模块化：从 script 到 ESM
createTime: 2026-10-22
permalink: /library/tech/js-modules/
description: CommonJS、ESM、Tree Shaking 与循环依赖，一次搞懂 import/export
---
JS 早年没有模块系统，全靠全局变量和 `<script>` 标签顺序。
后来出现了 CommonJS（Node 用）、AMD（浏览器用）、UMD（兼容两者的缝合怪），
最后 ES2015 一统江湖，就是现在的 ESM（ES Module）。

这段历史不光是为了怀旧 —— ** CommonJS 和 ESM 的差异至今还在
制造 bug**。这篇讲清楚两种格式和它们的坑。

## 一、没有模块的年代

```html
<script src="jquery.js"></script>
<script src="utils.js"></script>
<script src="app.js"></script>
```

问题：

- **全局污染**：所有变量挂 window，撞名即事故；
- **顺序依赖**：`utils.js` 没加载完，`app.js` 就挂了；
- **无法按需加载**：十个页面也全量加载全部脚本。

模块化要解决的就是这三件事。

## 二、CommonJS：Node 的选择

```js
// math.js —— 导出
const add = (a, b) => a + b
module.exports = { add }

// app.js —— 导入
const { add } = require('./math')
console.log(add(1, 2))
```

特点：

- **同步加载**：`require` 当场读文件、当场执行、当场返回。
  服务端文件在本地磁盘，快，无所谓；
- **运行时解析**：`require` 是函数调用，路径可以是变量 ——
  意味着**打包器很难静态分析**（Tree Shaking 基本失效）；
- **值拷贝**：导入拿到的是导出值的拷贝，模块内部后续改导出对象，
  外面感知不到（引用类型除外）。

Node 12 之前只有 CommonJS。现在 Node 也全面支持 ESM，
但大量存量包还是 CJS —— 混用是日常。

## 三、ESM：浏览器与未来的标准

```ts
// math.ts —— 导出
export const add = (a, b) => a + b
export default function multiply(a, b) { return a * b }

// app.ts —— 导入
import multiply, { add } from './math.js'   // default 与命名共存
```

特点：

- **静态分析**：`import` 是声明不是函数调用，路径必须是字面量 ——
  **打包器因此能 Tree Shaking**（删掉没用到的导出）；
- **异步加载**：浏览器里 `<script type="module">` 不阻塞解析，
  依赖图自动并行下载；
- **live binding**：导入的是「活的」绑定，模块内改导出值，
  导入方看到最新值（和 CJS 的值拷贝相反）；
- **严格模式**：ESM 默认 strict，`this` 是 undefined；
- **提升执行**：import 声明会被提升到模块顶部先执行完依赖。

浏览器直接用：

```html
<script type="module" src="app.js"></script>
```

## 四、两者的关键差异（踩坑表）

| | CommonJS | ESM |
| --- | --- | --- |
| 语法 | `require`/`module.exports` | `import`/`export` |
| 加载 | 同步（Node）/ 运行时 | 异步 / 静态分析 |
| 导出 | 值的拷贝 | live binding |
| 路径 | 可省略后缀、可变量 | 必须写全（含 `.js`）、必须字面量 |
| Tree Shaking | 难 | 容易 |
| 浏览器 | 不支持 | 原生支持 |

### 混用的坑

Node 里 `.cjs` 后缀强制 CommonJS，`.mjs` 强制 ESM，`.js` 看
`package.json` 的 `"type"` 字段。

**ESM 里 import CJS 包**（比如 `lodash`）：可以，`import _ from 'lodash'`
拿到 `module.exports`。但反过来 **CJS 里 require ESM** 不行
（`require` 不理解 `import`）—— 新版本 Node 支持了 `require(esm)`
（Node 22+ 默认开），但老项目别指望。

**TS 里的 `esModuleInterop`**：TS 转 CJS 时，`import express from 'express'`
要开 `esModuleInterop: true` 才能正确解出 default 导出。
Vite 模板默认帮你配好了，自己搭项目时注意。

### 循环依赖

A 引 B，B 引 A：

```js
// a.js
import { b } from './b.js'
export const a = 'a'
console.log('a 模块执行', b)

// b.js
import { a } from './a.js'
export const b = 'b'
console.log('b 模块执行', a)
```

入口加载 a.js → 开始执行 a → 发现要 b → 执行 b → b 又要 a → 
**a 还没执行完，a 的导出是「进行中的空壳」** → b 拿到 `undefined`。

CJS 和 ESM 表现还不一样（CJS 是部分拷贝，ESM 是 TDZ 报错或 undefined）。
**解法：别写循环依赖**。出现这种结构，说明该抽个公共模块 c，
或者把共享状态提到上层。

## 五、打包器眼里只有 ESM

Vite/Webpack/Rollup 全都偏爱 ESM：

- Tree Shaking 依赖静态结构，CJS 打包后基本「整个包进来」；
- 官方包的现代做法：**双格式发布**（`main` 指 CJS 兜底，
  `module`/`exports.import` 指 ESM），打包器优先用 ESM；
- 这也是为什么 [npm 包指南](../npm-package.md) 里建议新包直接纯 ESM ——
  下游工具链全是 ESM 思维。

## 六、给日常开发的结论

1. **新项目全 ESM**，`"type": "module"` 写进 package.json；
2. import 路径**带 `.js` 后缀**（浏览器和 Node ESM 都要求）；
3. 遇到老 CJS 包直接 `import x from 'pkg'`，别慌；
4. 看到「Cannot use import statement outside a module」：
   检查文件是不是被当 CJS 解析了（`type` 字段/后缀/构建配置）；
5. 循环依赖靠代码结构避免，工具救不了设计。

## 小结

模块化三代半：**全局 script → CommonJS（Node 正统）→
ESM（浏览器原生+Tree Shaking）→ 一统江湖**。
日常写 ESM，Node 里混 CJS，遇到循环依赖先反思设计。
这段历史值一懂 —— 排查打包问题时报错信息你都看得懂。
