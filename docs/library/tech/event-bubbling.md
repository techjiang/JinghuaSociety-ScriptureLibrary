---
title: 事件冒泡、捕获与委托
createTime: 2026-10-22
permalink: /library/tech/event-bubbling/
description: 事件流的三阶段、target 与 currentTarget、stopPropagation 的正确用法
---

<CategoryTag name="技术" link="/library/tech/" />

# 事件冒泡、捕获与委托

点一个按钮，父容器的点击回调也触发了 —— 这就是**事件冒泡**。
不理解事件流，`e.target` 和 `e.currentTarget` 分不清、
事件委托写不对、`stopPropagation` 滥用导致别的组件失灵。
这篇一次讲透。

## 一、事件流的三阶段

一个 click 事件从触发到结束，走三个阶段：

```text
① 捕获阶段（capture）：document → ... → 目标父级（从外往里）
② 目标阶段（target）：到达目标元素
③ 冒泡阶段（bubble）：目标父级 → ... → document（从里往外）
```

```html
<div id="outer">
  <div id="inner">
    <button id="btn">点我</button>
  </div>
</div>
```

点按钮，事件的传播路径：

```text
document ─捕获─► body ─捕获─► #outer ─捕获─► #inner ─目标─► #btn
                                                          │
document ◄─冒泡─ body ◄─冒泡─ #outer ◄─冒泡─ #inner ◄─────┘
```

**默认监听在冒泡阶段触发**（`addEventListener` 第三参默认 false）。

```js
// 冒泡阶段（默认）
btn.addEventListener('click', handler)

// 捕获阶段（第三参 true，少用，特定场景）
outer.addEventListener('click', handler, true)
```

## 二、target vs currentTarget：一辈子的困惑

```js
outer.addEventListener('click', function (e) {
  console.log(e.target)         // 实际被点的元素（可能是 btn）
  console.log(e.currentTarget)  // 绑定监听的元素（永远是 outer）
  console.log(this === e.currentTarget)  // true（非箭头函数）
})
```

- **e.target**：你手点的那个（事件源）；
- **e.currentTarget**：这个回调挂在谁身上。

事件委托就靠 target 找「真正点的谁」（配 `closest`）：

```js
// 点按钮内部的小图标，e.target 是 icon 不是 button
list.addEventListener('click', (e) => {
  const btn = e.target.closest('.del-btn')   // 从 target 往上找
  if (!btn) return                            // 点的不是按钮区域
  // 处理删除…
})
```

**箭头函数里没有 this** —— 统一用 `e.currentTarget`。

## 三、事件委托：一百个元素一个监听

```js
// ❌ 给每个按钮绑一个（动态加的还没事）
document.querySelectorAll('.del-btn').forEach((btn) => {
  btn.addEventListener('click', handleDelete)     // 100 个监听器
})

// ✅ 委托给共同父级（一个监听器，动态元素自动生效）
list.addEventListener('click', (e) => {
  const btn = e.target.closest('.del-btn')
  if (!btn) return
  handleDelete(btn.dataset.id)
})
```

好处（第三点是关键）：**动态插入的子元素自带事件** ——
不用「加一行 DOM 再绑一次事件」。React/Vue 里也常用
（配合数据渲染，比逐个 ref 干净）。

**委托的前提**：事件会冒泡。不是所有事件都冒泡 ——
`focus`、`blur`、`mouseenter`、`mouseleave`、`scroll`
（在元素上）不冒泡。要用它们的「冒泡版」：
`focusin`、`focusout`、`mouseover`、`mouseout`。

## 四、stopPropagation：什么时候该用

阻止事件继续传播：

```js
// 弹窗里点「关闭」，别触发外层遮罩的 click
modal.addEventListener('click', (e) => {
  e.stopPropagation()      // 到此为止，不往上传
  closeModal()
})

// 遮罩点击关闭（点外面关，点里面不关）
overlay.addEventListener('click', closeModal)     // 会冒泡上来
modal.addEventListener('click', (e) => e.stopPropagation())  // 拦住
```

**滥用症状**：A 组件停了传播，B 组件（父子/兄弟）的点击失灵，
排查半天。**纪律**：

1. 只在自己是「边界」时停（弹窗、下拉、右键菜单这类
   「自包含」组件）；
2. 停之前想「谁还监听这条链」；
3. 更轻的替代：`e.preventDefault()`（阻止默认行为，
   不阻止传播）—— 多数场景你要的是这个
   （阻止链接跳转、表单提交）。

```js
link.addEventListener('click', (e) => {
  e.preventDefault()        // 不跳转，但事件继续冒泡
  console.log('拦截了跳转')
})
```

## 五、once：只触发一次

```js
// 第三方参数配置
btn.addEventListener('click', handler, { once: true })     // 一次后自动解绑

// 被动监听（告诉浏览器「不会 preventDefault」，滚动更流畅）
window.addEventListener('scroll', onScroll, { passive: true })

// 信号取消（AbortController）
const ac = new AbortController()
el.addEventListener('click', handler, { signal: ac.signal })
ac.abort()                  // 一次性取消多个监听
```

`{ once: true }` 是「初始化引导」场景神器；
`{ passive: true }` 是滚动性能优化标配；
signal 取消比手动 removeEventListener 优雅。

## 六、React/Vue 里的事件

框架的事件是这层的封装，理解原生才懂坑在哪：

- **React 全事件委托到 root**（一个监听器管所有）——
  所以 React 里 `e.stopPropagation()` 停的是 React 的合成事件，
  原生监听该收还收；
- **Vue 的 `@click.stop`** = `stopPropagation`、
  `@click.prevent` = `preventDefault` —— 语法糖而已；
- **Vue 模板里 `this`**：箭头函数时指向组件，
  普通函数时 `this` 是触发元素 —— 踩过这个坑的都懂。

## 七、排障速查

| 症状 | 原因 |
| --- | --- |
| 点一个触发俩回调 | 冒泡到父级了，父也有监听 |
| 动态加的按钮没反应 | 绑定发生在插入前，或没用委托 |
| `this` 是 undefined | 箭头函数 + 传统函数混用 |
| 别的组件点击失灵 | 有人 stopPropagation 了 |
| focus 委托不生效 | focus 不冒泡，用 focusin |
| 滚动监听卡 | 没加 passive，或没节流 |

## 小结

事件三阶段：**捕获（外到内）→ 目标 → 冒泡（内到外）**，
默认监听冒泡。`target` 是点的谁，`currentTarget` 是挂谁身上。
委托靠冒泡 + `closest`，`stopPropagation` 只给「边界组件」用。
这套机制二十年没变 —— 前端框架换了一茬，事件流还是它。
