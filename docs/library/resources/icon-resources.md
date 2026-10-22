---
title: 图标资源与使用方案
createTime: 2026-10-22
permalink: /resources/icon-resources/
description: Iconify、Material Symbols、Remix Icon 与 SVG 雪碧图，附本站用法
---

# 图标资源与使用方案

图标是界面的调味料：没有能跑，用好提气质。问题是图标库太多、
用法各异（字体/ SVG/组件），选错了要么加载慢要么定制难。
这篇盘点主流方案，附本站的实际用法。

## 一、Iconify：按需加载的终极方案

[Iconify](https://iconify.design) 不是图标库，是**框架**：
聚合了 200+ 图标集（Material、Font Awesome、Remix、Lucide…）
十几万个图标，**按需加载单个 SVG**。

```html
<!-- 用法：一个组件，图标名指向任意集合 -->
<span class="iconify" data-icon="mdi:github"></span>
```

前端框架有封装：Vue（`@iconify/vue`）、React（`@iconify/react`）。
本站（Plume 主题）内置的就是它 —— 导航栏、features 卡片的图标
（`material-symbols:school-outline` 这种）全走的 Iconify。

**优点**：一个库管所有、按需加载（用几个加载几个）、
统一 API。**推荐作为默认方案。**

## 二、Material Symbols：Google 出品

[Material Symbols](https://fonts.google.com/icons)：Material Design
的官方图标，风格现代，**可变字体技术**让粗细、填充可调：

```html
<!-- 可变轴：weight 300-700，fill 0-1 -->
<span class="material-symbols-rounded" style="font-variation-settings: 'wght' 400, 'FILL' 0">home</span>
```

本站用的就是它（经 Iconify 接入）。适合：需要风格统一的
产品级界面。

## 三、其他优秀图标集

| 图标集 | 风格 | 授权 |
| --- | --- | --- |
| **Remix Icon** | 中性、线性/面性双风格，2400+ | Apache 2.0 |
| **Lucide** | Feather 的社区续作，简洁轻快 | ISC |
| **Phosphor Icons** | 六种字重，灵活 | MIT |
| **Tabler Icons** | 4000+，后台管理神器 | MIT |
| **Font Awesome** | 老牌，图标最全（免费版 2000+） | 图标 CC-BY，代码 MIT |

做后台/工具类界面，**Tabler** 和 **Remix** 覆盖度最高；
要极致简洁，**Lucide**。

## 四、三种使用方式对比

### 1. 图标字体（iconfont）

```css
.icon-home::before { content: "\e900"; font-family: 'iconfont'; }
```

- 优点：写法简单，颜色字号一个 `color`/`font-size` 搞定；
- 缺点：整包加载（几百个图标全下）、单色、FOUC（字体闪烁）、
  多色图标没戏。

**遗留项目见得多，新项目不推荐。**

### 2. SVG 组件/内联

```html
<svg class="icon" viewBox="0 0 24 24"><path d="…"/></svg>
```

- 优点：多色、可控（CSS 改路径）、无字体闪烁；
- 缺点：手写 path 累，管理散。

框架里配合 `vite-svg-loader` 可以直接 `import Icon from './icon.svg'`。

### 3. Iconify 组件（推荐）

```vue
<template>
  <Icon icon="mdi:github" />
</template>
```

按需加载 + 全图标集 + 组件化。**本站方案，懒人首选。**

## 五、实用技巧

**尺寸对齐**：SVG 图标当文本处理，`width: 1em; height: 1em` +
`vertical-align: -0.15em`，跟文字基线对齐：

```css
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;  /* 继承文字颜色，暗色模式自动适配 */
}
```

**暗色模式**：图标用 `currentColor`，颜色跟文字走，
切主题不用管图标。

**动态图标**：Material Symbols 的 FILL 轴可以做「实心/空心」
切换（收藏按钮点亮效果），Iconify 里直接用：

```html
<span class="iconify" data-icon="mdi:heart" style="font-variation-settings: 'FILL' 1"></span>
```

**自己找图标**：[icones.js.org](https://icones.js.org)（Iconify 的
搜索站，十几万个图标搜名字，复制即用）—— 收藏这一个站够用。

## 六、本站实践

技术客栈的图标用法：

- 导航栏/features：Material Symbols（经 Iconify）；
- logo/favicon：手绘 SVG（本站「印章阁」）；
- 文章配图：手绘 SVG 示意图。

零图标字体、零图标包 —— 全站图标相关的额外请求约等于零。
Lighthouse 分数好看，不是没原因的。

## 小结

图标方案一句话：**默认 Iconify（按需+全家桶），
风格统一用 Material Symbols，简洁路线 Lucide，
后台工具 Tabler**。用法上 SVG 组件 + `currentColor` 是正解，
图标字体留给存量项目。搜索只认一个站：icones.js.org。
