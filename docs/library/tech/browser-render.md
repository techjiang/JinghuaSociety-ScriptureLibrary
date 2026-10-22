---
title: 浏览器是怎么把页面渲染出来的
createTime: 2026-10-21
permalink: /tech/browser-render/
description: 从 HTML 字节流到像素的完整旅程，讲清重排重绘，以及 CSS 该放哪
---

# 浏览器是怎么把页面渲染出来的

每天打开无数网页，但「浏览器到底怎么把一堆字节变成像素」，
很多人说不清。搞懂这条流水线，很多「玄学」问题
（CSS 放头部还是尾部、动画为什么卡、改样式为什么慢）
都会有答案。

## 一、完整流水线

![浏览器渲染流水线](/images/browser-render.svg)

*图：从 HTML+CSS 到屏幕像素的六个阶段*

### 1. 解析：字节 → 对象

服务器返回的 HTML 是字节流，浏览器按顺序：

```text
字节流 → 字符（按编码解码）→ 标签（tokenize）→ 节点 → DOM 树
```

CSS 也一样，解析成 CSSOM（CSS 对象模型）。

### 2. 合成渲染树

DOM + CSSOM 合并成**渲染树** —— 只包含「最终可见的节点」。

注意：`display: none` 的元素**不在渲染树里**（根本不渲染），
而 `visibility: hidden` 的元素**在**（占地方，只是看不见）。
这个区别在排查「元素莫名占位」时是关键线索。

### 3. 布局（Layout）

计算每个节点的几何信息：位置、大小、层级。
输出一棵「布局树」。

### 4. 绘制（Paint）

把布局树转成一个个绘制指令：先画背景、再画文字、再画边框……
类似 Photoshop 的图层概念。

### 5. 合成（Composite）

浏览器把页面拆成多个图层，分别绘制再交给 GPU 合成。
`transform`、`opacity`、`video` 等会触发独立图层 ——
**这就是 GPU 加速的原理**。

## 二、重排（Reflow）与重绘（Repaint）

页面建好后，你改点东西，浏览器要重新跑部分流水线。

### 重排：改了「位置大小」

改这些属性会触发重排：

```text
width / height / margin / padding / border
position / top / left / display / float
font-size / line-height / text-align
offsetTop / scrollTop 等几何属性（读也会触发！）
```

重排意味着**布局阶段要重跑**，而且可能级联 ——
父元素宽了，所有子元素的位置都可能变。

### 重绘：只改了「颜值」

```text
color / background / box-shadow / border-color / visibility
```

这些不影响几何，跳过布局，直接重新画。

### 性能差异

```text
重排 + 重绘 > 重绘 > 合成
```

`transform` 和 `opacity` 是特例：**只走合成阶段**，
布局和绘制都不碰，所以动画用它们最流畅。
这也是「别用 left/top 做动画，用 transform」的根本原因。

## 三、几个实际问题的答案

### CSS 该放 head 里，JS 放 body 底部？

**对，但原因要修正一下**：不是因为「加载顺序」，
是因为 **JS 会阻塞 HTML 解析**。

浏览器边下 HTML 边解析，遇到 `<script src>` 会停下来：
下载、执行完，才继续解析。所以同步脚本放 head 里，
页面主体半天渲染不出来。

`defer` 和 `async` 是更现代的解法：

```html
<script src="app.js" defer></script>   <!-- 下载不阻塞解析，DOM 就绪后按顺序执行 -->
<script src="analytics.js" async></script> <!-- 下载执行都不阻塞，谁先好谁先跑 -->
```

**现代项目无脑 `defer`**（保证执行顺序且不阻塞），
`async` 只给统计脚本这类「谁也不依赖谁」的用。

### 为什么读 offsetTop 会触发重排

```js
el.style.width = '100px'      // 写：只是标记「布局脏了」
const w = el.offsetWidth      // 读：浏览器被迫立刻重排，返回最新值
el.style.height = '50px'      // 又写
const h = el.offsetHeight     // 又被迫重排
```

**「读-写-读-写」交替，就是强制同步布局（Layout Thrashing）**，
每次读都触发一次完整重排。循环里这么干，页面直接卡死。

正确做法：**先批量写，再批量读**：

```js
// 好：写完一次性读
el.style.width = '100px'
el.style.height = '50px'
const w = el.offsetWidth
const h = el.offsetHeight
```

### will-change: transform 是银弹吗

不是。它强制提前建图层，**每个图层都吃内存**。
滥用会导致内存暴涨、移动端崩溃。只给**确实要动的元素**加，
动画结束可以考虑移除。

## 四、DevTools 里看渲染

Chrome DevTools：

- **Rendering 面板**（Cmd/Ctrl+Shift+P 搜 "Show Rendering"）：
  勾 **Paint flashing**，每次重绘的区域闪绿光，肉眼可见哪里在重绘；
- **Performance 面板**：录一段操作，火焰图里紫色的 Layout
  就是重排，越长越卡；
- **Layers 面板**（更多工具里）：看页面被拆成了几层。

排查动画卡顿的标准流程：录 Performance → 找长的紫色 Layout 块 →
看调用栈 → 八成是读了布局属性。

## 五、给写代码的三条建议

1. **动画只用 transform 和 opacity**。位置变化用 `translate`，
   缩放用 `scale`，透明度用 `opacity`。这三个是合成阶段的，
   帧率稳；
2. **读写 DOM 样式分离**。要么全写完再读，要么用
   `requestAnimationFrame` 批量处理。别在循环里
   `style.xxx = ...` 和 `offsetXxx` 交替；
3. **display: none 和 visibility: hidden 分场景用**。
   前者彻底不渲染（省性能但会触发重排），后者保留占位
   （做「隐藏但留位置」的动画更平滑）。

## 小结

浏览器渲染六步：**解析 → 渲染树 → 布局 → 绘制 → 合成**。
改几何属性触发「重排+重绘」，改颜色只触发「重绘」，
改 transform/opacity 只触发「合成」—— 性能一个比一个轻。
日常写代码，记住「动画只用 transform、DOM 读写分离、
JS 用 defer」这三条，就已经避开九成的性能坑了。
