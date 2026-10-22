---
title: JavaScript 数组方法实战
createTime: 2026-10-22
permalink: /library/tutorial/js-array/
description: map/filter/reduce 三件套加易错点，用真实场景而不是 Foo/Bar 讲透
---

# JavaScript 数组方法实战

`for` 循环能干一切，但数组方法写出来更短、更不容易错。
问题是很多人（包括几年前的我）只会 `forEach` 和 `push`，
`reduce` 看一眼就头皮发麻。

这篇用真实场景讲，不用 `foo/bar` 那种教科书例子。

## 一、map：改内容不改数量

```js
const prices = [10, 25, 8, 99]

// 全部打八折
const discounted = prices.map((p) => Math.round(p * 0.8))
// [8, 20, 6, 79]
```

使用场景：**数组 A 变数组 B，元素一一对应**。

```js
// 从接口数据里提取字段
const users = [{ id: 1, name: '张三', age: 25 }, { id: 2, name: '李四', age: 30 }]
const names = users.map((u) => u.name)  // ['张三', '李四']
const options = users.map((u) => ({ label: u.name, value: u.id }))
// [{ label: '张三', value: 1 }, …]
```

注意：`map` 返回新数组，原数组不动。别在 map 里改原数组元素（引用类型会踩坑）：

```js
// 危险：users 里的对象也被改了！
const copy = users.map((u) => {
  u.name = u.name + '（已认证）'
  return u
})
```

要深拷：`users.map((u) => ({ ...u, name: u.name + '（已认证）' }))`。

## 二、filter：挑肥拣瘦

```js
const orders = [
  { id: 1, amount: 50, status: 'paid' },
  { id: 2, amount: 200, status: 'pending' },
  { id: 3, amount: 15, status: 'paid' },
]

// 已付款且金额大于 100 的订单
const bigPaid = orders.filter((o) => o.status === 'paid' && o.amount > 100)
// [{ id: 2? 不，pending 被过滤 }] → 实际是 []，改一下数据才对
```

等等，这个例子没有匹配项，换个真实的：

```js
const bigPaid = orders.filter((o) => o.status === 'paid')
// 拿全部已付款订单，再 map 出金额
const amounts = bigPaid.map((o) => o.amount)
```

**filter 配 map 是最常组合**：先挑再改。链式写法很顺：

```js
const total = orders
  .filter((o) => o.status === 'paid')
  .map((o) => o.amount)
  .reduce((sum, n) => sum + n, 0)
```

## 三、reduce：把数组压成一个值

`reduce` 是所有方法里最抽象的，但用习惯了就离不开了。
它干的事：**从左到右，把数组「折叠」成一个值**。

```js
arr.reduce((累加器, 当前元素) => { … }, 初始值)
```

### 求和（入门）

```js
const total = [10, 25, 8].reduce((sum, n) => sum + n, 0)
// 43
```

第二个参数 `0` 是初始值。不传的话，第一次累加器是数组第一个元素 —— 
空数组会直接报错，所以**养成写初始值的习惯**。

### 分组（实用）

```js
const orders = [
  { user: '张三', amount: 50 },
  { user: '李四', amount: 200 },
  { user: '张三', amount: 30 },
]

const byUser = orders.reduce((acc, o) => {
  acc[o.user] = (acc[o.user] || 0) + o.amount
  return acc
}, {})
// { 张三: 80, 李四: 200 }
```

统计分类总额，三行搞定。这个模式值得背下来。

### 去重

```js
const unique = [1, 2, 2, 3, 3, 3].reduce((acc, n) => {
  if (!acc.includes(n)) acc.push(n)
  return acc
}, [])
// [1, 2, 3]
```

（新代码直接 `[...new Set(arr)]`，但 reduce 版本展示了思路）

### 找最大值

```js
const max = [10, 25, 8].reduce((m, n) => (n > m ? n : m), -Infinity)
// 25
```

## 四、其他高频方法

```js
arr.find((x) => x.id === 2)        // 找第一个匹配的，返回元素本身（找不到是 undefined）
arr.findIndex((x) => x.id === 2)   // 找下标，找不到是 -1
arr.some((x) => x.age > 60)        // 有没有满足的，返回 true/false
arr.every((x) => x.age >= 18)      // 是不是全都满足
arr.includes(3)                    // 简单值判断存在
arr.slice(1, 3)                    // 截取（不改变原数组）
arr.splice(1, 2, 'a')              // 删/插/替（改变原数组！）
arr.sort((a, b) => a - b)          // 排序（默认按字符串排，数字必须给比较器）
arr.flat()                         // 二维拍一维 [[1,2],[3]] → [1,2,3]
arr.flatMap((x) => [x, x * 2])     // map 后自动 flat
```

两个大坑：

**sort 的默认排序是字符串**：

```js
[10, 9, 100].sort()        // [10, 100, 9] ← 按字典序，"100" < "9"
[10, 9, 100].sort((a, b) => a - b)  // [9, 10, 100] ← 正确
```

**splice 会改原数组**：在循环里 splice 删元素，下标全乱，
删一个跳一个。循环中删除用 `filter` 或者倒序遍历。

## 五、链式思维：一个真实例子

需求：从订单列表里，统计每个已付款用户的消费总额，按总额降序输出前 3 名。

```js
const orders = [
  { user: '张三', amount: 50, paid: true },
  { user: '李四', amount: 200, paid: true },
  { user: '张三', amount: 120, paid: false },
  { user: '王五', amount: 80, paid: true },
  { user: '李四', amount: 30, paid: true },
]

const top3 = Object.entries(
  orders
    .filter((o) => o.paid)
    .reduce((acc, o) => {
      acc[o.user] = (acc[o.user] || 0) + o.amount
      return acc
    }, {})
)
  .map(([user, total]) => ({ user, total }))
  .sort((a, b) => b.total - a.total)
  .slice(0, 3)

// [
//   { user: '李四', total: 230 },
//   { user: '张三', total: 50 },
//   { user: '王五', total: 80 },
// ] （按 total 排序后：李四 230、王五 80、张三 50）
```

拆开看就四步：**filter 挑已付款 → reduce 按人汇总 → map 转对象数组 →
sort 排序 + slice 取前 3**。每一步一个方法，思路比嵌套 for 循环清晰十倍。

调试技巧：链式中间任何一步 `.length` 不对，把链子拆开逐行打印，
比在长链末尾 `console.log` 痛快。

## 六、什么时候该用回 for

也不是方法党。这三种情况 `for` 更好读：

1. **需要 break/continue 提前退出**（方法里得用 `some`/`every` 变通）；
2. **性能极端敏感**（千万级数据的热点路径，方法链有中间数组开销）；
3. **逻辑是「一步步走」而不是「一步步转」**（比如状态机、逐行解析）。

日常业务代码，放心用方法链 —— 可读性优先，性能差距微乎其微。

## 小结

记住这个映射：**map 是一对一变换，filter 是筛选，reduce 是汇总**，
这三个覆盖八成场景，其余（find/some/every/sort）当调味料。
多写多练，建议去 [Codewars](https://www.codewars.com) 刷几道数组题，
比看十篇文章都管用。
