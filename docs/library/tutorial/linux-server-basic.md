---
title: Linux 服务器基本操作
createTime: 2026-10-22
permalink: /library/tutorial/linux-server-basic/
description: SSH 登录、文件操作、用户权限、systemd 服务——买台服务器先会这些
---

# Linux 服务器基本操作

买了第一台云服务器，面对黑终端发懵？这篇讲「活下去」必需的：
连上去、传文件、装软件、起服务、看日志。命令不多，但都是天天用的。

> 以 Ubuntu 24.04 为例（CentOS/Rocky 差别文中注明）。

## 一、连上去：SSH

```bash
# 本地终端（Windows 用 PowerShell/Git Bash）
ssh root@服务器IP
# 输入密码（买服务器时设的或密钥）

# 用密钥登录（更安全，配一次免密）
ssh-keygen -t ed25519                    # 本地生成密钥对
ssh-copy-id root@服务器IP                 # 把公钥传上去
```

**安全第一件事**：禁用 root 密码登录，改用密钥 + 普通用户。

```bash
# 服务器上：建普通用户，给 sudo 权
adduser deploy
usermod -aG sudo deploy

# 编辑 /etc/ssh/sshd_config：
#   PasswordAuthentication no     # 禁密码
#   PermitRootLogin no            # 禁 root 直接登录
systemctl restart sshd
```

**然后本地就能 `ssh deploy@IP`**。root 账户留着应急
（云厂商控制台有 VNC 能进，不怕锁死自己）。

## 二、文件操作：上传下载

```bash
# 上传（本地 → 服务器）
scp -r ./dist/* deploy@IP:/var/www/myapp/

# 下载（服务器 → 本地）
scp deploy@IP:/var/log/nginx/error.log ./

# 增量同步（多次部署用这个，只传改动的）
rsync -avz --delete dist/ deploy@IP:/var/www/myapp/
```

**部署三板斧**：`scp` 传一次、`rsync` 反复传、`git pull`
代码型项目（服务器直接 clone，更新就是 pull）。
本站就是 git + Actions 路线（见[搭站教程](../build-blog-with-plume.md)），
服务器上都不用登录。

## 三、软件安装：apt

```bash
sudo apt update                  # 更新软件源（装之前先跑）
sudo apt install nginx           # 装 Nginx
sudo apt remove nginx            # 卸载
apt list --installed | head      # 看装了什么

# Node 别用 apt 装（版本旧），用 nvm：
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
```

CentOS/Rocky 用 `dnf install`，Debian 系用 `apt`。其他逻辑一样。

## 四、服务管理：systemctl

现代 Linux 用 systemd 管服务：

```bash
sudo systemctl start nginx        # 启动
sudo systemctl stop nginx         # 停止
sudo systemctl restart nginx      # 重启
sudo systemctl reload nginx       # 重载配置（不中断服务）
sudo systemctl status nginx       # 看状态
sudo systemctl enable nginx       # 开机自启（重要！）
```

**自己的应用也注册成服务**（开机自启 + 崩了自动拉）：

```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My App
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/node server.js
Restart=always              # 崩了自动重启
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload     # 改了服务文件必须重载
sudo systemctl enable --now myapp
```

没有这套，服务器重启一次你的应用就「忘了起」——别问怎么知道的。

## 五、看日志：出事先看这里

```bash
# 应用日志（systemd 服务）
sudo journalctl -u myapp -f              # 实时跟踪
sudo journalctl -u myapp --since today    # 今天的

# Nginx 日志
tail -f /var/log/nginx/access.log         # 谁来了
tail -f /var/log/nginx/error.log          # 出什么错

# 系统资源
top                                       # CPU/内存（htop 更好看）
df -h                                     # 磁盘还剩多少
free -h                                   # 内存
```

排查问题的顺序：**`systemctl status` 看服务活着没 →
`journalctl -u` 看应用日志 → `nginx error.log` 看接入层 →
`top`/`df` 看资源**。九成问题在这四步内现形。

## 六、防火墙：只开该开的

Ubuntu 自带 ufw：

```bash
sudo ufw allow 22          # SSH（先开这个再启用！）
sudo ufw allow 80          # HTTP
sudo ufw allow 443         # HTTPS
sudo ufw enable            # 启用
sudo ufw status            # 看规则
```

**顺序错了会锁死自己**（先 enable 再 allow 22 = 远程断开连不上）。
云厂商还有安全组（网页控制台配），两层配合。

## 七、定时任务：crontab

```bash
crontab -e                 # 编辑当前用户定时任务
```

```text
# 格式：分 时 日 月 周 命令
0 3 * * * /var/www/myapp/backup.sh        # 每天凌晨 3 点备份
*/5 * * * * curl -s http://localhost/health   # 每 5 分钟健康检查
```

备份、清日志、续证书（certbot renew）都用它。
[crontab.guru](https://crontab.guru) 网站在线解释表达式。

## 八、最小安全清单

新服务器到手，十分钟做完这些：

- [ ] 建普通用户 + sudo，禁 root 密码登录；
- [ ] SSH 密钥登录，禁密码；
- [ ] ufw 只开 22/80/443；
- [ ] `apt update && apt upgrade` 打补丁；
- [ ] 装 `fail2ban`（防 SSH 暴力破解）；
- [ ] 时区设对（`timedatectl set-timezone Asia/Shanghai`）；
- [ ] 换 SSH 端口（可选，减骚扰）。

## 小结

服务器生存包：**ssh 登录、scp/rsync 传文件、apt 装软件、
systemctl 管服务、journalctl/tail 看日志、ufw 防火墙、
crontab 定时**。七样会了，个人服务器就玩得转了。
安全和备份是底线 —— 被黑一次、硬盘坏一次，比学十节课记得牢。
