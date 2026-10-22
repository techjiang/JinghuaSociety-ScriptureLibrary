---
title: 配色工具与方案
createTime: 2026-10-22
permalink: /library/resources/color-tools/
description: 配色生成器、渐变色、对比度检查与一套不会出错的配色方法
---
程序员做界面，最大的审美坎就是配色。随便挑的颜色，
「说不出的丑」。这篇给工具 + 给方法：工具解决「生成」，
方法解决「不会错」。

## 一、配色生成器

| 工具 | 用途 |
| --- | --- |
| **[Coolors](https://coolors.co)** | 五色板生成，空格随机，锁定喜欢的继续生成 |
| **[Adobe Color](https://color.adobe.com)** | 专业级，色轮 + 无障碍检查 |
| **[Realtime Colors](https://www.realtimecolors.com)** | 实时预览配色在真实界面上的效果 |
| **[Happy Hues](https://www.happyhues.co)** | 给出成套配色 + 使用场景示例 |

`Realtime Colors` 最实用：调色板直接渲染成一个示例落地页，
比看色块直观十倍。

## 二、渐变色

- **[cssgradient.io](https://cssgradient.io)**：渐变代码生成；
- **[Mesh Gradients](https://meshgradient.com)**：网状渐变背景，
  导出 PNG/CSS， hero 背景神器；
- **[Grabient](https://www.grabient.com)**：线性渐变，可导出 SVG。

本站 logo 徽章、favicon 用的单色（朱砂红 `#c0392b`），
hero 区干净为主 —— 渐变慎用，用不好就是「模板感」来源。

## 三、对比度与无障碍

颜色不只是好看，**得能看清**。

- **[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)**：
  输入前景/背景色，算对比度比率。**WCAG AA 标准：正文 ≥ 4.5:1，
  大字 ≥ 3:1**；
- **[Who Can Use](https://www.whocanuse.com)**：模拟色盲、低视力、
  强光下看你的配色是什么效果；
- DevTools 的 color picker 自带对比度提示（选中颜色后看）。

**亲测教训**：`#999` 灰字配 `#fff` 背景，对比度 2.8:1，
阅读困难户直接瞎。正文灰别低于 `#666`。

## 四、成熟配色方案（直接抄）

不想自己配，抄现成的：

- **Tailwind 调色板**：`tailwindcss.com/docs/customizing-colors` ——
  工业级的中性色 + 主题色阶梯，做后台的第一选择；
- **Radix Colors**：`radix-ui.com/colors` —— 带无障碍设计的
  12 阶色标，暗色模式友好；
- **Ant Design 色板** / **Element Plus 色板**：国内组件库的
  主色体系，直接取 `#1677ff`（Ant 蓝）这类主色 + 中性灰。

**本站**：朱砂红 `#c0392b`（主色，印章）+ 中性灰阶
（`#111827` 文字 / `#6b7280` 次要 / `#f8fafc` 背景）——
两个色族，暗色模式靠 CSS 变量整体翻转。

## 五、一套不会出错的配色方法

给「完全没审美」的同学（比如当年的我）：

### 60-30-10 法则

```text
60% 主色（通常是背景：白/浅灰）
30% 辅色（卡片、分区：另一个中性色）
10% 强调色（按钮、链接：你的品牌色）
```

**一个界面只留一个强调色**。红按钮配蓝链接配绿徽章，
是「圣诞树审美」的灾难现场。

### 中性色打底，彩色点睛

界面 90% 用黑白灰（`#111827`、`#6b7280`、`#f3f4f6`），
10% 用主色。高级感来自克制，不是来自颜色多。

### 字号也要「配色」

```text
标题：16-20px，600 字重
正文：14-16px，400
辅助：12-13px，灰色
```

对比度不只靠颜色 —— 大小、字重的差异也是层级。
一套三个字号 + 三个字重，界面层次就够了。

## 六、暗色模式配色要点

- 别用纯黑 `#000` 背景配纯白 `#fff` 文字（对比度过爆，刺眼）；
  用 `#0f172a`/`#1e293b` 系深灰蓝 + `#e2e8f0` 浅灰；
- 暗色下**降低饱和度**：亮蓝 `#3b82f6` 在暗底上晃眼，
  换成 `#60a5fa`；
- 用 CSS 变量统一管理，主题切换只换变量值
  （本站就这么干的）。

## 七、取色与配色管理

- **取色**：系统取色器（PowerToys 的 Color Picker）/
  [ColorZilla](https://www.colorzilla.com)（浏览器扩展）——
  看到好看的颜色按一下取走；
- **配色管理**：抄下来的色板存 [Coolors 的库](https://coolors.co)
  或本地一个 `colors.md`。下次项目直接翻，不用从零配。

## 小结

配色三板斧：**60-30-10 配比、中性色打底、一个强调色**。
工具记住三个：Coolors 生成、Realtime Colors 预览、
WebAIM 查对比度。抄方案抄 Tailwind/Radix 色板。
最重要的认知：**高级感来自克制，不是来自颜色多**。
