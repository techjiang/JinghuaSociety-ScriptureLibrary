---
title: GitHub 使用技巧
createTime: 2026-10-22
permalink: /resources/github-tips/
description: 快捷键、搜索语法、Actions、gh CLI——把 GitHub 用成生产力
---

<CategoryTag name="资源" link="/library/resources/" />

# GitHub 使用技巧

天天上 GitHub，90% 的人只用 10% 的功能。
这篇收「用了回不去」的技巧：快捷键、搜索语法、
命令行工具、Actions。

## 一、键盘快捷键（全站通用）

在任意 GitHub 页面按 `?` 看全部。常用的：

```text
s        聚焦搜索框
/         同样聚焦搜索
g + h    回首页（g 是前缀，按完 g 再按 h）
g + i    去 Issues
g + p    去 Pull Requests
g + b    去 Projects
t        文件树内快速找文件（仓库页）
l        跳转到某行（Issue 评论区）
```

**`t` 是仓库里找文件的快捷键** —— 比鼠标点树快十倍。
**`?` 先按一遍**，忘了再按。

## 二、`.` 打开网页版 VS Code

任何仓库页面按 `.` → **github.dev**：浏览器里的 VS Code，
编辑/搜索/多文件。只读（不能直接提交），但：

- 读代码比网页版强百倍（跳转、搜索、多光标）；
- 编辑后能「Commit 到新分支」→ 直接提 PR ——
  [投稿流程](../git-github-pr.md)的懒人方案。

## 三、搜索语法：GitHub 搜索是门语言

搜索框里支持限定符：

```text
repo:techjiang/JinghuaSociety-ScriptureLibrary 加密   # 在某仓库搜
language:typescript useState                        # 按语言
path:docs/.vuepress                                 # 按路径
extension:md                                        # 按扩展名
filename:config.ts                                  # 按文件名
is:issue is:open label:bug                          # 状态+标签
author:techjiang created:>2026-01-01                # 作者+时间
```

**组合示例**：

```text
# 找 VuePress 相关的、今年还有人维护的、star 过千的库
vuepress language:javascript pushed:>2026-08-01 stars:>1000
```

**代码搜索**（github.com/search？type=code，需登录）：
搜「某个函数怎么用的」—— 看真实项目里的用法，
比文档更直观。

## 四、Issue 与 PR 的高效操作

**Issue**：

- 支持 Markdown + 任务列表（`- [ ]` 可勾选）；
- `#123` 引用别的 issue、`Closes #123` 关联 PR 合并时自动关；
- **Saved replies**（设置里配）：常见回复模板一键插入
  （「感谢反馈，请提供复现步骤…」）。

**PR**：

- **Draft PR**：没写完先开草稿，CI 先跑着；
- `Files changed` 按 `Ctrl+K`？不，按行内评论（拖选代码行左侧 `+`）；
- **Review 建议块**：

````markdown
```suggestion
把这行替换成这个
```
````

作者一键 Apply suggestion —— **Code Review 神器**，
比文字描述「建议改成 X」高效十倍。

## 五、gh CLI：命令行搞定一切

```bash
brew install gh        # 或 apt/scoop
gh auth login          # 浏览器授权一次

gh repo clone techjiang/JinghuaSociety-ScriptureLibrary
gh pr create --fill                    # 基于当前分支创建 PR
gh pr list                             # 看 PR
gh pr checks                           # 看 CI 状态
gh issue create --title "标题" --body "内容"
gh run view --log                      # 看 Actions 日志
```

**场景**：CI 挂了 → `gh run view --log` 看日志，
不用开网页；提 PR → `gh pr create` 不切窗口。
**终端党必备。**

## 六、Actions：从网页到自动化

本站的自动部署就是 Actions 跑的（[配置源码](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/blob/main/.github/workflows/deploy.yml)）。

常用触发：

```yaml
on:
  push:                          # push 触发（本站部署）
    branches: [main]
  pull_request:                  # PR 触发（跑测试/lint）
  schedule:                      # 定时（cron）
    - cron: '0 0 * * 0'          # 每周日
  workflow_dispatch:             # 手动触发
```

看 run 状态：仓库页 Actions 标签，或 `gh run list`。
**PR 的 Checks 不过不能合并**（分支保护规则里配）——
团队项目的质量门禁。

## 七、保护主干的四条规则

仓库 Settings → Branches → Add rule（`main`）：

```text
☑ Require a pull request before merging      # 必须走 PR
☑ Require approvals（至少 1 人）              # 必须有人 review
☑ Require status checks to pass              # CI 必须过
☑ Do not allow bypassing                     # 管理员也不能绕
```

这四条是**团队代码质量的底线**。没有保护的主干，
迟早有人 `git push --force` 上来一锅端。

## 八、个人页与社交功能

- **Profile README**：建一个「用户名/用户名」仓库，
  里面的 README 显示在你主页 —— 程序员的门面；
- **Star 列表**：`github.com/用户名?tab=stars`，
  按 list 分类（「前端工具」「待读」）；
- **Follow + Watch**：Follow 看动态，
  Watch（Releases only）收版本通知；
- **Sponsor**：给依赖的开源项目打钱（很多项目靠这个活）。

## 九、隐私与安全

- **别提交密钥**：push 上去几分钟内 GitHub 会发警告邮件
  （有自动扫描）。真泄漏了直接吊销，别删 commit 自欺欺人；
- **私人仓库**：免费档无限私有仓库，敏感项目放心用；
- **CODEOWNERS**：`.github/CODEOWNERS` 指定文件归属，
  PR 自动 @ 对应负责人；
- **Dependabot**：自动开 PR 更新依赖 + 报漏洞
  （Settings → Code security 开）。

## 小结

GitHub 三板斧：**快捷键（`?` `t` `.`）、搜索语法
（repo:/language:/stars:）、gh CLI（不切窗口）**。
团队再加「PR + 分支保护 + Checks」三件套。
GitHub 不只是代码仓库 —— 是程序员的
**履历、社交网络和 DevOps 平台**。用好它。
