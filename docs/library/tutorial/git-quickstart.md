---
title: Git 快速上手
createTime: 2026-10-21
permalink: /library/tutorial/git-quickstart/
description: 从安装到推送远程仓库，半小时过一遍 Git 常用操作，附站长踩过的坑
---

<CategoryTag name="教程" link="/library/tutorial/" />
Git 这东西，学会基本操作只要半小时，但很多人（包括当年的我）是「直接用」
的 —— `git add`、`git commit`、`git push` 三板斧走天下，出了事故现场
（误提交、误删除、冲突不敢解）才开始翻文档。这篇就是把你可能现场翻文档的
东西先写出来。

> 测试环境：Git 2.45，Windows 11 / macOS 15 / Ubuntu 24.04 都验证过。

## 一、安装

```bash
git --version
```

能出版本号就不用装。没有的话：

- **Windows**：去 [git-scm.com](https://git-scm.com) 下安装包，一路下一步，
  装完右键菜单会多出 Git Bash Here；
- **macOS**：`brew install git`，或者装 Xcode 命令行工具会自动带；
- **Ubuntu/Debian**：`sudo apt install git`。

装完先告诉 Git 你是谁，不然后面提交会报错：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

`--global` 是全局配置，对这台机器上所有仓库生效。如果想给某个公司仓库
用公司邮箱，进那个仓库去掉 `--global` 单独配即可。

## 二、三个区域：工作区、暂存区、仓库

理解 Git 的关键是搞清楚文件在三个区域之间怎么流动：

```text
工作区 ──git add──► 暂存区 ──git commit──► 本地仓库 ──git push──► 远程仓库
（你看到的文件）   （待提交清单）    （提交历史）
```

- **工作区**：就是你文件夹里看到的文件，随便改，改崩了能退；
- **暂存区**：一个「待提交清单」，你可以挑挑拣拣只提交某些改动；
- **本地仓库**：提交历史都存这儿，`.git` 目录就是它；
- **远程仓库**：GitHub / Gitee 上的那份，用来备份和协作。

![Git 三个区域的流转关系](/images/git-areas.svg)

*图：文件在四个区域之间的流动，三条命令各管一段*

新手常犯的错是把三个区域混为一谈，以为 `git add` 就是「保存」。不是，
`add` 只是「放进待提交清单」。

## 三、日常三板斧

新项目第一次用：

```bash
cd 你的项目目录
git init
```

`git init` 会建一个 `.git` 目录，这个文件夹从此就成了 Git 仓库。
之后日常就这三条：

```bash
git status          # 看看现在什么情况（改了啥，暂存了啥）
git add 文件名      # 把改动放进暂存区，git add . 是全部
git commit -m "说清楚这次改了什么"
```

`git status` 建议打成肌肉记忆 —— 提交前看一眼，能避免 90% 的误操作。
`commit -m` 的 message 也别老写「update」，三天后你自己都看不懂。

## 四、.gitignore：别什么都要

有些东西不该进仓库：依赖目录（`node_modules`）、构建产物、系统垃圾文件、
含密码的配置文件。在仓库根目录建个 `.gitignore`：

```gitignore
# 依赖
node_modules/

# 构建产物
dist/
build/

# 系统文件
.DS_Store
Thumbs.db

# 环境配置（可能含密钥）
.env
.env.local

# 编辑器
.vscode/
.idea/
```

注意 `.gitignore` 只对**还没被跟踪**的文件生效。如果 `node_modules`
已经不小心提交过了，先从仓库移除再忽略：

```bash
git rm -r --cached node_modules
echo "node_modules/" >> .gitignore
git commit -m "停止跟踪 node_modules"
```

## 五、分支：并行干活的副本

默认分支现在叫 `main`（老仓库可能是 `master`，一回事）。

```bash
git branch 新功能      # 建分支
git checkout 新功能    # 切过去
git checkout -b 新功能 # 上面两步合起来，更常用
```

分支的意义：主线随时是好的，新想法在新分支上折腾，搞成了合回来，
搞砸了删掉不心疼。别在大项目里直接往 `main` 上怼代码。

合并分支：

```bash
git checkout main     # 先回到主分支
git merge 新功能      # 把新分支的提交合进来
```

## 六、连上远程仓库（GitHub）

GitHub 上新建一个空仓库，然后：

```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

- `git remote add origin 地址`：给远程仓库起个名叫 `origin`（约定俗成）；
- `git push -u origin main`：推送并建立追踪关系，以后直接 `git push` 就行。

以后日常同步：

```bash
git pull   # 拉取远程更新（等于 fetch + merge）
git push   # 推送本地提交
```

HTTPS 地址每次推送都要输密码，嫌烦可以用 SSH（`git@github.com:用户名/仓库名.git`），
配一次密钥长期有效。教程很多，不展开。

## 七、出事了怎么退

### 改乱了还没提交

```bash
git checkout -- 文件名    # 丢弃这个文件的改动，回到上次提交的样子
git restore 文件名        # 同上，新版本 Git 的写法
```

### 提交完了发现错了

```bash
git commit --amend       # 修改最近一次提交（补文件、改message）
```

### 想退回某个历史版本

```bash
git log --oneline        # 先看历史，每条提交一个短哈希
git reset --soft 哈希    # 退回提交，改动留在暂存区（温柔）
git reset --hard 哈希    # 退回提交，改动全没（凶残，用前想清楚）
```

`--hard` 我当年用错过一次，半天的工作灰飞烟灭，从此 `reset` 前必先
`git log`，`--hard` 前必先确认。

### 冲突了

两个人改了同一文件的同一行，合并时会冲突。Git 会在文件里标出来：

```text
<<<<<<< HEAD
你的版本
=======
对方的版本
>>>>>>> 新功能
```

怎么办：打开文件，跟对方（或者跟自己的理智）商量，留下该留的，
把 `<<<<<<<`、`=======`、`>>>>>>>` 这些标记删掉，然后：

```bash
git add 那个文件
git commit
```

冲突不是什么高深东西，就是 Git 拿不准听谁的，让你人工裁决。

## 八、几个实用小命令

```bash
git log --oneline --graph    # 一行一提交，带分支图，看历史神器
git diff                     # 看工作区改了啥（还没 add 的）
git diff --staged            # 看暂存区改了啥
git stash                    # 手头改动先收起来，比如要切分支救火
git stash pop                # 再拿出来
```

`git stash` 属于「用了就回不去」系列 —— 改到一半来了个紧急 bug，
`stash` 一下切过去修完再 `pop`，不用为了切分支先胡乱提交。

## 小结

Git 日常就这些：`status` 看情况，`add` 挑改动，`commit` 存档，
`branch`/`merge` 走分支，`push`/`pull` 同步远程。出事先 `log` 再动手，
`--hard` 类命令慢三秒。够了，剩下的等真遇到再说。
