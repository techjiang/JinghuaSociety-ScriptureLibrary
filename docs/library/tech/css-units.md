---
title: CSS 单位全解
createTime: 2026-10-22
permalink: /library/tech/css-units/
description: px/em/rem/vw/vh/%/ch 的行为差异与选型，响应式与无障碍友好
---

# CSS 单位全解

CSS 单位十几种，日常用五种。选错单位的后果：
响应式崩、用户调大字号没反应、滚动条忽现忽没。
这篇讲清每个单位的「相对于什么」，给选型表。

## 一、绝对单位（物理尺寸）

```text
px    像素（CSS 像素，逻辑单位，不是物理像素）
pt    磅（1pt = 1.33px，打印用）
cm/mm 物理尺寸（打印）
```

**CSS 像素 ≠ 设备物理像素**。手机 DPR（设备像素比）2 的屏幕上，
1 CSS px = 2×2 物理像素。所以「100px 宽」在不同手机上
物理大小不同 —— 但 CSS 逻辑上一样大，这正是我们想要的抽象。

**px 仍是边框、阴影、小尺寸的首选**（这些就该精确）。

## 二、相对字体：em 和 rem

### em：相对当前元素字号

```css
.parent { font-size: 16px; }
.child {
  font-size: 2em;        /* 32px（相对自己的父）*/
  padding: 1em;          /* 32px（相对自己的字号！）*/
}
```

**坑**：em 在嵌套里「复合爆炸」：

```css
html { font-size: 16px; }
div { font-size: 1.2em; }      /* 19.2px */
div div { font-size: 1.2em; }  /* 23px（1.2 × 19.2）*/
div div div { font-size: 1.2em; }  /* 27.6px…越套越大 */
```

padding/margin 用 em 时，相对的是**自己元素的字号**，
不是父的 —— 这条最常搞错。

### rem：相对根元素字号

```css
html { font-size: 16px; }
h1 { font-size: 2rem; }       /* 32px，无论嵌套多深 */
p { margin-bottom: 1.5rem; }  /* 24px，永远这个值 */
```

**rem 永远相对 `<html>`**，不复合、好计算。
现代项目**间距、字号默认用 rem** —— 配合根字号调整，
整站等比缩放（无障碍友好）。

```css
/* 用户浏览器调了大字号？跟涨 */
html { font-size: 100%; }          /* 默认 16px，但用户可改 */
body { font-size: 1rem; }
.card { padding: 1.5rem; }         /* 用户的 16px → 24px；用户改 20px → 30px */
```

## 三、相对视口：vw 和 vh

```text
vw   视口宽的 1%（50vw = 屏宽一半）
vh   视口高的 1%
vmin/vmax  宽高较小/较大者的 1%
dvh/svh/lvh  动态/较小/较大的视口高（应对移动端地址栏）
```

```css
.hero { height: 100vh; }        /* 经典：满屏 hero */
.hero { height: 100dvh; }       /* 现代：地址栏收起时不溢出 */

.hero-title { font-size: clamp(2rem, 5vw, 4rem); }
```

**`clamp(最小, 弹性, 最大)`** 是流体排印神器：
字号随视口伸缩，但有上下限（不会小到看不见/大到离谱）。

**vh 的移动端坑**：地址栏会让 100vh 超出可见区 → 用 100dvh。

## 四、百分比：相对父元素

```css
.child { width: 50%; }      /* 父宽的一半 */
```

注意**不同属性百分比相对的东西不同**：

| 属性 | 相对于 |
| --- | --- |
| width/height | 父元素宽/高 |
| padding/margin（上/下） | **父元素宽**（不是高！反直觉） |
| top/bottom | 父高 |
| border-radius | 自身宽高 |
| font-size | 父字号 |
| transform: translate | 自身尺寸 |

padding-top: 50% 相对父宽 —— 「padding 百分比实现正方形」
的老技巧就靠这个。

## 五、容器查询单位（新）

```css
.card-container { container-type: inline-size; }

.card-title {
  font-size: clamp(1rem, 3cqi, 1.5rem);   /* 容器宽的 1% */
}
```

`cqi/cqw/cqh/cqmin/cqmax`：相对**容器**（不是视口）！
组件级响应式的未来 —— 「这个卡片在侧栏就小字号，
在主区就大字号」，不用管页面宽。

浏览器支持已普及（Chrome 105+、Safari 16+、Firefox 110+），
2026 年可以放心用。

## 六、其他有用单位

```text
ch     字符「0」的宽度（限制文字宽度：max-width: 65ch 最佳阅读宽度）
ex     字符 x 的高度（少用）
fr     Grid 的「份数」（grid-template-columns: 1fr 2fr）
deg/rad 旋转角度
s/ms  动画时长
```

`ch` 是排版神器：

```css
.prose { max-width: 65ch; }    /* 一行 65 字符左右，阅读最舒适 */
```

本站文章正文就是这个思路（虽然不是 ch 实现的）。

## 七、选型表（日常版）

| 用途 | 推荐 | 理由 |
| --- | --- | --- |
| 字号 | **rem** | 无障碍友好，用户调字号跟涨 |
| 间距（margin/padding） | **rem** | 全局节奏一致，好算 |
| 边框/阴影/圆角小值 | px | 精确，不该缩放 |
| 满屏区块 | **dvh** | 移动端不出错 |
| 弹性字号标题 | clamp + vw | 流体但有边界 |
| 宽度填充 | % | 相对父容器 |
| 阅读宽度限制 | ch | 排版最佳实践 |
| 组件响应式 | cqi | 容器查询 |

## 八、一个常见错误示范

```css
/* ❌ 字号用 px：用户调大浏览器字号，网站无动于衷 */
body { font-size: 14px; }

/* ✅ */
body { font-size: 0.875rem; }     /* 14px 等效，但可缩放 */
```

**字号不用 px**（顽固派例外）—— 这是无障碍的基本功，
视障用户真的会调。

## 小结

单位三六九：**rem 管字号间距（可缩放）、px 管细节（精确）、
vw/dvh 管视口（响应式）、% 管填充、ch 管阅读宽度、cqi 管组件**。
记住两条红线：**字号别用 px、100vh 改 100dvh**。
其他的，按表抄。
