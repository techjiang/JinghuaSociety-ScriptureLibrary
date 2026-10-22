---
title: 终端工具推荐
createTime: 2026-10-22
permalink: /resources/terminal-tools/
description: 终端模拟器、Shell 与增强工具，把黑窗口变成生产力
---

# 终端工具推荐

终端是程序员的「驾驶舱」。默认配置能凑合，但换套工具
能质变。这份按「壳、终端、增强」三层收自用款。

## 一、终端模拟器：装哪个

| 平台 | 推荐 | 特点 |
| --- | --- | --- |
| Windows | **Windows Terminal** | 微软官方，标签/分屏/主题全免费 |
| macOS | **iTerm2**（或 Ghostty） | 老牌劲旅，功能全 |
| 跨平台 | **Warp** | AI 加持，块状输出，现代 |
| 跨平台 | **Alacritty** / **Ghostty** | GPU 渲染，快如闪电 |

**Windows Terminal 必装**（微软商店搜）：PowerShell/
WSL/CMD 多标签、透明度、等宽字体、配色方案。
配合 [WSL 配置](../linux-server-basic.md) 那篇食用。

## 二、Shell：bash 还是 zsh

```text
Linux 默认：bash      （不用换，够用）
macOS 默认：zsh       （苹果钦定）
```

**zsh + Oh My Zsh** 是经典组合：

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

好处：主题好看、插件丰富（git 状态显示、语法高亮、
命令补全）、`..` 直接回上级。

**懒人平替**：[fish](https://fishshell.com) ——
开箱即用（自动补全/高亮/搜索），不用配置。
代价：语法和 bash 不完全兼容（写脚本还是 bash）。

**2026 年新选择**：[nushell](https://www.nushell.io) ——
结构化数据管道（表格操作），理念先进。
学习曲线陡，脚本生态小，尝鲜可以，生产慎入。

## 三、Shell 增强四件套

### starship：跨 Shell 的漂亮提示符

```bash
curl -sS https://starship.rs/install.sh | sh
```

一行配置进 `.bashrc/.zshrc`，提示符显示：git 分支、
Node/Python 版本、命令耗时、上条命令成败。**跨 shell 通用**，
比 Oh My Zsh 的主题更省心。

### zoxide：更聪明的 cd

```bash
z projects        # 直接跳你常去的 projects 目录（不用全路径！）
z foo             # 模糊匹配，敲几个字母就跳
```

替代 `cd`，记住你的习惯路径。学名叫「autojump 的现代版」。

### fzf：模糊搜索一切

```bash
Ctrl+R            # 搜历史命令（交互式，输入几个字母就找到）
vim $(fzf)        # 模糊选文件打开
```

**Ctrl+R 搜历史是「回本最快」的终端技巧** ——
再也不用手动翻 `history`。

### ripgrep：更快的 grep

```bash
rg "TODO"              # 搜内容（比 grep 快数倍，自动跳过 .git/node_modules）
rg -t js "function"    # 只搜 JS 文件
```

[VS Code 的搜索就是它](https://github.com/microsoft/vscode-ripgrep)。
命令行搜代码的首选。

## 四、命令替换：现代版经典命令

| 老命令 | 现代替代 | 好处 |
| --- | --- | --- |
| `ls` | **eza** | 彩色、图标、git 状态 |
| `cat` | **bat** | 语法高亮、行号、git diff 标记 |
| `find` | **fd** | 语法简单、快、智能忽略 |
| `grep` | **ripgrep** | 快、默认跳过噪音目录 |
| `top` | **btop** | 好看好读，CPU/内存/进程一图 |
| `du -h` | **dust** | 可视化磁盘占用 |
| `diff` | **delta** | git diff 语法高亮 |

安装（一条命令全搞定，需要 Rust 工具链或 cargo）：

```bash
# macOS
brew install eza bat fd ripgrep btop dust delta zoxide fzf starship

# Ubuntu（部分在 apt，其余找 release 或用 cargo）
sudo apt install ripgrep fd-find bat fzf
cargo install eza dust btop
```

**别一次全换** —— 先 `bat` + `ripgrep`，用顺了再扩展。
工具是手段不是信仰。

## 五、配置文件管理

Shell 配置（`.bashrc`/`.zshrc`）值得进 git：

```text
~/dotfiles/
├── .zshrc
├── .gitconfig
├── starship.toml
└── install.sh      # 新机器一条命令软链回去
```

本站作者同款思路（本站仓库就是「可复制的配置集合」）。
新电脑恢复环境 = clone + run install，十分钟。

## 六、Windows 特供

- **Scoop**（Windows 的包管理器）：

```powershell
scoop install git nodejs python vscode
```

比满世界找安装包干净，`scoop update *` 一键全更。

- **PowerShell 7**（不是系统自带那个）：跨平台、
  `psql` 风格的对象管道；
- **Git Bash**：轻量，跑 bash 脚本够用；
- **WSL**：真 Linux 环境（前面推过，不重复）。

## 七、别做的

- **别配十八个插件**：zsh 启动两秒，本末倒置；
- **别追新壳**：nushell/xonsh 很酷，但脚本兼容性和
  同事协作是现实问题。团队默认 bash；
- **别迷信「全键盘」**：图形工具（VS Code 的 git 面板）
  该用就用。终端是利器，不是宗教。

## 小结

终端三层：**终端模拟器（Windows Terminal/iTerm2）+
Shell（bash/zsh + starship 提示符）+ 增强（fzf/zoxide/
ripgrep/bat）**。先上「Ctrl+R 搜历史」和 `rg` 两个习惯，
再考虑换工具。命令行是「一次学会，终身回报」的资产 ——
配置进 dotfiles，换机器十分钟恢复。
