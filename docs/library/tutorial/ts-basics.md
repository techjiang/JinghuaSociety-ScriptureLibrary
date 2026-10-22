---
title: TypeScript 入门：给 JavaScript 加上类型
createTime: 2026-10-22
permalink: /library/tutorial/ts-basics/
description: 类型注解、接口、泛型入门与迁移策略，不搞类型体操
---

# TypeScript 入门：给 JavaScript 加上类型

TS 现在是前端标配。但「要不要上 TS」「怎么上手」仍有争论。
这篇面向「会 JS、没用过 TS」的人：讲最常用的部分，不搞类型体操，
最后说什么时候**别**用 TS。

## 一、TS 是什么：编译时的「检查员」

一句话：**TypeScript 就是 JavaScript + 类型标注**。
类型只在写代码和编译时存在，跑起来还是普通 JS。

```ts
// TS：编译时检查
function greet(name: string): string {
  return `你好，${name}`
}
greet('张三')    // ✅
greet(123)      // ❌ 编译报错：参数必须是 string
```

编译（`tsc` 或 Vite 自动）后类型被擦掉，输出纯 JS。
**类型错误不会让程序跑不了，但会在你写错时立刻提示** ——
把「运行时才炸」提前到「写的时候就炸」。

## 二、基础类型：先会这几个

```ts
// 基础类型
const name: string = '张三'
const age: number = 25
const isVip: boolean = true
const tags: string[] = ['前端', 'TS']
const tuple: [string, number] = ['张三', 25]   // 元组：固定长度和类型

// 联合类型：可能是几种之一
let id: string | number
id = 'u_123'
id = 123       // 都行

// 对象类型
const user: { name: string; age?: number } = { name: '张三' }  // ? 可选

// any 和 unknown
const anything: any = 'whatever'        // 放弃治疗（尽量别用）
const safe: unknown = JSON.parse(str)   // 未知类型，用前要 narrowing
```

日常写业务，这几个覆盖八成。**`?` 可选属性**和**联合类型**
是最高频的两个进阶点。

## 三、interface vs type：都能用，选一个

```ts
interface User {
  id: number
  name: string
  email?: string          // 可选
  readonly createdAt: Date // 只读
}

// type 别名：给类型起名
type ID = string | number
type Handler = (e: Event) => void
```

区别（细节）：`interface` 可继承可合并（同一个名字写两次会合并），
`type` 更灵活（能写联合、映射类型）。

**建议：描述对象结构用 interface，其他用 type**。团队统一就行，
别在这上面吵。

## 四、函数：参数和返回值都标注

```ts
function add(a: number, b: number): number {
  return a + b
}

// 箭头函数
const multiply = (a: number, b: number): number => a * b

// 可选参数和默认值
function greet(name: string, greeting: string = '你好'): string {
  return `${greeting}，${name}`
}

// 回调函数类型
function fetchData(url: string, onDone: (data: string) => void): void {
  // …
}
```

**好处不只是检查**：函数签名带类型，编辑器自动补全全开，
团队协作时「这个函数要传什么、返回什么」看签名就懂，不用读实现。

## 五、泛型：类型的「参数化」

泛型听起来玄，日常就一个用途：**让类型跟着值走**。

```ts
// 不用泛型：写死 any 或具体类型
function first(arr: any[]): any { return arr[0] }

// 用泛型：T 是「类型占位符」，调用时确定
function first<T>(arr: T[]): T {
  return arr[0]
}

const n = first([1, 2, 3])        // n 推断为 number
const s = first(['a', 'b'])       // s 推断为 string
```

「T」只是个名字，习惯用 T（Type）、K（Key）、V（Value）、E（Element）。
**写工具函数、hooks 时才需要自己写泛型**。日常业务代码，先会用
（知道 `useState<User>(...)` 这类调用在干什么）就够。

## 六、内置工具类型：记住四个就够

```ts
interface User { id: number; name: string; email: string }

type PartialUser = Partial<User>      // 全部变可选
type RequiredUser = Required<User>    // 全部变必填
type UserPreview = Pick<User, 'id' | 'name'>   // 挑几个字段
type UserWithoutEmail = Omit<User, 'email'>    // 排除几个字段

// 场景：更新接口只传部分字段
function updateUser(id: number, patch: Partial<User>) { … }
updateUser(1, { name: '新名字' })   // 只传要改的
```

`Partial` 是实际项目里用得最多的（更新场景）。其他按需查。

## 七、在项目里用起来

Vite 项目（本站就是）：

```bash
npm create vite@latest my-app -- --template vue-ts
# 或 react-ts
```

已有 JS 项目迁移（渐进策略）：

1. `tsconfig.json` 先放宽：`allowJs: true`、`strict: false`；
2. 新文件用 `.ts`，老文件不动；
3. 把老文件一个个改（通常从「工具函数」改起，风险低）；
4. 报错太多时，局部逃生舱：`// @ts-ignore`（带理由！）
   或 `as any`（真没办法再用）。

**别追求一步到位 strict** —— 大项目开 strict，报错三千个，
团队会起义。先宽松，再逐步收紧。

## 八、什么时候别用 TS

不是无脑吹。这些场景 JS 更好：

- **一次性脚本**（数据处理、爬虫）：写完就跑，类型是负担；
- **快速原型验证**：先跑通再谈类型；
- **团队没人会 TS**：强上 = 全员踩坑，`as any` 满天飞，
  比不用还乱。

判断标准：**项目要长期维护 + 两人以上协作 → 上 TS；
一次性/单人玩具 → JS 够了。**

## 九、新手最常踩的五个坑

1. **`null` 和 `undefined`**：TS 里它们是独立类型，
   `strictNullChecks` 开着时，`string | undefined` 不能直接当 `string` 用 ——
   先 `if (x)` 或 `x ?? 默认值`；
2. **乱用 `any`**：一时爽，编译火葬场。用 `unknown` 代替，
   用前 narrowing；
3. **类型断言 `as`**：`x as string` 是「我保证它是，编译器你闭嘴」——
   保证错了运行时炸。少用；
4. **枚举 vs 联合字面量**：现代 TS 推荐 `type Status = 'on' | 'off'`，
   enum 有些坑（`const enum` 兼容问题）；
5. **过度设计**：给每个变量写类型注解。**能推断的别标** ——
   `const name = '张三'` 就够了，不用 `const name: string = '张三'`。

## 小结

TS 入门路径：**基础类型 → interface → 函数标注 → Partial/Pick 四件套 →
需要时学泛型**。日常业务到第二步就够用。
核心价值不是「类型安全」这四个字，是**编辑器全知全能的补全
和「写错立刻红」的反馈**。用一周就回不去。

本站的 config.ts、RSS 插件都是 TS 写的，可以去
[GitHub 仓库](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary)
看真实用法。
