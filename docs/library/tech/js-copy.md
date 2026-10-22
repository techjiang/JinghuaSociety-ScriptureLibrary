---
title: JavaScript 深浅拷贝
createTime: 2026-10-22
permalink: /library/tech/js-copy/
description: 引用陷阱、浅拷贝四种写法、深拷贝三种方案与选型
---

# JavaScript 深浅拷贝

「我明明复制了对象，改副本原对象也变了！」——每个 JS 开发者
都吼过这一句。根源：**对象是引用类型，赋值复制的是「地址」**。
这篇把拷贝讲透，从此和这个 bug 永别。

## 一、根因：赋值 ≠ 复制

```js
const a = { name: '张三' }
const b = a                // b 和 a 指向同一个对象！
b.name = '李四'
console.log(a.name)        // '李四' ← 吓人不
```

内存里只有一个对象，`a` 和 `b` 是贴在它身上的两张便利贴。
改内容，两边都看见。**数组同理**（数组也是对象）。

## 二、浅拷贝：复制一层，深层共享

「第一层」复制了，但嵌套的对象还是共享：

```js
const original = {
  name: '张三',
  address: { city: '北京' }     // 嵌套对象
}
```

### 方法一：展开语法（最常用）

```js
const copy = { ...original }
copy.name = '李四'          // ✅ 不影响 original.name
copy.address.city = '上海'  // ❌ original.address.city 也变了！
```

### 方法二：Object.assign

```js
const copy = Object.assign({}, original)
```

效果同上。数组对应：

```js
const arrCopy = [...originalArr]
const arrCopy2 = originalArr.slice()
const arrCopy3 = Array.from(originalArr)
```

**什么时候浅拷贝够用**：只有一层、或嵌套层你确定不会改
（比如配置对象）。**改嵌套属性前，先想深拷贝**。

## 三、深拷贝：彻彻底底的复制

### 方法一：structuredClone（现代标准，推荐）

```js
const copy = structuredClone(original)
copy.address.city = '上海'   // ✅ original 不受影响
```

浏览器和 Node 17+ 原生支持。优点：

- 真正的深拷贝（任意层级）；
- 支持 Date、Map、Set、ArrayBuffer、循环引用；
- **同步、快**（底层优化过）。

唯一限制：不能拷贝函数、DOM 节点、类实例的方法
（会抛错）—— 那些场景也没有「拷贝」的意义。

**2026 年了，这是默认选择。** 下面的方法知道原理即可。

### 方法二：JSON 大法（有坑）

```js
const copy = JSON.parse(JSON.stringify(original))
```

经典老方，能跑但有五个坑：

1. **undefined 丢失**（`{a: undefined}` → `{}`）；
2. **Date 变字符串**（`new Date()` → ISO 字符串）；
3. **NaN/Infinity 变 null**；
4. **函数/ Symbol 被丢弃**；
5. **循环引用报错**。

纯数据对象（接口返回值）用着没问题，其他场景别偷这个懒。

### 方法三：手写递归（面试专用）

```js
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(deepClone)

  const copy = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {        // 只拷自己的属性
      copy[key] = deepClone(obj[key])     // 递归
    }
  }
  return copy
}
```

面试让你「手写深拷贝」，写这个 + 处理 Date/循环引用
（加个 WeakMap 缓存已访问的）。生产用 `structuredClone`。

## 四、选型表

| 场景 | 用什么 |
| --- | --- |
| 只有一层/嵌套不改 | `{ ...obj }` |
| 纯数据深拷贝（默认） | **`structuredClone(obj)`** |
| 接口返回的纯 JSON | `JSON.parse(stringify(x))` 也行 |
| 含 Date/Map/Set | `structuredClone` |
| 含函数/类实例 | 别拷贝，重新构造；或 lodash `cloneDeep` |
| 面试手写 | 递归版 + WeakMap |

## 五、实战：这些场景都要拷贝

### 1. 表单「取消修改」

```js
// 打开编辑弹窗时，存个副本；取消就还原
const backup = structuredClone(formData)

function onCancel() {
  Object.assign(formData, backup)    // 还原
}
```

### 2. 数组排序不污染原数据

```js
// sort 会改原数组！
const sorted = [...users].sort((a, b) => a.age - b.age)   // 先拷贝再排
```

### 3. 添加历史记录（撤销功能）

```js
const history = [structuredClone(state)]    // 每步存快照
function undo() {
  state = structuredClone(history.pop())    // 恢复时也要拷贝，别共享引用
}
```

## 六、和框架的关系

React 的「不可变更新」本质就是拷贝：

```js
// 别改原 state，复制新的
setUser({ ...user, name: '新名字' })        // 浅拷贝 + 覆盖一字段
setItems([...items, newItem])              // 数组拷贝 + 追加
```

嵌套深的，浅拷贝不够（改 `user.address.city` 得逐层拷）：

```js
setUser({
  ...user,
  address: { ...user.address, city: '上海' }   // 逐层 spread
})
```

（嫌烦？上 Immer，`produce` 里直接改，它帮你生成不可变副本。）

Vue 的响应式会自动包 Proxy，`ref/reactive` 的对象赋值给新变量
仍是响应式代理 —— 拷贝场景用 `structuredClone` 时注意：
拷出来的是**普通对象**（脱离响应式），这是想要的效果
（快照就该是死的）。

## 小结

拷贝三句话：**赋值是贴便利贴、浅拷贝 `{...}` 复制一层、
深拷贝 `structuredClone` 一劳永逸**。JSON 大法能用但有五坑，
手写递归是面试题。日常业务先问自己：「我会改嵌套属性吗？」 ——
会，就深拷贝。
