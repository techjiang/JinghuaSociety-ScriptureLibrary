---
title: DNS 解析：从域名到 IP 的完整旅程
createTime: 2026-10-22
permalink: /library/tech/dns/
description: 递归与迭代查询、记录类型、缓存与 TTL、DNS 污染的坑
---
浏览器输入 `github.com`，回车，几十毫秒后页面出来了。
这几十毫秒里 DNS 干了一件大事：把人类好记的域名，翻译成机器好找的 IP。
这篇跟一次完整的查询，讲清流程和坑。

## 一、DNS 是分布式的电话簿

全球域名那么多，不可能存一个地方。DNS 设计成**层级分布式**：

```text
根 DNS 服务器（全球 13 组，管 .com/.net/.org 这些顶级域在哪）
   └─ 顶级域 DNS（.com 的服务器，管 github.com 的权威服务器在哪）
        └─ 权威 DNS（github.com 的服务器，管最终 IP）
```

再加一层「递归解析器」（通常是你运营商或 8.8.8.8/114.114.114.114），
替你跑腿：你问它一次，它去问根、问顶级、问权威，拿到结果再答你。

## 二、一次完整查询：递归 + 迭代

你访问 `github.com`，假设本地毫无缓存：

```text
① 浏览器问操作系统：「github.com 的 IP？」
② 操作系统问递归解析器（比如 114.114.114.114）
③ 递归解析器问根服务器：「.com 归谁管？」→ 答：去问 a.gtld-servers.net
④ 递归解析器问 .com 顶级域服务器：「github.com 归谁管？」
   → 答：去问 ns1.github.com 等权威服务器
⑤ 递归解析器问 github.com 权威服务器：「github.com 的 IP？」
   → 答：140.82.121.4
⑥ 递归解析器把结果答给操作系统，操作系统答给浏览器
```

注意区分两种「问法」：

- **递归查询**：你→递归解析器。「我不管你怎么搞，给我最终答案」；
- **迭代查询**：递归解析器→各级服务器。「不知道？告诉我该问谁」。

浏览器还要走一步：查 `hosts` 文件（本地的强制映射，开发常用），
再走上面的流程。

## 三、记录类型：不只 A 记录

配置 DNS 时常见的几种记录：

| 类型 | 作用 | 例子 |
| --- | --- | --- |
| A | 域名 → IPv4 | `github.com → 140.82.121.4` |
| AAAA | 域名 → IPv6 | `github.com → 2606:50bc::` |
| CNAME | 域名 → 另一个域名（别名） | `www.x.com → x.com` |
| MX | 邮件服务器 | `example.com → mail.example.com` |
| TXT | 文本，用来验证所有权/SPF | `v=spf1 include:_spf.google.com ~all` |
| NS | 谁是这个域的权威服务器 | `example.com → ns1.dnspod.net` |

几个实操点：

- `@` 代表根域本身（`example.com`），`www` 是子域；
- CNAME 不能指向根域（`www` 指 `@` 不行，规定如此）；
- 根域的 CNAME 和 MX 不能共存（也是规定，逼你二选一）。

## 四、缓存与 TTL：改了解析不生效的元凶

每一级都缓存，每级都过期：

```text
浏览器缓存（Chrome 约 1 分钟）
操作系统缓存（分钟级）
递归解析器缓存（看 TTL）
```

**TTL（Time To Live）**是记录上的「能缓存多久」，单位秒。
典型值：

- 日常业务：3600（1 小时）或 86400（1 天）；
- **要迁移/切流的前奏**：提前几天把 TTL 改小（比如 60 秒），
  改完 IP 后一分钟内全网生效；
- 切完再调回大值。

**经典事故**：网站迁移改了 IP，用户还是访问旧服务器。
原因就是旧记录还在缓存里，TTTL 没到。着急也没用 ——
等缓存过期，或者提前调 TTL。所以**迁移要提前规划 TTL**，
这是运维的基本功。

排查命令：

```bash
# 看本机/指定 DNS 服务器的解析结果
nslookup github.com
nslookup github.com 8.8.8.8

# 看完整链路（哪个服务器、TTL 多少）
dig github.com +trace
```

`dig +trace` 从根开始走一遍，哪一层出错看得清清楚楚。
Windows 自带 `nslookup`，`dig` 要装（或 WSL 里用）。

## 五、常见坑

**DNS 污染/劫持**
某些网络环境下，查询被中间设备拦截，返回假 IP（你访问的谷歌 DNS
返回了一堆奇怪地址）。表现：域名解析到错误 IP、时好时坏。
解法：换可信 DNS（`8.8.8.8` / `1.1.1.1` / `223.5.5.5`），
或者 DoH（DNS over HTTPS，把 DNS 查询塞进 HTTPS，中间设备看不懂）。

**CNAME 到 CDN 后 ping 不通**
CNAME 到 CDN 域名后，`ping 你的域名` 显示的是 CDN 节点 IP，
不是你服务器 IP —— 正常的，CDN 本来就该挡在你前面。

**泛解析的坑**
配了 `*.example.com` 通配符，测试子域 `test.example.com` 能访问，
上线后有人乱配子域指到内部服务，DNS 层面根本拦不住。
**泛解析谨慎开**，开就开 `*.prod.example.com` 这种明确范围的。

**邮箱发不出去**
MX 记录配错、TXT 里的 SPF/DKIM 漏配，邮件直接进垃圾箱或被拒。
企业邮箱迁移，这三样（MX/TXT SPF/TXT DKIM）都要一起配。

## 六、本地开发：hosts 文件

不用买域名就能把测试域名指到本地：

```text
# Windows: C:\Windows\System32\drivers\etc\hosts
# macOS/Linux: /etc/hosts

127.0.0.1 myapp.test
```

改完立即生效（本机查询先查 hosts）。**注意：改完要清理 DNS 缓存**
（Windows: `ipconfig /flushdns`），以及浏览器自己的 DNS 缓存
（Chrome: `chrome://net-internals/#dns` 里清）。

## 小结

DNS 一句话：**分布式的层级电话簿，递归解析器替你跑腿，TTL 管缓存寿命**。
改解析不生效，先想 TTL；排查用 `dig +trace` 从根走一遍。
迁移切流提前调 TTL，这是血的教训换来的规矩。
