---
title: 在线 IDE 与代码沙盒
createTime: 2026-10-22
permalink: /resources/online-ides/
description: CodePen、StackBlitz、CodeSandbox 等——不装环境就能跑代码
---

# 在线 IDE 与代码沙盒

想快速试段代码、分享 demo、面试手撕、看别人的实现 ——
在线 IDE 不用装环境，打开浏览器就写。这份按场景收。

## 一、前端demo三巨头

### CodePen：前端界的 Instagram

[codepen.io](https://codepen.io) —— HTML/CSS/JS 快速 demo。

**适合**：小效果Demo（动画、UI 组件）、找灵感。
**优点**：社区大（ trending 天天有新东西）、
嵌入博客方便（本站想嵌 demo 可以用）。
**缺点**：不能跑构建工具链（React/Vue 要用它的模板）、
项目级能力弱。

### StackBlitz：浏览器里的完整工程

[stackblitz.com](https://stackblitz.com) —— **WebContainers 技术**：
Node 在浏览器里真跑（不是远程服务器）！

**适合**：跑真实项目（Vite/Next/Nest 模板）、
分享「可编辑的教程代码」。
**优点**：npm install 几秒完（本地执行）、
离线可用、能连接 GitHub 编辑 PR（github.dev 的底层之一）。
**缺点**：重项目（node_modules 巨大）会吃力。

**杀手锏场景**：把 StackBlitz 链接发给别人 ——
对方点开就是一个**能跑的完整项目**，不用 clone。
写教程/文档时的神器。

### CodeSandbox：老牌云端开发

[codesandbox.io](https://codesandbox.io) —— 功能全
（容器化开发环境、团队协作、GitHub 集成）。

**适合**：团队协作 demo、教学环境、PR 预览。
**优点**：生态成熟、模板多、可嵌入。
**缺点**：免费档资源受限、启动慢（容器冷启动）。

## 二、算法刷题向

- **[LeetCode Playground](https://leetcode.cn/playground)**：
  刷题自带，支持多语言，不用装环境；
- **[JSFiddle](https://jsfiddle.net)**：老牌轻量，
  前端片段调试经典；
- **[Repl.it](https://replit.com)**：全语言，
  教育向（教室功能强）；
- **[Godbolt](https://godbolt.org)**（Compiler Explorer）：
  **看汇编**神器 —— C/C++/Rust 代码实时编译成汇编对照，
  学底层/性能优化必备。

## 三、数据科学向

- **[Kaggle Notebooks](https://www.kaggle.com/code)**：
  免费 GPU！跑 Python/数据科学/ML；
- **[Google Colab](https://colab.research.google.com)**：
  Jupyter 在线版，GPU 免费额度；
- **[Observable](https://observablehq.com)**：
  JavaScript 数据可视化笔记本。

## 四、GitHub 自带的

**github.dev**：任何 GitHub 仓库按 `.` 键进入 ——
浏览器版 VS Code，**只读**（不能提交）。

**GitHub Codespaces**：完整云端开发环境
（能跑、能提交、能调试），**付费**（个人每月 60 小时免费额）。

**场景**：改个小 typo/看代码 → github.dev；
要认真开发 → Codespaces（有额度的话）。

## 五、选型表

| 需求 | 用啥 |
| --- | --- |
| 快速前端小 demo | CodePen / JSFiddle |
| 跑真实前端项目 | StackBlitz |
| 分享可编辑教程 | StackBlitz（链接即项目） |
| 算法手撕/刷题 | LeetCode Playground |
| 看底层/汇编 | Godbolt |
| 数据/Python/ML | Kaggle / Colab |
| 临时改 GitHub 仓库 | github.dev（按 .） |
| 云端正式开发 | Codespaces（付费） |

## 六、使用场景建议

**写教程/文档的人**：StackBlitz 链接嵌入。
读者点开能跑能改，比「复制代码到本地」体验高一个量级 ——
本站的[搭站教程](../build-blog-with-plume.md)类文章其实可以这么做
（回头补）。

**面试手撕前练手**：LeetCode Playground 熟悉「无提示环境」。
本地 IDE 太舒适，考场白板/共享文档会让你手生。

**临时验证想法**：CodePen。想试个 CSS 效果/动画，
三十秒出结果，不用建项目。

**注意**：**别把公司代码贴到公共沙盒**（泄露事故年年有）。
敏感代码用本地或私有 Codespaces。

## 小结

在线 IDE 三梯队：**CodePen（片段社交）、StackBlitz
（真工程）、Codespaces（云端开发）**。个人最值钱的两个场景：
分享「可跑的教程代码」（StackBlitz）和「无环境手撕练习」
（Playground）。收藏三个链接，够用十年。
