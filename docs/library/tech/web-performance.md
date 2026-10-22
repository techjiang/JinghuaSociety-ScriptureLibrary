---
title: 前端性能优化清单
createTime: 2026-10-21
permalink: /library/tech/web-performance/
description: 按性价比排序的性能优化手段，从白嫖级到工程级，附测量方法
---
性能优化最大的坑是「凭感觉」：觉得图片大、觉得 JS 多，
咔咔一顿改，也不知道到底快没快。这篇换个思路：
先讲怎么**量**，再按**性价比**给手段，从「不花钱白嫖」到
「要动工程」排个序。

## 一、先学会量：没有测量的优化是玄学

Lighthouse（Chrome DevTools 里的 Lighthouse 面板）一键跑分：
性能、SEO、无障碍都测。但跑分有随机性，多跑两次取平均。

关键指标（Core Web Vitals）：

![性能指标时间线](/images/perf-metrics.svg)

*图：FCP、LCP、TTI 在页面加载时间轴上的位置*

| 指标 | 含义 | 及格线 |
| --- | --- | --- |
| LCP | 最大内容渲染完成 | < 2.5s |
| INP | 交互响应延迟 | < 200ms |
| CLS | 累积布局偏移 | < 0.1 |

LCP 是「用户多久看到主要内容」，优化它收益最直接。
CLS 治的是「页面乱跳」，别小看它 —— 用户想看的结果被弹走的
广告挤没，那种火气会转移给整个网站。

命令行也能测（CI 里用）：

```bash
npx lighthouse https://example.com --view --only-categories=performance
```

## 二、白嫖级：不用改代码

### 开 Gzip / Brotli

Nginx 上几行配置的事（详见
[Nginx 部署静态站点](../tutorial/nginx-static-deploy.md)），
文本类资源体积立减 60-80%。Brotli 比 Gzip 再强 15-20%，
Nginx 装 `brotli` 模块即可。

### 图片压缩

上传前过一遍 [TinyPNG](https://tinypng.com)，
体积瘦 70%，画质几乎无损。SVG 用 [SVGO](https://github.com/svg/svgo)
清一遍编辑器软件加的废话。**这是全榜单性价比第一的操作**，
不花钱，不写代码。

### 用对格式

- 照片用 WebP（同画质比 JPEG 小 25-35%）+ JPEG 兜底；
- 图标、简单图形用 SVG，矢量无损；
- 别用 PNG 存照片，那是拿 ZIP 的思路存图片 —— 大且笨。

```html
<picture>
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="示例">
</picture>
```

### 图片懒加载

首屏外的图片 `loading="lazy"` 一个属性搞定：

```html
<img src="big.jpg" loading="lazy" width="800" height="600">
```

浏览器原生支持，不引库。注意 `width/height` 一定要写，
不然图片加载出来会把页面顶翻（CLS 暴涨）。

## 三、进阶级：小改代码

### 缓存策略配对

这套是标配，原理见 [HTTP 缓存详解](./http-cache.md)：

- HTML：`no-cache`，每次验证；
- 带 hash 的 JS/CSS/图片：`max-age=31536000, immutable`。

老用户回访，静态资源全走本地缓存，页面秒开。

### 路由级代码分割

单页应用别把所有页面打一个 bundle。Vue/React 都有懒加载：

```ts
// Vue Router
{ path: '/settings', component: () => import('./views/Settings.vue') }
```

用户访问首页只下载首页需要的代码。首屏 JS 从 2MB 砍到 300KB
的案例比比皆是。

### 字体别阻塞渲染

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-display: swap;   /* 字体没到位前先用系统字体，别白屏 */
}
```

`font-display: swap` 一行，避免「字体下载完之前页面不显示文字」。

### 关键 CSS 内联

首屏关键样式直接内联在 HTML `<head>` 里，
剩下的 CSS 异步加载。首屏渲染不等 CSS 文件下载，
LCP 明显改善。构建工具（Vite 插件、critical 库）能自动抽。

## 四、工程级：值得投入但要想清楚

### 上 CDN

静态资源放 CDN，用户就近取。国内站点这是标配，
不是优化，是基础设施。注意 CDN 的缓存刷新策略要跟发布流程对上，
不然发了新版用户拿旧货。

### SSR / 预渲染

内容是 SEO 重点或首屏要求极高的，上 SSR（Nuxt/Next）。
纯内容站可以预渲染（SSG，比如本站）——
每个页面构建时生成静态 HTML，首屏直达，不需要等 JS 执行完再渲染。

### 长任务拆分

主线程上一个 500ms 的同步计算，页面直接卡死半秒。
拆成小片，用 `setTimeout`/`requestIdleCallback` 接力：

```js
function chunkedProcess(items) {
  const batch = items.splice(0, 100)   // 每次只处理 100 条
  process(batch)
  if (items.length) setTimeout(() => chunkedProcess(items), 0)
}
```

用户感觉不到卡顿了。涉及 CPU 密集的（图片处理、大表格计算），
丢 Web Worker，彻底不占主线程。

### 依赖体检

```bash
npx depcheck        # 找没用的依赖
npx webpack-bundle-analyzer dist/stats.json   # 看包体积构成
```

moment.js（400KB 起）换 dayjs（2KB），lodash 全量引换成按需。
「顺手装了个包」是 bundle 膨胀的头号原因。

## 五、优化顺序建议

按这个顺序做，每一步都能在 Lighthouse 上看到分数动：

```text
1. 图片压缩 + 格式 + 懒加载      （半小时，收益最大）
2. 缓存策略配对                 （一小时，一劳永逸）
3. Gzip/Brotli + CDN            （配置级，无脑开）
4. 路由懒加载 + 依赖瘦身          （一天，砍首屏 JS）
5. 关键 CSS 内联 + font-display  （半天，LCP/CLS）
6. SSR / 预渲染                  （看场景，重决策）
```

## 六、两个反模式

**别过早优化**：流量还没起来，先别折腾 SSR。
本站就是纯静态（SSG），Lighthouse 性能分 95+，
够用。**先量后改**，Lighthouse 说哪不行改哪。

**别迷信分数**：Lighthouse 90 分不代表用户觉得快。
真信号是：用户停留时长、跳出率、业务转化。
技术指标是手段，用户体感是目的。

## 小结

性能优化三板斧：**先量（Lighthouse）、先摘低垂果实（图片和缓存）、
再动工程（拆分和 SSR）**。大部分站点做完前两步，
就能超过八成同行。剩下的，看业务值不值得。
