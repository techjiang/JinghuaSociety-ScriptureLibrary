---
title: 前端开发环境搭建
createTime: 2026-10-21
permalink: /tutorial/frontend-env/
description: Node、pnpm、VS Code、终端的一套实用配置，新电脑半小时进入战斗状态
---

# 前端开发环境搭建

每次换了新电脑，或者重装完系统，都要把这套环境重新搭一遍。
次数多了，索性写成清单，照着走一遍，半小时进入战斗状态。
这篇就是那份清单。我的主力是 Windows，macOS 下有差别的地方会注明。

## 一、Node.js：一切的起点

前端工具链十有八九跑在 Node 上。但**别直接装官网的 LTS 安装包**，
用版本管理器，不然项目一多，版本冲突能逼疯你。

Windows / macOS 推荐 [fnm](https://github.com/Schniz/fn-m)（Rust 写的，快）：

```bash
# Windows (winget)
winget install Schniz.fnm

# macOS
brew install fnm
```

装完按提示把 shell 配置那行加上，然后：

```bash
fnm install --lts
fnm use lts-latest
node -v   # 能看到版本号就成了
```

`fnm` 的好处是进到不同项目目录能自动切版本（项目里放一个
`.node-version` 文件写上版本号即可）。老牌选择是 `nvm`，功能一样，
看个人喜好。

## 二、包管理器：pnpm 优先

npm 是 Node 自带的，能用。但我现在默认用 [pnpm](https://pnpm.io)：

```bash
npm install -g pnpm
```

理由很实际：

- **快**，硬链接 + 本地缓存，装依赖比 npm 快一大截；
- **省磁盘**，同一个包多个项目只存一份；
- **严**，默认不允许「幽灵依赖」（代码里 `import` 了没在 package.json
  里声明的东西），能把隐藏的坑提前暴露出来。

日常就四个命令：

```bash
pnpm install          # 装依赖（新项目第一条）
pnpm add 包名         # 加依赖
pnpm remove 包名      # 删依赖
pnpm run dev          # 跑 package.json 里的 scripts
```

团队项目用 `pnpm-lock.yaml`，提交时**必须提交这个锁文件**，
不然同事装出来的依赖树可能跟你不一样，这种「悬案」排查起来最费命。

## 三、VS Code：装哪些插件

编辑器本身没啥可配置的，装对插件能省一半事。我的清单：

| 插件 | 干嘛用的 |
| --- | --- |
| ESLint | 代码规范检查，红波浪线实时提醒 |
| Prettier | 格式化，保存时自动排版，告别风格争论 |
| Vue - Official | 写 Vue 必备（之前叫 Volar） |
| GitLens | 看每行代码是谁啥时候改的，甩锅利器 |
| Error Lens | 报错直接红底显示在代码行上，不用 hover |
| Code Spell Checker | 拼写检查，专治 `recieve`、`seperate` |
| DotENV | `.env` 文件高亮 |

设置里打开这两个，幸福感飙升：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

主题配色随缘，我用的默认 Dark+，护眼就行。字体推荐
`Fira Code` 或 `JetBrains Mono`，带连字，`=>` 显示成箭头，舒服。

## 四、终端：别再直面黑框框

Windows 用户装 [Windows Terminal](https://aka.ms/terminal)（微软商店就有），
把默认终端换成它：标签页、分屏、透明度、好看的配色全都有。

Shell 我用的 PowerShell 7，配置文件在 `$PROFILE`。加点 alias 提效：

```powershell
# 常用命令缩写成首字母
Set-Alias -Name g -Value git
Set-Alias -Name ll -Value Get-ChildItem

# 快速导航
function cdproj { Set-Location D:\projects }

# 看 git 历史一行一条
function glog { git log --oneline --graph -20 }
```

macOS 用户装 [iTerm2](https://iterm2.com) + Oh My Zsh，生态更热闹，
插件主题随便挑。

## 五、浏览器：调试主战场

Chrome 装这几个扩展：

- **Vue.js devtools**：调试 Vue 应用，看组件树、store、路由；
- **React Developer Tools**：同上，React 版；
- **JSON Formatter**：接口返回的 JSON 自动格式化高亮；
- **ModHeader**：改请求头，测缓存、测鉴权很方便。

快捷键 `F12` 开 DevTools，`Ctrl+Shift+C` 直接点选元素查样式。
Console 里能直接写 JS，临时验证想法比建文件快。

## 六、Git：收尾工作

环境搭完接上 Git（详细用法看 [Git 快速上手](./git-quickstart.md)）：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
git config --global init.defaultBranch main   # 新仓库默认分支叫 main
```

再生成一对 SSH key，关联 GitHub，以后推送不用反复输密码：

```bash
ssh-keygen -t ed25519 -C "你的邮箱@example.com"
cat ~/.ssh/id_ed25519.pub   # 把输出粘到 GitHub → Settings → SSH Keys
```

## 七、验收清单

全部装完，逐条验一下：

```bash
node -v      # v22.x.x
pnpm -v      # 9.x.x
git --version
```

VS Code 能打开终端，浏览器 F12 有反应。齐了，去写代码吧。

## 小结

![前端环境四件套](/images/toolchain.svg)

前端环境核心就四样：**fnm 管 Node、pnpm 管包、VS Code 加插件管编辑、
Chrome 管调试**。其他都是锦上添花。建议把这套配置写进自己的 dotfiles 仓库，
下次换机器一条命令全恢复，那感觉，爽。
