---
title: CSS 布局模式速查：从居中到圣杯
createTime: 2026-10-22
permalink: /library/tutorial/css-flex-patterns/
description: 八种最常见页面布局的现代写法，复制就能用
---

# CSS 布局模式速查：从居中到圣杯

每天写的布局其实就那几种。这篇收集**八种最高频的布局模式**，
每种给「现代写法（Flex/Grid）」的完整代码。复制、改改、用。

## 一、水平垂直居中

```css
.parent {
  display: flex;
  justify-content: center;   /* 水平 */
  align-items: center;       /* 垂直 */
  min-height: 100vh;
}
```

四行搞定。单行文本垂直居中更简单：`line-height` 等于容器高度。

## 二、两端对齐（导航栏）

```css
.navbar {
  display: flex;
  justify-content: space-between;   /* 左右两端，中间均分空隙 */
  align-items: center;
  padding: 0 24px;
}
```

变体：`space-around`（每项两侧等距）、
`space-evenly`（所有空隙完全相等）。

## 三、等分卡片栏

```css
.cards {
  display: flex;
  gap: 20px;                /* 间距（比 margin 干净，不用处理首尾）*/
}
.card { flex: 1; }          /* 三张卡平分 */
```

某张卡占双倍：`.card-wide { flex: 2; }`。

## 四、自适应卡片墙（不用媒体查询）

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
```

窄屏一列、宽屏三四列，自动。**这是现代 CSS 最省心的模式之一**，
本站的资源卡片就是这么排的。

## 五、侧边栏 + 主内容（经典两栏）

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;   /* 侧栏固定，主区自适应 */
  gap: 24px;
  min-height: 100vh;
}

/* 窄屏变上下堆叠 */
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
}
```

侧栏要能滚动、主区独立滚动的「后台布局」：

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;      /* 顶栏 + 内容 */
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  height: 100vh;
}
.sidebar { grid-area: sidebar; overflow-y: auto; }
.header { grid-area: header; }
.main { grid-area: main; overflow-y: auto; }
```

`grid-template-areas` 用字符画布局，改布局就是改字符串 ——
比改 class 直观。

## 六、Sticky 侧边栏（跟随滚动）

```css
.sidebar {
  position: sticky;
  top: 20px;               /* 距顶 20px 时吸住 */
  align-self: start;       /* Grid/Flex 里必须加，否则被拉伸 */
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}
```

**`align-self: start` 是关键**：在 Grid/Flex 容器里，
子项默认 `stretch`（等高），sticky 会失效。

## 七、粘性顶栏 + 平滑锚点

```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;            /* 压在内容上 */
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);   /* 毛玻璃，现代感 */
}
```

配合 html 的 `scroll-behavior: smooth` + `scroll-padding-top`
（锚点跳转不被 sticky 头挡）：

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;    /* 顶栏高度 + 余量 */
}
```

## 八、等高列（不用算）

Flex 默认拉伸，等高免费送：

```css
.row { display: flex; gap: 20px; }
.col { flex: 1; }        /* 三列自动等高 */
```

某列内容多、其他列少？照样等高，背景色不会「短一截」。
（老时代的 clearfix + 等高黑魔法，全部退休。）

## 九、图片自适应 + 防抖动

```css
img {
  max-width: 100%;       /* 不溢出容器 */
  height: auto;          /* 比例不变 */
  display: block;        /* 去掉基线空隙 */
}

/* 更好：提前占位，图片加载不抖（CLS 优化）*/
.img-wrap {
  aspect-ratio: 16 / 9;
  background: #f1f5f9;   /* 加载前的占位色 */
}
.img-wrap img { width: 100%; height: 100%; object-fit: cover; }
```

`aspect-ratio` + `object-fit` 是现代图片布局的两件套，
配合[性能优化](../../tech/web-performance.md)的 CLS 部分看。

## 十、一分钟速查卡

| 需求 | 写法 |
| --- | --- |
| 水平垂直居中 | flex + justify/align center |
| 两端对齐 | space-between |
| 等分列 | flex: 1 |
| 自适应卡片 | grid auto-fill minmax |
| 两栏布局 | grid 240px 1fr |
| 后台框架 | grid-template-areas |
| 跟随滚动 | sticky + align-self start |
| 顶栏毛玻璃 | sticky + backdrop-filter |
| 等高列 | flex 默认 |
| 图片自适应 | max-width + aspect-ratio |

## 小结

八种模式覆盖九成日常布局。**共同点：没人用 float 了，
没人算像素了，没人写 clearfix 了。** Flex 管一维、
Grid 管二维、sticky 管吸附 —— 这就是 2026 年的布局三件套。
收藏这页，写布局前扫一眼。
