---
title: Shell 脚本入门：半小时自动化
createTime: 2026-10-22
permalink: /library/tutorial/shell-script/
description: 变量、条件、循环、函数加五个实用脚本，运维和本地自动化都靠它
---

# Shell 脚本入门：半小时自动化

有些事你每周都在重复做：备份数据库、清日志、拉代码重启服务、批量改文件名。
写个 Shell 脚本，一次编写，以后一条命令。这篇按「能跑就行」的标准讲，
不追求语法完美。

> 环境：bash（Linux/macOS 原生，Windows 用 Git Bash 或 WSL）。

## 一、第一个脚本

```bash
#!/bin/bash
# 第一行叫 shebang，告诉系统用 bash 解释这个文件

echo "你好，$(whoami)"   # echo 输出，$(命令) 是命令替换
```

保存为 `hello.sh`，然后：

```bash
chmod +x hello.sh   # 加执行权限
./hello.sh          # 运行
```

或者懒得加权限：`bash hello.sh`。

## 二、变量：不需要声明的语言

```bash
NAME="张三"           # 赋值，等号两边不能有空格！
echo $NAME           # 取值用 $
echo "你好 $NAME"    # 双引号里变量会展开
echo '你好 $NAME'    # 单引号里原样输出，不展开
```

**变量引用建议加引号**：`rm $FILE` 如果 FILE 是空的，`rm` 会报错；
`rm "$FILE"` 空值就是一个参数，安全得多。这是 Shell 老鸟的习惯。

特殊变量：

```bash
$0        # 脚本自己的名字
$1 $2 $3  # 第 1、2、3 个参数
$@        # 所有参数
$#        # 参数个数
$?        # 上一条命令的退出码（0 = 成功）
```

```bash
#!/bin/bash
echo "脚本名: $0"
echo "第一个参数: $1"
echo "参数个数: $#"
```

## 三、条件判断

```bash
if [ "$1" = "deploy" ]; then
  echo "开始部署"
elif [ "$1" = "rollback" ]; then
  echo "回滚"
else
  echo "用法: $0 deploy|rollback"
  exit 1
fi
```

**方括号两边必须有空格**（`[ ... ]`，`[` 是命令不是语法）。常用判断：

```bash
[ -f 文件 ]    # 文件存在且是普通文件
[ -d 目录 ]    # 目录存在
[ -z "$VAR" ]  # 字符串为空
[ -n "$VAR" ]  # 字符串非空
[ "$A" = "$B" ]  # 字符串相等
[ "$A" -eq 5 ]   # 数字相等（-ne -lt -gt -le -ge）
[ "$A" -gt "$B" ] && echo "A 更大"
```

文件测试在脚本里极常用（「配置文件存在吗」「日志存在吗」）。

## 四、循环

### for：遍历

```bash
# 遍历列表
for env in dev staging prod; do
  echo "部署到 $env"
done

# 遍历文件
for f in *.log; do
  echo "处理 $f"
done

# C 风格
for i in $(seq 1 10); do
  echo "第 $i 次"
done
```

### while：条件循环

```bash
count=0
while [ $count -lt 5 ]; do
  echo "$count"
  count=$((count + 1))   # 算术运算用 $(( ))
done
```

## 五、函数

```bash
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "脚本启动"
log "干点活"
```

函数就是「给一段命令起名」。脚本长了以后，把逻辑拆成函数，可读性翻倍。

## 六、五个实用脚本

### 1. 项目备份

```bash
#!/bin/bash
# backup.sh —— 打包项目，保留最近 7 份
SRC="/var/www/my-app"
DEST="/backup"
DATE=$(date +%Y%m%d_%H%M)

tar -czf "$DEST/app_$DATE.tar.gz" -C "$SRC" .
ls -t "$DEST"/app_*.tar.gz | tail -n +8 | xargs rm -f
echo "备份完成: app_$DATE.tar.gz"
```

### 2. 批量重命名

```bash
#!/bin/bash
# 把目录下所有 .jpeg 改成 .jpg
for f in *.jpeg; do
  [ -e "$f" ] || continue   # 没有匹配文件时跳过（通配符不展开的坑）
  mv "$f" "${f%.jpeg}.jpg"
done
```

`${f%.jpeg}` 是「去掉尾部 .jpeg」的参数展开，Shell 里处理文件名的神器。

### 3. 部署三连

```bash
#!/bin/bash
set -e   # 任何命令失败就退出！脚本第一条就该写

cd /var/www/my-app
git pull
npm ci --production
pm2 restart my-app
echo "部署完成"
```

`set -e` 是脚本安全绳：`git pull` 失败就别往下跑了。
更严格用 `set -euo pipefail`（未定义变量也报错，管道中间失败也算失败）。

### 4. 日志清理

```bash
#!/bin/bash
# 清 30 天前的日志
find /var/log/myapp -name "*.log" -mtime +30 -delete
echo "已清理 30 天前的日志"
```

### 5. 等待服务就绪

```bash
#!/bin/bash
# 等服务起来再继续（CI 里常用）
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000/health > /dev/null; then
    echo "服务就绪"
    exit 0
  fi
  sleep 1
done
echo "等了 30 秒还没起来" >&2
exit 1
```

## 七、调试技巧

```bash
bash -x script.sh    # 追踪模式：每条命令执行前打印出来
```

报错信息看不懂时，`-x` 一开，哪一行、什么值，全看得清清楚楚。
比瞪眼看代码高效十倍。

## 八、给 Windows 用户

- **Git Bash**：装 Git 自带，轻量，日常够用；
- **WSL**：`wsl --install`，完整的 Linux 环境，跑脚本最保真；
- **别用 PowerShell 跑 bash 脚本**（语法不一样），反过来也一样。

本站的部署脚本、构建命令都是 bash 系 —— 装机时把 Git Bash 或 WSL 装上，
不亏。

## 小结

Shell 脚本入门就这些：**变量、if、for、函数、`set -e`**。
不需要成为专家，能把你每周重复的命令攒成一个脚本，就已经回本。
更多的（数组、关联数组、信号处理）等真实需求来了再查 ——
`man bash` 随时候着。
