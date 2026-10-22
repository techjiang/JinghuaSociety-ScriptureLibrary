---
title: 剪贴板与效率小工具
createTime: 2026-10-22
permalink: /resources/clipboard-tools/
description: 剪贴板历史、快捷启动、窗口管理——桌面效率的「隐形冠军」
---

# 剪贴板与效率小工具

有一类工具「装上没感觉，卸了才发现离不开」：
剪贴板历史、快捷启动、窗口管理。它们不解决大问题，
但每天省你几十次切窗口。这篇收这类「隐形冠军」。

## 一、剪贴板历史：找回来的能力

系统剪贴板只能存一条 —— 复制了 B，A 没了。
**剪贴板历史让 A、B、C 都在，随时召回。**

### Windows

- **Windows 官方就有**：`Win+V` 打开历史记录
  （设置里开启）。固定常用项（图钉）—— 地址、
  邮箱、验证码，钉住随取；
- **Ditto**：开源老牌，搜索 + 分组 + 永久保存，
  功能比官方强。

### macOS

- **Maccy**（开源免费，App Store 有）：轻量、
  快捷键唤起、搜索；
- **Paste**（付费）：颜值 + 团队协作（iOS 同步）。

### 跨平台

- **CopyQ**：开源全平台，脚本能力强
  （能对剪贴板内容做处理）。

**最高频场景**：复制三样东西分别粘贴到三个地方 ——
不用来回切窗口，`Win+V` 连按三下。

## 二、快捷启动：少点鼠标

### Windows

- **PowerToys Run**（微软官方，免费）：`Alt+空格`
  唤起，搜应用/文件/算数/执行命令。**装 PowerToys 的
  第一理由**；
- **uTools**（国产）：插件生态丰富
  （翻译、OCR、JSON、颜色……），`Alt+空格` 呼出，
  个人免费。

### macOS

- **Raycast**：启动器天花板，扩展商店 + AI，
  免费档够用。Alfred 的老用户可以迁了；
- **Alfred**：老牌，Powerpack 付费， workflows 强。

### Linux

- **Ulauncher** / **Albert**：轻量选择。

**Raycast/uTools 的隐藏价值**：它们不只是启动器 ——
是「命令面板化的操作系统」：查词、算数、JSON 格式化、
颜色取色、快捷发邮件…… 全在键盘流里完成。

## 三、窗口管理：快速分屏

### Windows

- **PowerToys FancyZones**：自定义分屏布局，
  `Win+方向键`  Snap。多显示器神器；
- 系统自带：`Win+←/→` 半屏，`Win+↑/↓` 最大化/还原。

### macOS

- **Rectangle**（开源免费）：快捷键分屏
  （`Ctrl+Opt+←` 等），轻量没废话；
- **Magnet**（付费）：同样功能，App Store 省心。

**程序员场景**：左半屏 VS Code、右半屏浏览器、
下面终端 —— FancyZones/Rectangle 一键布局，
比拖窗口快十倍。

## 四、其他小而美

### 取色与屏幕

- **PowerToys Color Picker**（Win）：`Win+Shift+C` 取色；
- **Just Color Picker**（Win 老牌）；
- macOS 自带「数码取色器」（实用工具里）。

### 文本处理

- **Espanso**：跨平台文本替换 ——
  输入 `:mail` 自动展开成邮箱地址。配置是 YAML，
  程序员友好；
- **AutoHotkey**（Win）：Windows 自动化之王，
  学习曲线陡但能力无限（改键、脚本、GUI）。

### 专注与提醒

- **Stretchly / 护眼宝**：定时提醒休息
  （20-20-20 法则的执行者）；
- **Cold Turkey / Freedom**：屏蔽分心网站
  （写代码时屏蔽微博，狠人专用）。

## 五、本站的效率栈

公开站长的桌面配置（Windows + WSL）：

```text
启动：PowerToys Run（Alt+空格）
剪贴板：Win+V（系统）+ Ditto 增强
分屏：PowerToys FancyZones（双屏布局）
取色：PowerToys Color Picker
终端：Windows Terminal + WSL + starship
编辑器：VS Code + 一页[插件清单](../vscode-extensions.md)
```

原则：**官方能做的用官方（PowerToys），
生态强的用社区（uTools/Raycast），一个位置只放一个工具。**

## 六、别「效率成瘾」

最后泼冷水：**效率工具是糖，吃多上瘾。**

- 装二十个「神器」的结果：每个用两次，启动慢一倍；
- 研究配置三小时，干活五分钟 —— 本末倒置；
- 真正提效的：**熟手的快捷键 + 专注的时段 + 少开会**，
  不是新工具。

**建议**：每月 review 一次桌面工具，两个月没主动
打开的，卸。工具是仆人，别养一堆大爷。

## 小结

效率三件套：**剪贴板历史（Win+V/Maccy）、
启动器（PowerToys Run/uTools/Raycast）、分屏
（FancyZones/Rectangle）**。加上 PowerToys 全家桶
（取色/置顶/批量改名），桌面效率翻倍。
但记住最后一条：**它们是放大器，放大你的习惯 ——
习惯烂，工具越多死得越快。**
