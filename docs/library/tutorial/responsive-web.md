---
title: 响应式网页设计实战
createTime: 2026-10-22
permalink: /library/tutorial/responsive-web/
description: 视口、流式布局、媒体查询、响应式图片与移动端适配的完整方案
---
2026 年，移动端流量早就过半了。你的网站要是在手机上要左右滑着看，
用户跑得比谁都快。响应式不是「加几个媒体查询」那么敷衍，
是一套从根上适配多屏的思路。这篇按落地顺序讲。

## 一、地基：viewport 与流式宽度

每个页面 head 里必须有这行：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

没它，手机浏览器会把页面当桌面宽度渲染再缩小，字小得要放大看。

然后**忘掉固定宽度**：

```css
/* 反例：写死 1200px，手机上横向滚动 */
.container { width: 1200px; }

/* 正例：流式 + 上限 */
.container { width: 100%; max-width: 1200px; }
```

`max-width` + `width: 100%` 是响应式的基本功：大屏不超限，小屏自动收缩。

## 二、盒模型与弹性单位

先打这个补丁（所有现代项目都该有）：

```css
*, *::before, *::after { box-sizing: border-box; }
```

有了它，`width: 50%` + `padding: 20px` 不会溢出 —— padding 算在宽度内。

单位选择：

| 单位 | 用在哪 |
| --- | --- |
| `%` | 流式布局宽度 |
| `rem` | 字号、间距（跟随根字号，无障碍友好） |
| `em` | 组件内相对间距（跟随当前字号） |
| `vw/vh` | 全屏区块、视口相关尺寸 |
| `px` | 边框、阴影这类「物理尺寸」 |

字号用 `rem` 的好处：用户在浏览器调了「大字号」，你的站点跟着放大 ——
这对视力不好的用户是刚需。

## 三、Flex 和 Grid：布局不用算

布局层的主力在 [CSS Flex 与 Grid](../css-layout.md) 那篇讲透了。
这里补响应式相关的两个模式：

**卡片墙自动换行**（不用媒体查询）：

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
```

**导航在窄屏堆叠**：

```css
.navbar {
  display: flex;
  flex-wrap: wrap;
}
.navbar .brand { flex: 1 1 100%; }  /* 窄屏时 logo 占整行 */
```

## 四、媒体查询：按断点分支

断点不是「设备尺寸」，是**你的布局撑爆的临界点**。

```css
/* 移动优先：先写小屏样式，再逐步增强 */
.card { padding: 16px; }

/* 平板 */
@media (min-width: 768px) {
  .card { padding: 24px; }
}

/* 桌面 */
@media (min-width: 1024px) {
  .card { padding: 32px; }
}
```

**移动优先（min-width）优于桌面优先（max-width）**：
小屏样式简单，大屏是「加东西」，代码增量更自然；
性能也略好（手机不用解析桌面规则再覆盖）。

常用断点参考（别照抄，看你的内容）：

```text
< 576px   手机
576-768   大屏手机横屏
768-992   平板
992-1200  小桌面
> 1200    桌面
```

## 五、响应式图片：别让手机下 4K 图

```html
<!-- srcset：浏览器按屏幕密度/尺寸选 -->
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="示例"
/>

<!-- picture：按格式/ art direction 切换 -->
<picture>
  <source srcset="photo.webp" type="image/webp">
  <source srcset="photo.avif" type="image/avif">
  <img src="photo.jpg" alt="示例">
</picture>
```

- `srcset` + `sizes`：告诉浏览器「这图在不同宽度下显示多大」，
  它自己选合适的文件。**手机上不会再下 1200px 的图了**；
- `<picture>`：现代格式（WebP/AVIF）+ 兜底 JPEG。

懒加载别忘了：`<img loading="lazy">`（首屏图除外）。

## 六、移动端专属适配

### 触摸目标别太小

按钮、链接的可点区域至少 44×44px（苹果的规范）。 padding 撑起来：

```css
.btn { padding: 12px 20px; }  /* 别用 4px 8px 那种「精致」按钮 */
```

### hover 的坑

手机上没 hover。`:hover` 样式在触摸设备上「点了才触发，走了不消失」，
体验诡异。用媒体查询隔离：

```css
@media (hover: hover) {
  .card:hover { transform: translateY(-4px); }
}
```

### 100vh 的坑

手机浏览器地址栏会让 `100vh` 超出可视区（地址栏收起时多一块）。
用新单位：

```css
.hero { height: 100dvh; }  /* dynamic viewport height，随地址栏伸缩 */
```

### 安全区

iPhone 刘海机型，底部横条会盖内容：

```css
body {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## 七、测试：真机 + 模拟

1. **Chrome DevTools 设备模拟**（`Ctrl+Shift+M`）：快速验证各尺寸，
   但只是模拟，触摸、渲染有差异；
2. **真机**：手机访问 `http://你的IP:端口`（同局域网下），
   DevTools 的 [Remote Debugging](https://developer.chrome.com/docs/devtools/remote-debugging/)
  还能在电脑上调试手机页面；
3. **重点验**：320px 窄屏（小安卓）、横屏、iPad、
   以及「字体调到最大」的场景。

## 八、检查清单

- [ ] viewport meta 有；
- [ ] 无固定宽度容器；
- [ ] 图片有 srcset/sizes + 懒加载；
- [ ] 按钮触摸区 ≥ 44px；
- [ ] hover 效果隔离；
- [ ] 100vh 改成 100dvh；
- [ ] 320px 下不横向滚动；
- [ ] 真机点一遍主要流程。

## 小结

响应式的顺序：**viewport 打底 → 流式宽度 → Flex/Grid 布局 →
断点微调 → 图片适配 → 移动端细节**。前四步做好，九成页面自适应了，
后两步是「从能用到好用」。本站就是这套方案 —— 缩小浏览器窗口试试，
布局会跟着变。
