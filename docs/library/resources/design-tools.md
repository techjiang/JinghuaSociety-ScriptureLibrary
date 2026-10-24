---
title: 设计工具推荐
createTime: 2026-10-22
permalink: /resources/design-tools/
description: Figma、即时设计、MasterGo 与开发者用得上的设计资源
---

<CategoryTag name="资源" link="/library/resources/" />

程序员懂点设计工具，不是「转行做设计」，是
**少和设计师吵架**：看得懂标注、拿得到色值、
改得了小图。这篇讲 UI 设计工具 + 开发常用的设计资源。

## 一、UI 设计三强

### Figma：行业标准

[figma.com](https://figma.com)

- 浏览器直接跑，跨平台（Win/Mac/Linux 通吃）；
- 实时协作（多人同文件，像 Google Docs）；
- 社区模板/插件生态大；
- 开发者模式（Dev Mode）：标注、间距、色值、CSS 代码
  一键查看 —— **前端拿设计稿的官方姿势**。

**免费档**：个人 3 个文件 + 无限草稿，够用。
**国内访问**：慢（看缘分），大文件卡。

### 即时设计：Figma 的国产平替

[js.design](https://js.design)

- 访问快、中文好、免费档大方；
- 兼容 Figma 文件（能导入 .fig）；
- 资源广场模板多（中文场景）。

**适合**：国内团队、访问 Figma 困难的。
**差距**：插件生态、社区规模不如 Figma。

### MasterGo：另一国产选择

[mastergo.com](https://mastergo.com)

- 定位类似即时设计，企业协作向；
- 性能和资源库也可圈可点。

**国内二选一**：即时设计（个人/小团队）或 MasterGo
（企业向），差距不大，看团队习惯。

## 二、开发者真正会用的功能

### 看标注（每天用）

- Figma/即时设计选中元素 → 右侧面板：
  **字号、行高、字重、颜色、圆角、阴影**全在那；
- 间距用「Alt 悬停」看（两个元素间的 gap）；
- 颜色值直接复制（`#2563EB` → 粘进代码）。

### 拿资源（切图/图标/字体）

- **导出切图**：选中 → Export → SVG/PNG @1x/@2x；
- **图标**：设计稿里的图标让设计师用组件库
  （Iconify/Material）—— 别导出成图片，
  前端用 SVG 组件（[图标资源](../icon-resources.md)）；
- **字体**：设计稿用的字体，前端要么同款（[免费字体](../free-fonts.md)），
  要么提前沟通换成 Web 安全字体。

### 改小东西（不求人）

会基础操作就能自己改：

- 改文案（双击）；
- 调颜色（选中 → Fill）；
- 挪间距（方向键微调，Shift+方向键 10px）；
- 复制图层（Ctrl+C/V）。

**前端自己改稿的前提**：改前跟设计师说一声。
擅自改「设计规范」，协作会崩。

## 三、设计资源网站

| 类型 | 站点 |
| --- | --- |
| 灵感 | [Dribbble](https://dribbble.com)、[Behance](https://www.behance.net)、[Awwwards](https://www.awwwards.com) |
| 国内灵感 | [站酷](https://www.zcool.com.cn)、[花瓣](https://huaban.com) |
| 图标 | [Iconify](https://iconify.design)、[IconPark](https://iconpark.oceanengine.com) |
| 插画 | [unDraw](https://undraw.co)、[Storyset](https://storyset.com) |
| 配色 | [Coolors](https://coolors.co)、[Realtime Colors](https://www.realtimecolors.com) |
| 字体 | [Google Fonts](https://fonts.google.com) |
| 样机 | [MockupWorld](https://www.mockupworld.co)、[ls.graphics](https://www.ls.graphics) |
| 设计规范参考 | [Material Design](https://m3.material.io)、[Apple HIG](https://developer.apple.com/design/)、[Ant Design](https://ant.design) |

（本站[资源区](../useful-sites.md)还有更全的导航。）

## 四、Axure / Sketch / Adobe XD 呢

- **Axure**：交互原型（能点的流程图），产品经理用得多。
  前端看看就好，实现还是代码；
- **Sketch**：Mac 独占的老牌，被 Figma 抢了生态，
  新项目别选；
- **Adobe XD**：Adobe 生态内的，同上，Figma 平替时代
  存在感低。

**2026 年的答案**：新团队 Figma 或国产双雄，
别碰 Sketch/XD（除非公司遗产）。

## 五、给开发者的最小设计素养

不追求会设计，追求「不出丑」：

1. **对齐**：间距用 4/8 的倍数（4、8、16、24、32）——
   设计感的最低门槛；
2. **层次**：字号三档 + 字重两档 + 颜色三级（主/次/弱），
   别全是 14px 黑色；
3. **留白**：内容挤在一起 = 丑。padding 给够；
4. **对比度**：文字和背景差 4.5:1 以上
   （[配色工具](../color-tools.md)有检查器）；
5. **克制**：颜色不超两个主色，字体不超两款。
   「少即是多」在设计界是字面真理。

**本站作者的设计哲学**（从 logo 翻车学到的）：
先抄成熟规范（Tailwind 色板、8px 间距），再谈创造。
「我觉得好看」是设计最大的敌人。

## 小结

设计工具三强：**Figma（标准）、即时设计（国内快）、
MasterGo（企业向）**。开发者的核心动作：看标注、
拿色值、导 SVG、改小地方。剩下的 ——
懂点「对齐/层次/留白/对比/克制」五原则，
比会用 Figma 更重要。
