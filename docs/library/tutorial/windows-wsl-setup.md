---
title: Windows 开发环境：WSL 实战配置
createTime: 2026-10-22
permalink: /library/tutorial/windows-wsl/
description: WSL2 安装、Node 环境、文件互访与 VS Code 联动，Windows 前端开发正解
---

<CategoryTag name="教程" link="/library/tutorial/" />

Windows 写前端，老问题一堆：路径分隔符、换行符、
`node-gyp` 编译失败、shell 脚本跑不了……**正解是 WSL**
（Windows Subsystem for Linux）：在 Windows 里跑真 Linux，
开发体验追平 Mac，还不丢 Windows 的游戏和办公。

## 一、装 WSL2（现在是一条命令）

```powershell
# PowerShell（管理员）
wsl --install
```

自动装齐：WSL2 + 默认 Ubuntu。重启，设置用户名密码，完事。

```powershell
wsl --list --verbose        # 看装的发行版和 WSL 版本
wsl --set-default-version 2 # 默认 WSL2（如果默认是 1）
```

已有 WSL1？升级：`wsl --set-version Ubuntu 2`。

**放哪**：WSL 默认装 C 盘。想挪 D 盘：

```powershell
wsl --export Ubuntu D:\backup\ubuntu.tar
wsl --unregister Ubuntu
wsl --import Ubuntu D:\WSL\Ubuntu D:\backup\ubuntu.tar
```

## 二、基础环境（进 Ubuntu 终端）

```bash
# 更新
sudo apt update && sudo apt upgrade -y

# 开发常用
sudo apt install -y git curl wget unzip build-essential

# Node：用 nvm 装（别用 apt 的，版本老）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22
node -v    # v22.x
```

**build-essential 别省**：有些 npm 包要本地编译
（node-sass 之类），没它装依赖就报错。

## 三、Windows ↔ WSL 文件互访

```bash
# WSL 里访问 Windows 盘（自动挂载）
cd /mnt/c/Users/你的用户名/Desktop

# Windows 里访问 WSL（资源管理器地址栏）
\\wsl$\Ubuntu\home\你的用户名
```

**项目放哪**（重要）：

- **推荐放 WSL 里**（`~/projects/xxx`）：Linux 原生文件系统，
  权限/换行/性能都对。npm install 快一倍；
- **放 /mnt/c 的坑**：跨文件系统，`node_modules` 海量小文件时
  慢到怀疑人生，权限也容易怪。

**VS Code 直接开发 WSL 里的项目**：

```bash
cd ~/projects/my-app
code .          # 自动装 WSL 扩展，无缝衔接
```

VS Code 连上后，终端、调试、扩展全在 WSL 环境里跑 ——
「Windows 的编辑器，Linux 的内核」。

## 四、Git 与换行符（血泪配置）

Windows  checkout 会把 LF 转 CRLF，Linux 提交时全文件 diff ——
团队协作的经典惨案。统一方案：

```bash
# Git 全局（在 WSL 里）
git config --global core.autocrlf input     # 提交时 CRLF→LF，检出不动
```

团队约定好 `.gitattributes` 更稳：

```gitattributes
* text=auto eol=lf
*.png binary
*.jpg binary
```

## 五、终端与开发体验

```bash
# zsh + oh-my-zsh（可选，想漂亮就上）
sudo apt install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# 常用别名（~/.zshrc 或 ~/.bashrc）
alias ll='ls -alh'
alias gs='git status'
```

Windows Terminal 里给 WSL 配个好看的主题 +  JetBrains Mono 字体，
开发幸福感 +50%。

## 六、Docker Desktop 联动

装 Docker Desktop for Windows → 设置里确认
**Use WSL 2 based engine** → 在 WSL 终端里直接 `docker` 命令可用。
Docker Desktop 负责底层，WSL 里无感使用。

**WSL 里 Docker 连不上？**：

1. Docker Desktop 在跑吗；
2. Settings → Resources → WSL Integration → 你的发行版开关打开；
3. `docker context ls` 看默认 context。

## 七、常见问题

**WSL 2 需要虚拟化**：老 CPU/BIOS 没开 VT-x → 进 BIOS 开。
报「Virtualization is not enabled」就是这个。

**localhost 通，127.0.0.1 不通？** 或者反过来：
WSL2 和 Windows 网络栈有 NAT。WSL 里访问 Windows 服务用
`host.docker.internal` 或 Windows 的局域网 IP。

**太慢**：WSL 装在机械盘上、项目放 /mnt/c、杀毒软件扫
`node_modules` —— 这三样占全了就慢。把 WSL 和项目都放 SSD、
加杀毒白名单。

**Windows 里 npm 和 WSL 里 npm 冲突**：别混用。**开发只用
WSL 里的那份**，Windows 里的 Node 该卸就卸（或至少别在同一项目用）。

## 八、什么时候不用 WSL

也不是万能：

- **纯 .NET / C++ / Unity**：Windows 原生更好，别折腾；
- **就想用 Windows 终端跑 node 脚本**：也行，
  现在 Windows 的 Node 支持比以前强（fnm/pnpm 都能用），
  但涉及编译的依赖还是 Linux 省心；
- **公司安全软件禁用虚拟化**：没招，原生 Windows 环境 +
  Git Bash 凑合。

## 小结

Windows 前端开发正解：**WSL2 + nvm + pnpm + VS Code
Remote-WSL**。项目放 WSL 里，工具用 Linux 的，
编辑器用 Windows 的 —— 鱼和熊舟。半小时配完，
受惠整个编程生涯。本站文章里的所有命令，在 WSL 里原样能跑。
