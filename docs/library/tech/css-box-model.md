---
title: 盒模型与 BFC
createTime: 2026-10-22
permalink: /library/tech/box-model/
description: 标准盒模型 vs IE 盒模型、margin 合并与 BFC，把 CSS 布局的玄学变科学
---

<CategoryTag name="技术" link="/library/tech/" />

# 盒模型与 BFC

CSS 里两个「传说中的难点」：盒模型和 BFC。其实都不难，
难在没人讲清楚。这篇一次搞定，顺便解释一堆「为什么
我的样式不生效」的玄学。

## 一、盒模型：一个元素占多大地方

每个元素是个盒子，从里到外：

```text
┌───────────────── margin（外边距，透明）─────────────────┐
│  ┌───────────── border（边框）─────────────┐            │
│  │  ┌──────── padding（内边距）────────┐   │            │
│  │  │                                │   │            │
│  │  │      content（内容）            │   │            │
│  │  │      width/height 决定的        │   │            │
│  │  │                                │   │            │
│  │  └────────────────────────────────┘   │            │
│  └──────────────────────────────────────┘            │
└──────────────────────────────────────────────────────┘
```

关键问题：**`width: 100px` 指的是哪部分？**

### 标准盒模型（content-box，CSS 默认）

`width` = 内容区。加 padding/border 会**变大**：

```css
.box {
  width: 100px;
  padding: 10px;
  border: 1px solid;
}
/* 实际占地：100 + 10×2 + 1×2 = 122px ← 反直觉！*/
```

### IE 盒模型（border-box）

`width` = 内容+padding+border。padding 加不进来：

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 1px solid;
}
/* 实际占地：100px（padding 和 border 从 100 里扣）*/
```

**现代项目全局切 border-box**（一行搞定）：

```css
*, *::before, *::after { box-sizing: border-box; }
```

之后「宽度就是占地」符合直觉，响应式布局少算一半的账。

## 二、margin：相邻元素的「合并」

### 垂直 margin 合并（最常踩）

```html
<style>
  .a { margin-bottom: 20px; height: 50px; background: red; }
  .b { margin-top: 30px; height: 50px; background: blue; }
</style>
<div class="a"></div>
<div class="b"></div>
```

间距是 20+30=50 吗？**不是，是 30**（取大的）。
两个垂直 margin 会**合并成一个**，值取较大者。

规则：

- 只发生在**垂直方向**（水平不会）；
- 只发生在**普通流**里的块级元素；
- 父子元素的 margin 也会「穿透」（见下）。

### 父子 margin 穿透

```css
.parent { background: gray; }        /* 父没 padding/border */
.child { margin-top: 50px; height: 50px; background: red; }
```

```html
<div class="parent"><div class="child"></div></div>
```

子的 margin-top 会把父一起「顶下去」—— 灰背景跟着红块一起下移。
像是子把 margin 「漏」到了父外。

**解法**（任选一）：

```css
.parent { overflow: hidden; }        /* 1. 触发 BFC（见下）*/
.parent { padding-top: 1px; }        /* 2. 给父加 padding */
.parent { border-top: 1px solid; }   /* 3. 给父加边框 */
.parent { display: flow-root; }      /* 4. 现代正解：明确建 BFC */
```

## 三、BFC：一块「独立王国」

BFC（Block Formatting Context，块级格式化上下文）：
**页面里一块独立的渲染区域，内部怎么闹不影响外面**。

### 怎么触发 BFC

```css
overflow: hidden;        /* 常用，但会裁掉溢出内容 */
overflow: auto;          /* 同上但出滚动条 */
display: flow-root;      /* 现代正解：专为建 BFC 而生，无副作用 */
display: flex / grid;    /* 弹性/网格容器也是 BFC */
position: absolute / fixed;   /* 定位元素（脱离流）*/
float: left / right;     /* 浮动也会建 BFC */
```

**`display: flow-root` 是 2026 年的推荐** —— 专门干这个，
没有 overflow 的副作用。

### BFC 的三个实用能力

**1. 包住浮动（清除塌陷）**

```css
.container { display: flow-root; }   /* 父自动包住浮动子元素 */
.float-child { float: left; width: 100px; height: 100px; }
```

老写法 `.clearfix::after { content: ''; display: block; clear: both; }`
退休了，一行 `flow-root` 搞定。

**2. 阻止 margin 合并/穿透**（上文说的父子穿透解法）

**3. 不被浮动元素覆盖**

```css
/* 左侧浮动的侧栏，右侧文字不被盖住 */
.sidebar { float: left; width: 200px; }
.content { display: flow-root; }     /* content 成 BFC，不跟浮动重叠 */
```

## 四、margin 合并的完整规则

```text
合并发生：
✅ 兄弟块级元素的垂直 margin
✅ 空块的自身上下 margin
✅ 父子（父没建 BFC 时）的 margin 穿透

不合并：
❌ 水平 margin（左右）
❌ 行内元素/inline-block 的垂直 margin
❌ flex/grid 子项（它们的布局模型不同）
❌ 根元素
```

**flex/grid 里没这些破事** —— 这是现代布局抛弃 float/block
流的原因之一。

## 五、调试：DevTools 看盒模型

F12 → Elements → 选中元素 → 底部/右侧的盒模型图：

```text
┌───────────── 320 ─────────────┐   ← 蓝色：元素实际占地
│  ┌──────── 280 ────────┐      │   ← 橙色：content
│  │                      │      │
```

每个数字可点开看计算值。**「我的间距怎么是 30 不是 50」、
「这元素怎么比父还宽」** —— 看一眼盒模型图全明白。

## 六、什么时候还会遇到这些

- **改老项目**（float 布局、没 box-sizing）：BFC 知识救命；
- **排查「诡异的间距」**：margin 合并是第一嫌疑；
- **面试**：「BFC 是什么/怎么触发/解决 margin 穿透」高频题。

新项目？`box-sizing: border-box` 全局 + flex/grid 布局，
这些坑八成碰不到。但懂了原理，碰到的两成也不慌。

## 小结

盒模型三句话：**默认 content-box（width 不含 padding）、
全局 border-box 更直观、DevTools 盒模型图是裁判**。
BFC 三句话：**一块独立渲染区、`display: flow-root` 触发、
用来包浮动/防 margin 穿透/防浮动覆盖**。CSS 布局的「玄学」，
到此为止。
