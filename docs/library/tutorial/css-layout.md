---
title: CSS Flex 与 Grid 布局指南
createTime: 2026-10-21
permalink: /library/tutorial/css-layout/
description: 一维用 Flex，二维用 Grid，覆盖九成日常布局，附对齐速查表
---

# CSS Flex 与 Grid 布局指南

CSS 布局以前是个脏活：float 清除浮动、inline-block 的空格 bug、
absolute 定位算到秃头。现在简单了 —— **Flex 管一维，Grid 管二维**，
两个打遍天下。这篇把日常九成场景覆盖掉。

![Flex 与 Grid 的分工](/images/css-layout.svg)

*图：Flex 管一行/一列，Grid 行和列一起管*

## 一、Flex：一维布局神器

Flex 适合「一组元素排成一行或一列，需要分配空间」的场景。

### 最常用的一招：三等分 / 自适应卡片

```css
.container {
  display: flex;
  gap: 16px;              /* 间距，比 margin 省心，不用处理首尾 */
}

.card {
  flex: 1;                /* 三个卡片平分剩余空间 */
}
```

`flex: 1` 是 `flex: 1 1 0%` 的缩写：能放大、能缩小、基准大小为 0。
大白话：**剩下的空间平分**。想要某个卡片占两份，写 `flex: 2`。

### 容器属性速查

```css
.container {
  display: flex;
  flex-direction: row;          /* row（默认）| row-reverse | column | column-reverse */

  justify-content: center;      /* 主轴对齐：flex-start | center | flex-end |
                                   space-between（两端贴边）| space-around | space-evenly */
  align-items: center;          /* 交叉轴对齐：stretch（默认）| flex-start | center |
                                   flex-end | baseline（文字基线对齐，绝了）*/
  flex-wrap: wrap;              /* 放不下就换行 */
  gap: 12px 20px;              /* 行间距 列间距，不写第二个值则行列同值 */
}
```

### 子项属性速查

```css
.item {
  flex: 1;                  /* 上面说的，平分剩余空间 */
  flex-grow: 1;             /* 分开写也行：放大比例 */
  flex-shrink: 1;           /* 缩小比例（空间不够时谁缩） */
  flex-basis: 200px;        /* 基准大小（优先于 width） */
  align-self: flex-end;     /* 单独一个子项的对齐方式，覆盖 align-items */
}
```

### 实战：导航栏（左右两端）

```css
.navbar {
  display: flex;
  justify-content: space-between;   /* logo 左，菜单右 */
  align-items: center;              /* 垂直居中 */
}
```

### 实战：垂直居中（终于不用 transform 了）

```css
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

四行搞定，比当年 `position: absolute + transform: translate(-50%, -50%)`
那一套干净一个世纪。

## 二、Grid：二维布局王者

需要「同时控制行和列」时上 Grid：整页布局、仪表盘、图片墙。

### 基础：定义一个网格

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;   /* 三列等宽 */
  gap: 20px;
}
```

`1fr` = 一份可用空间。三列等宽就写三份。
更灵活的写法：

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);        /* 三列等宽，repeat 省事 */
  grid-template-columns: 200px 1fr;             /* 左固定右自适应（经典侧边栏）*/
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* 响应式神器 */
}
```

最后那个 `auto-fill + minmax` 是**卡片墙标准解法**：
每列至少 240px，能放几列放几列，不用写一个媒体查询。

### 跨行跨列

```css
.header {
  grid-column: 1 / -1;      /* 横跨整行（从第一根线到最后一根线）*/
}

.feature {
  grid-column: span 2;      /* 跨两列 */
  grid-row: span 2;         /* 同时跨两行 */
}
```

### 整页布局模板

```css
body {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.page-header { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-main { grid-area: main; }
.page-footer { grid-area: footer; }
```

`grid-template-areas` 用**字符画**布局，一眼看懂页面结构。
这是 Grid 最被低估的特性 —— 改布局就是改这几行字符串，
比改一堆 class 直观多了。

## 三、怎么选：一张决策表

| 场景 | 用啥 |
| --- | --- |
| 一行/一列元素，间距均匀 | Flex |
| 导航栏、工具栏、按钮组 | Flex |
| 垂直居中 | Flex |
| 卡片墙、图片网格 | Grid（auto-fill） |
| 整页框架（头/侧/主/尾） | Grid |
| 仪表盘、复杂对齐 | Grid |
| 元素需要「按内容大小」排列 | Flex |
| 需要精确控制行列位置 | Grid |

口诀：**内容驱动用 Flex，布局驱动用 Grid**。
不确定就两个都试试，五分钟见分晓。

## 四、Responsive 一句话

Grid 的响应式基本不用媒体查询：

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
```

窄屏自动变一列，宽屏自动三四列。
Flex 的响应式靠 `flex-wrap: wrap` + 合理的基础宽度：

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 260px;        /* 小于 260px 就换行 */
}
```

## 五、对齐速查表（收藏向）

| 需求 | 代码 |
| --- | --- |
| 水平垂直居中 | Flex + `justify-content: center; align-items: center` |
| 两端对齐 | `justify-content: space-between` |
| 等间距分布 | `justify-content: space-evenly` |
| 文字基线对齐 | `align-items: baseline` |
| 一个元素靠右，其他靠左 | `margin-left: auto`（Flex 子项） |
| 最后一行不满也等分 | Grid 的 `1fr 1fr 1fr` 更合适 |

## 六、老项目兼容

IE 11 不支持 Grid，Flex 只支持半吊子（2012 语法）。
2026 年了，除非你在维护祖传项目，否则**别为 IE 写兼容代码**。
真需要：Flex 都够用，Grid 用 `@supports` 降级到 float。

## 小结

日常布局就两把刀：**Flex 切一维（导航、工具栏、居中、均分），
Grid 切二维（整页、卡片墙、仪表盘）**。都写几遍就熟了，
比当年伺候 float 的日子幸福多了。练手推荐
[Flexbox Froggy](https://flexboxfroggy.com)（游戏化学 Flex）和
[Grid Garden](https://cssgridgarden.com)（Grid 版），
各半小时，比看十篇文章管用。
