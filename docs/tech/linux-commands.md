---
title: Linux 常用命令速查
createTime: 2026-10-21
permalink: /tech/linux-commands/
description: 文件、文本、进程、网络四大类常用命令，附组合技与踩坑提醒
---

# Linux 常用命令速查

服务器大多是 Linux，前端也迟早要跟它打交道（部署、CI、容器）。
这篇不按字母序罗列（那是 `man` 的活），按**使用场景**分类，
只收我每天真在用的。macOS 也能用，毕竟都是 Unix 血脉。

## 一、文件和目录

```bash
ls              # 看目录内容
ls -lah         # 详细 + 隐藏文件 + 人类可读大小（我最常用的组合）
cd /path/to     # 进目录
cd ..           # 上一级
cd -            # 回到刚才所在的目录（很多人不知道）
pwd             # 看当前在哪

mkdir new-dir   # 建目录
mkdir -p a/b/c  # 多层一起建
touch file.txt  # 建空文件 / 更新时间戳

cp a.txt b.txt          # 复制
cp -r src dst           # 复制目录
mv old.txt new.txt      # 移动 / 重命名
rm file.txt             # 删文件
rm -rf dir              # 删目录（高危，敲完默念一遍路径）

df -h          # 看磁盘还剩多少
du -sh *       # 看当前目录各项占多大
```

**高危提醒**：`rm -rf` 没有回收站，删了就没了。特别是 `sudo rm -rf /`
和 `rm -rf /*` 这种传说级操作，敲之前手一定要停三秒。我的习惯是
先用 `ls` 确认目标，再 `rm`。

## 二、看文件内容

```bash
cat file.txt        # 全屏打印（适合小文件）
less file.txt       # 分页看，支持上下翻、按 / 搜索、q 退出
head -20 file.txt   # 看前 20 行
tail -20 file.txt   # 看后 20 行
tail -f app.log     # 实时追踪日志（看服务日志必用，Ctrl+C 退出）

wc -l file.txt      # 数行数
wc -w file.txt      # 数单词数
```

看日志三件套：`tail -f` 跟实时，`grep` 过滤，`less` 翻上下文。
写服务器的第一课就是 `tail -f`。

## 三、搜索：grep 和 find

```bash
grep "error" app.log            # 在文件里搜字符串
grep -i "error" app.log         # 忽略大小写
grep -n "error" app.log         # 显示行号
grep -r "TODO" src/             # 递归搜整个目录
grep -v "debug" app.log         # 反向：排除含 debug 的行

find . -name "*.log"            # 按名字找文件
find . -name "*.log" -mtime +7  # 7 天前修改的
find . -size +100M              # 大于 100MB 的（揪大文件用）
```

组合技，找今天改过的 JS 文件：

```bash
find src -name "*.js" -newer package.json
```

## 四、进程管理

```bash
ps aux | grep node     # 看 node 进程（管道 + grep 过滤）
top                    # 实时资源占用（htop 更好看，有就装）
kill 12345             # 按 PID 结束进程
kill -9 12345          # 强杀（前面正常杀不掉才用）
pkill -f "node app.js" # 按命令行特征杀，不用先查 PID
lsof -i :3000          # 看谁占了 3000 端口（端口冲突排查神器）
```

部署时最常用的其实是 `pkill` 和 `lsof -i`：重启服务先杀旧的，
端口被占先查是谁。

## 五、网络

```bash
ping baidu.com        # 通不通（能到网关和 DNS 正常不）
curl -I https://example.com   # 只看响应头（查缓存配置用它）
curl -o file.zip https://...  # 下载
wget https://...              # 下载（更简单粗暴）
ss -tlnp          # 看本机监听的端口和进程（netstat 的现代替代）
scp file.txt user@server:/path/   # 往服务器传文件
ssh user@server   # 登服务器
```

`curl -I` 排缓存问题的好帮手，比在浏览器 DevTools 里看还直观。

## 六、权限与用户

```bash
ls -l           # 权限那列：-rw-r--r--
chmod +x script.sh      # 加执行权限
chmod 755 dir           # 属主全权，其他人读+执行
sudo command            # 以 root 身份执行（ Ubuntu 标配）
chown user:group file   # 改属主（一般 sudo 才用得动）
```

权限三位一组：属主、同组、其他人；`r`=4 读、`w`=2 写、`x`=1 执行。
`755` = 属主 7（全权），其他 5（读+执行）。这是脚本和目录的常用值。

## 七、管道与重定向

这是 Unix 的灵魂，单独一节：

```bash
command > file.txt     # 输出写到文件（覆盖）
command >> file.txt    # 输出追加到文件
command1 | command2    # 把 command1 的输出当 command2 的输入
```

实战，统计日志里 error 出现的次数：

```bash
grep -c "error" app.log
grep "error" app.log | wc -l        # 或者管道组合
grep "error" app.log | sort | uniq -c | sort -rn   # 按出现频率排序
```

学会 `|`，命令就从「工具」变成「工具箱」。上面第三条：
搜 error → 排序 → 去重计数 → 按数量倒序，一条流水线干完统计。

![终端里的管道组合技](/images/linux-tree.svg)

*图：这些命令不是背的，是每天在终端里真敲的*

## 八、tar 与压缩

```bash
tar -czvf archive.tar.gz dir/    # 压缩目录（c 建、z gzip、v 过程、f 文件）
tar -xzvf archive.tar.gz         # 解压
tar -xzvf archive.tar.gz -C /目标目录   # 解压到指定目录
zip -r archive.zip dir/          # zip 格式（Windows 同学爱用）
unzip archive.zip
```

参数口诀：`c` 是打包，`x` 是解包，`z` 走 gzip，`f` 后面跟文件名。
记混了就 `tar --help`，没人笑话查文档。

## 九、vim 生存指南

服务器上改文件大概率遇到 vim。生存所需就五条：

```text
i       进入编辑模式（光标处插入）
Esc     回到普通模式
:wq     保存并退出（先按冒号）
:q!     不保存强退
dd      删当前行（普通模式下）
```

进去别乱按，按 `i` 改，`Esc` 回来，`:wq` 走人。
真的讨厌它，`nano` 对新手友好得多（底部有提示，`Ctrl+O` 存，`Ctrl+X` 退）。

## 小结

这份清单覆盖日常八成场景。学命令的捷径不是背，是**带着真实任务用**：
下次部署卡住了，现查现用，三次就记住了。真忘了 `--help` 和 `man`
随叫随到，不丢人。
