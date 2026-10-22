---
title: 截图与录屏工具
createTime: 2026-10-22
permalink: /resources/screenshot-tools/
description: 截图标注、长截图、GIF 录屏——写文档做教程的产出工具
---

# 截图与录屏工具

写文档、报 bug、做教程、晒桌面 —— 截图录屏是程序员的高频产出。
系统自带够用，但「标注」「长图」「GIF」需要专门工具。
这份收自用款，按「截图 → 标注 → 录屏」流。

## 一、截图：系统自带先用起来

| 平台 | 快捷键 | 能力 |
| --- | --- | --- |
| Windows | `Win+Shift+S` | 区域截图 + 延迟 + 自动进剪贴板 |
| macOS | `Cmd+Shift+4` | 区域；`Cmd+Shift+5` 带录屏 |
| Linux | `PrtSc` / GNOME 自带 | 区域/全屏 |

**Win+Shift+S 已经很好用**（矩形/窗口/全屏/延迟），
日常截图不用装第三方。短板：**没有标注**。

## 二、标注与增强：Snipaste（封神）

[snipaste.com](https://www.snipaste.com) —— 免费（Microsoft 商店版），
Win/Mac 都有。

**核心三板斧**：

1. **F1 截图**：框选即截，标注工具全（箭头、矩形、
   文字、马赛克、序号）；
2. **F3 贴图**：把截图**钉在屏幕最上层** ——
   对照着抄代码/对设计稿/边看边写，不用切窗口；
3. **取色**：截图时按 C，屏幕上任何颜色拿走。

**「贴图」是被低估的神功能**：写文档时参考资料钉一边、
对 PR 边看边改、抄设计稿间距 —— 双手不离键盘。

**同类**：微信/QQ 截图（带标注，但贴图不如它）、
macOS 的 CleanShot X（付费，更强）。

## 三、长截图：滚着截

场景：截一个长网页/长文档/长代码。

- **浏览器**：DevTools → `Ctrl+Shift+P` → 输入
  `screenshot` → **Capture full size screenshot** ——
  整页高清长图，Chrome/Edge 自带，**网页长图首选**；
- **Snipaste**：滚动截图（部分场景支持）；
- **CleanShot**（Mac）：滚动捕获体验最好；
- **FastStone Capture**（Win 老牌）：滚动截图稳。

## 四、GIF 录屏：演示动作用

| 工具 | 平台 | 特点 |
| --- | --- | --- |
| [ScreenToGif](https://www.screentogif.com) | Win | 免费开源，录完能逐帧编辑、压体积 |
| [LICEcap](https://www.cockos.com/licecap/) | Win/Mac | 极简，一个小窗口 |
| [Kap](https://getkap.co) | Mac | 开源，导出 GIF/MP4/WebM |
| Gifox（Mac 付费）、Recordit | | 各有受众 |

**ScreenToGif 是 Windows 首选**：录 → 删帧 → 加文字 →
导出，一条龙，体积控制好（文档里的 GIF 别超 2MB）。

**2026 年提示**：**能用视频就别用 GIF** ——
同样内容 MP4 只有 GIF 的 1/10 大。GIF 的剩场：
「自动播放的小演示」（邮件/markdown 里方便）。
 Markdown 里嵌视频：`<video src="x.mp4" controls>`。

## 五、录屏（完整视频）：OBS

[obsproject.com](https://obsproject.com) —— 免费开源专业级。

**场景**：录教程、录 bug 复现、直播。
**学习曲线**：半小时（场景/来源/输出设置）。
**轻量替代**：Win+G（Xbox Game Bar，Win 自带快速录屏）、
macOS `Cmd+Shift+5`。

**录教程配置**：1080p + 30fps + 麦克风，
输出 MP4。别追求 4K/60fps —— 文件大，观众设备也带不动。

## 六、图片处理：压缩与格式

截完的图别直接贴文档：

- **[TinyPNG](https://tinypng.com)**：压 PNG/JPEG
  （[图片资源](../image-assets.md) 提过）；
- **SVGO**：导出的 SVG 清垃圾属性；
- **格式选择**：UI 截图用 PNG（文字清晰），
  照片类用 JPEG/WebP。

**文档图片规范**（本站标准）：宽 640-800px、
单张 <200KB、必写 alt、装饰图 SVG。

## 七、报 bug 的截图礼仪

提 issue 附截图时（[本站 Issues](https://github.com/techjiang/JinghuaSociety-ScriptureRepository)）：

1. **截全+截局部**：全图给上下文，局部放大给重点；
2. **标注箭头**：别让看的人自己找；
3. **带上环境信息**：浏览器、版本、系统；
4. **敏感信息打码**：token、手机号、内网 IP ——
   贴出前检查，GitHub issue 是公开的；
5. **报错截 Console**：F12 → Console 的红色报错一起截。

## 小结

截图录屏四件套：**Win+Shift+S（日常截）、
Snipaste（标注+贴图，封神）、ScreenToGif（GIF 演示）、
OBS（正式录屏）**。加上 Chrome 自带的全页长截图，
覆盖九成产出场景。工具半小时学会，
「图配文字说清楚问题」才是真功夫。
