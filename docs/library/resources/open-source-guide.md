---
title: 如何参与开源：从第一次 PR 开始
createTime: 2026-10-22
permalink: /resources/open-source-guide/
description: 找项目、提 issue、发 PR 的完整路径——给第一次参与者的行动指南
---

# 如何参与开源：从第一次 PR 开始

「想参与开源但不知道从哪开始」是最常见的困惑。
这篇把路径铺平：找什么项目、怎么迈第一步、
PR 之后发生什么。**目标：这周内完成第一次贡献。**

## 一、先破除三个误解

**「我太菜，不配」** —— 开源需要写文档的、修 typo 的、
答 issue 的、设计的。**不是只有核心代码一种贡献。**

**「要先读完源码」** —— 不用。从文档错误、
翻译、小 bug 开始，边改边读。

**「贡献必须很牛」** —— 修一个错别字、补一个示例，
只要合并了，git 历史里就**永久留着你的名字**。

## 二、找项目：三个渠道

### 1. 你正在用的

**最佳起点**：你天天用的库/工具。
你最懂它的「不舒服」在哪 —— 那就是贡献点。

```text
发现文档过时 → 提 PR 修
遇到 bug → 提 issue + PR
想要的功能 → 先提 issue 讨论
```

### 2. 新手友好标签

GitHub 搜：

```text
label:good-first-issue        # 新手友好
label:help-wanted             # 求帮助
label:documentation           # 文档向
is:issue is:open
```

专门的导航站：

- [goodfirstissues.com](https://goodfirstissues.com) ——
  按语言筛好；
- [up-for-grabs.net](https://up-for-grabs.net)；
- [firstcontributions](https://github.com/firstcontributions/firstcontributions) ——
  **专门给第一次的人练手**（5 分钟完成一次 PR）。

### 3. 中文友好项目

参与英文项目有心理压力？这些中文为主：

- [Vue 生态](https://github.com/vuejs)（vuejs/vue、core、docs 有中文）；
- [Plume 主题](https://github.com/pengzhanbo/vuepress-theme-plume)（本站同款，中文沟通）；
- 各类 awesome-zh 系列（翻译/整理向）；
- 阮一峰老师的各种[科普项目](https://github.com/ruanyf)。

## 三、迈第一步：从最小的事开始

按「难度阶梯」来，别一上来挑战核心：

```text
① 修文档 typo / 更新过时说明        ← 从这里开始
② 补一个示例 / 翻译一段文档
③ 修一个标记了 good-first-issue 的 bug
④ 加一个小功能（先 issue 讨论）
⑤ 修复杂 bug / 优化性能（成了，你就是 contributor）
```

**第一次 PR 推荐**：给 [firstcontributions](https://github.com/firstcontributions/firstcontributions)
提一个（把你的名字加进 Contributors.md）——
走完整个流程，零压力。

## 四、PR 全流程（技术向）

```text
① Fork 仓库
② Clone 到本地
③ git remote add upstream 原仓库
④ git checkout -b fix-xxx
⑤ 改代码/文档
⑥ git commit（信息规范：fix: 修正 XX 的 YY）
⑦ git push origin fix-xxx
⑧ GitHub 上提 PR（base 选上游仓库！）
⑨ 等 review，按意见改
⑩ 合并！🎉
```

详细每一步（含常见坑）在
[GitHub 协作实操](../git-github-pr.md) —— 那篇是操作手册，
这篇是心态和路径。

## 五、PR 被拒/没人理：正常

开源是「用爱发电」，维护者可能：

- **很忙**：等三天没回复正常，礼貌 ping 一次；
- **方向不认可**：你提的功能人家不想要 ——
  不是否定你，是项目定位不同；
- **要求改**：按意见改，这是学习机会
  （大佬的 code review 比培训值钱）；
- **关了 PR**：常见。记住：**你的 commit 还在你
  fork 的仓库里，经验在你脑子里**。

**心态**：每个拒绝都是一次「免费的方向指导」。

## 六、除了代码，这些也是贡献

| 贡献 | 怎么做 |
| --- | --- |
| 报 bug | 清晰的 issue：复现步骤 + 环境 + 预期 vs 实际 |
| 答 issue | 在 discussions/issues 里帮后来者 |
| 写文档 | README、wiki、示例 |
| 翻译 | 中文项目英文化 / 英文项目中文化 |
| 设计 | logo、官网、文档排版（设计师的入口） |
| 测试 | 帮忙复现 bug、测新版本 |
| 宣传 | 写使用心得、做视频、大会分享 |
| **赞助** | [GitHub Sponsors](https://github.com/sponsors)、Open Collective |

**「答 issue」是被低估的金矿** —— 为了答别人的问题
去查文档/读源码，成长最快，还攒社区声望。

## 七、从消费者到共建者

参与开源的心态转变：

```text
消费者：「这个库有 bug，什么破玩意」
使用者 ：「这个库有 bug，我提个 issue」
共建者 ：「这个库有 bug，我看看能不能修」
```

**最后一步是「所有权」**：你用的工具，你也可以让它更好。
这个转变，比任何技术成长都标志成熟。

## 八、本周行动清单

```text
□ 注册/完善 GitHub 账号（头像、简介、几个 pin 仓库）
□ 给 firstcontributions 提第一个 PR
□ 在你常用的库里找一个 good-first-issue 或文档改进
□ Star 三个你在用但没 star 的项目（对作者是鼓励）
□ 关注一个项目的 release 动态
```

**今天就开始。** 第一次 PR 的紧张和合并后的喜悦，
是程序员生涯的固定节目 —— 别错过。

## 小结

参与开源五步：**破除心魔 → 从你在用的项目开始 →
最小贡献（typo/文档）→ 走标准 PR 流程 →
接受拒绝继续走**。贡献不止代码：issue、文档、
答疑、宣传都算。本站仓库
（[techjiang/JinghuaSociety-ScriptureRepository](https://github.com/techjiang/JinghuaSociety-ScriptureRepository)）
就是一个「小到能读完」的练习场 —— 
想练手？从给本站投稿开始（见[加入页面](../join/)）。
