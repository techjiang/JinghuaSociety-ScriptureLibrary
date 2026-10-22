---
title: GitHub 协作实操：Fork、Clone 与 Pull Request
createTime: 2026-10-22
permalink: /library/tutorial/git-github-pr/
description: 从 fork 到 PR 合并的完整流程，附本站投稿的真实操作步骤
---

# GitHub 协作实操：Fork、Clone 与 Pull Request

[Git 快速上手](./git-quickstart.md) 讲的是本地操作，这篇讲「怎么在 GitHub 上
跟别人协作」。学会了就能给开源项目提 PR —— 也包括给本站投稿。

流程本身半小时能走完，但第一次走容易晕。跟着做一遍就熟了。

## 一、先搞清楚三个仓库的关系

```text
上游仓库（原作者）  ──fork──►  你的远程仓库（GitHub 上你的账号下）
                                     │clone
                                     ▼
                              本地仓库（你的电脑）
```

- **Fork**：把别人的仓库复制一份到你 GitHub 账号下。你有完全权限；
- **Clone**：把你 GitHub 上的仓库下载到本地；
- **Pull Request**：你改完了，请求原作者「把我的改动合并回去」。

## 二、完整流程（十步）

以给本站投稿为例（仓库：`techjiang/JinghuaSociety-ScriptureLibrary`）。

### 1. Fork

打开仓库页面，右上角 **Fork** 按钮 → Create fork。
几秒后，你的账号下就有了一份：`你的用户名/JinghuaSociety-ScriptureLibrary`。

### 2. Clone 到本地

```bash
git clone https://github.com/你的用户名/JinghuaSociety-ScriptureLibrary.git
cd JinghuaSociety-ScriptureLibrary
```

### 3. 添加上游仓库（关键一步，很多人忘）

```bash
git remote add upstream https://github.com/techjiang/JinghuaSociety-ScriptureLibrary.git
git remote -v   # 确认：origin 是你的，upstream 是原作者的
```

**为什么要加**：原仓库更新后，你要能拉到最新代码，不然你的 PR 基于旧版本，
合并时可能冲突。`origin`（你的）和 `upstream`（上游）分工明确。

### 4. 建分支

```bash
git checkout -b add-article-xxx
```

分支名说清干什么：`add-article-xxx`、`fix-typo-yyy`。
**别在 main 上直接改** —— main 保持干净，随时能拉取更新。

### 5. 写内容

在 `docs/library/tech/` 下新建 `你的文章.md`，
frontmatter 模板见[加入页面](../../../join.md)。

### 6. 提交

```bash
git add docs/library/tech/你的文章.md
git commit -m "add: 新文章《你的文章标题》"
```

commit 信息规范：`add:` 新增、`fix:` 修复、`docs:` 文档。
一眼能看懂改了什么。

### 7. 推送你的远程

```bash
git push -u origin add-article-xxx
```

### 8. 提 Pull Request

GitHub 页面会弹出提示「Compare & pull request」，点它。
或者仓库页面 **Pull requests → New pull request → compare across forks**。

PR 三要素：

- **标题**：说清做了什么（`新增文章：XXX`）；
- **描述**：写了什么、给谁看、怎么验证的；
- **Base 仓库选对**：`techjiang/...` 的 main ← 你的分支。
  （默认是你的仓库，**一定要改成上游仓库**，不然 PR 提到了你自己家）

### 9. 等 Review

作者可能提修改意见。在 PR 页面讨论，
或者直接在你分支上继续 commit 推送（PR 会自动更新）。

### 10. 合并后清理

PR 被合并后：

```bash
git checkout main
git pull upstream main    # 拉取含你改动的最新代码
git branch -d add-article-xxx   # 删本地分支
git push origin --delete add-article-xxx  # 删远程分支（可选）
```

你的文章上线了。去 [Actions 页面](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/actions)
看自动部署，几分钟后线上就能看到。

## 三、同步上游更新（日常）

```bash
git fetch upstream          # 拉上游最新
git checkout main
git merge upstream/main     # 更新本地 main
git push origin main        # 同步到你的远程
```

下次提 PR 前都做一遍，减少冲突。

## 四、常见问题

**PR 里出现一堆无关文件？**
检查是不是把 `node_modules`、`.temp` 提交了。
`.gitignore` 应该挡住 —— 如果没挡，删掉它们再提交。

**冲突了怎么办？**
GitHub PR 页面会提示 conflict。本地操作：

```bash
git fetch upstream
git rebase upstream/main   # 或 merge，看项目习惯
# 解决冲突：编辑文件，删掉 <<<< === >>>> 标记
git add 冲突文件
git rebase --continue
git push --force-with-lease  # rebase 改写了历史，需要强推（自己的分支，安全）
```

**PR 没人理？**
正常。开源作者可能忙/在度假。等三天没回复，
礼貌地评论一下提醒（@ 一下），别刷屏。

## 五、给小白的捷径

不会命令行？GitHub 网页端全搞定：

1. Fork；
2. 在你仓库页面按 `.` 键 —— **网页版 VS Code** 直接编辑；
3. 左侧 Source Control 面板 → 写提交信息 → Commit；
4. 页面提 PR。

全程不碰命令行。熟练后再迁移到本地，更稳。

## 小结

GitHub 协作 = **Fork → Clone → 加 upstream → 建分支 → 改 → 提交 → 推送 → PR → 同步 → 清理**。
第一次跟着这篇走一遍，以后就是肌肉记忆。
想练手？去本站仓库提个「改正错别字」的 PR —— 
最简单的第一次，也是最受欢迎的第一步。
