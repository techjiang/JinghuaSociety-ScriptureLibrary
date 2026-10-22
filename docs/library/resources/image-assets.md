---
title: 免费图片与素材资源
createTime: 2026-10-22
permalink: /resources/image-assets/
description: 免费图库、背景、插画与压缩工具，配一份图片使用规范
---

# 免费图片与素材资源

网站要好看，图片是刚需；但随便百度图库下载的图，
既有版权风险又有水印。这篇收「免费可商用」的图片源、
插画素材和压缩工具，附一套使用规范。

## 一、免费图库：可商用的照片

| 站点 | 特点 |
| --- | --- |
| **[Unsplash](https://unsplash.com)** | 质量天花板，风景/人文强 |
| **[Pexels](https://www.pexels.com)** | 量大，有视频素材 |
| **[Pixabay](https://pixabay.com)** | 插画矢量也有 |
| **[StockSnap](https://stocksnap.io)** | 每周更新，分类清晰 |
| **[Burst](https://burst.shopify.com)** | 电商/产品场景多 |

**注意「免费」的边界**：Unsplash/Pexels 的许可证允许商用，
但**不能把原图当「你的产品」卖**（比如印成 T 恤卖钱），
也不能暗示照片里的人代言你的产品。正常网站使用没问题。

**国内访问慢**：这些站图片在海外 CDN。两个解法：
用它们的官方 API 时开代理下载到自己的 CDN；
或者用国内替代（下文）。

## 二、国内可用与替代

- **[花瓣网](https://huaban.com)** / **[站酷](https://www.zcool.com.cn)**：
  灵感收集，但**版权状态混杂，别直接商用**；
- **各大图库的「CC0」筛选**：Openverse（`openverse.org`）
  聚合了各站的 CC0（公共领域）素材，可商用无署名；
- **自己拍/自己画**：最稳。本站所有配图都是站长手绘 SVG ——
  零版权风险，还独一无二。

## 三、背景与纹理

- **[Hero Patterns](https://heropatterns.com)**：SVG 背景图案，
  复制即用，可调颜色透明度；
- **[Pattern Monster](https://pattern.monster)**：同类，更多图案；
- **[CSS Gradient](https://cssgradient.io)**：渐变生成 + 代码；
- **[Blobmaker](https://www.blobmaker.app)**：有机色块生成器，
  装饰背景神器。

本站首页背景用的就是这类思路 —— SVG 图案 + 低透明度，轻量且不抢内容。

## 四、插画与 3D

| 站点 | 特点 |
| --- | --- |
| **[unDraw](https://undraw.co)** | 插画可定制主色， MIT 授权 |
| **[Storyset](https://storyset.com)** | 场景化插画，免费 |
| **[IRA Design](https://iradesign.io)** | 手绘风组件插画 |
| **[Humaaans](https://www.humaaans.com)** | 人物插画可拼装 |
| **[Blush](https://blush.design)** | 插画集大成，部分免费 |

**注意趋势**：2026 年了，很多站点从「大插画」转向「简洁排版 +
小图标」—— 插画用过头显得「模板感重」。点缀用，别堆。

## 五、压缩与格式：上传前必做

| 工具 | 用途 |
| --- | --- |
| **[TinyPNG](https://tinypng.com)** | PNG/JPEG 智能压缩，瘦 70% |
| **[Squoosh](https://squoosh.app)** | Google 出品，压缩 + 格式转换 + 对比 |
| **[SVGO](https://github.com/svg/svgo)** | SVG 清垃圾属性，命令行 |
| **[Sharp](https://sharp.pixelplumbing.com)**（Node 库） | 构建流水线里批量处理 |

**格式选择速记**：

```text
照片 → WebP（AVIF 更好但兼容性慢一步）+ JPEG 兜底
图标/简单图形 → SVG
需要透明 → PNG 或 WebP
动图 → 视频（MP4/WebM）代替 GIF，体积差 10 倍
```

## 六、本站的图片规范

直接抄作业：

1. **配图一律 SVG**：矢量、体积小（几 KB）、任何屏幕清晰、
   还能 CSS 控制颜色；
2. **尺寸克制**：文章配图 640px 视口宽，首页图 480px ——
   SVG 不存在此问题，但 raster 图要守；
3. **必写 alt**：无障碍 + 图裂了有交代；
4. **懒加载**：文章配图 `loading="lazy"`（首屏图除外）；
5. **不放人脸/品牌图**：避免「照片侵权」灰色地带，
   信息图表自己画。

## 七、版权自查清单

- [ ] 图片来源是 Unsplash/Pexels/CC0 或自制？
- [ ] 授权允许商用？
- [ ] 不暗示名人/品牌代言？
- [ ] 已压缩、格式合理？
- [ ] 有 alt？

## 小结

图片资源一句话：**Unsplash/Pexels 找照片、unDraw 找插画、
Hero Patterns 找背景、TinyPNG 压缩、SVG 是本站答案**。
版权上「免费下载」≠「免费商用」—— 看许可证，
最稳的自制。记住：**图片是最容易侵权的资产，也是最容易优化的大头**。
