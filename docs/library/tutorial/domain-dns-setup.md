---
title: 域名购买与 DNS 配置实操
createTime: 2026-10-22
permalink: /library/tutorial/domain-dns-setup/
description: 从买域名到解析到 GitHub Pages，一篇文章走通全流程
---

<CategoryTag name="教程" link="/library/tutorial/" />

网站部署好了，现在给它一个「门牌号」。这篇走完整流程：
**买域名 → 解析到 Pages → 开启 HTTPS**。以 GitHub Pages 为例，
其他平台同理。

## 一、买域名：去哪买，买什么

### 注册商选择

- **国内**（阿里云/腾讯云）：.com 首年约 55-70 元，续费 70-90。
  优点是中文服务、支付宝；缺点是**要实名认证**；
- **国外**（Namecheap/Cloudflare）：.com 约 $9-13/年。
  便宜、隐私保护默认开；缺点是国内访问注册商偶尔慢。

### 选什么后缀

```text
.com      – 永远的首选，认得多，略贵
.cn       – 国内站可用，要实名（注册商处提交）
.me/.io  – 个人/技术站流行（.io 略贵，且.io 国家域有政策风险）
.dev      – 技术向新贵（强制 HTTPS）
.top/.xyz – 便宜（首年几块钱），但续费贵、显得廉价
```

**建议：.com，除非有特殊理由。** 别为了省二十块用奇怪后缀 ——
用户记不住，输入法还不好打。

### 命名原则

- **短、好记、好念**：`zhihu.com` 胜过 `zhihuzatan.com`；
- **别带连字符和数字**：`my-site-2.com` 是自找麻烦；
- **先查商标**：别侵权（.com 被注册了也别碰同名 .cn）；
- **一次买多年**：忘了续费域名被抢的惨案，年年有。

买完进「域名控制台」，接下来配 DNS。

## 二、DNS 记录：四种就够

域名控制台 → DNS 解析设置。新手只需要认识四种：

| 类型 | 作用 | 例子 |
| --- | --- | --- |
| A | 域名 → IPv4 | `@ → 185.199.108.153` |
| CNAME | 域名 → 另一个域名 | `www → techjiang.github.io` |
| TXT | 文本（验证/SPF） | `v=spf1 …` |
| NS | 谁管这个域的 DNS | 换注册商/换解析商用 |

主机记录（Name）填法：

```text
@       → 域名本身（example.com）
www     → www.example.com
blog    → blog.example.com
*       → 所有子域（泛解析，慎用）
```

## 三、解析到 GitHub Pages

Pages 的 IP（GitHub 官方提供，以[文档](https://docs.github.com/articles/setting-up-an-apex-domain)为准）：

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

配两条记录（建议都配上，容灾）：

```text
类型 A    主机 @      值 185.199.108.153
类型 A    主机 @      值 185.199.111.153
类型 CNAME 主机 www    值 你的用户名.github.io
```

**注意**：GitHub Pages 的**项目页**（`用户名.github.io/仓库名`）
配自定义域名要填不带仓库路径的根域 —— 用户访问 `example.com`
会显示项目页内容，GitHub 自动处理重定向。

然后在 GitHub 仓库：**Settings → Pages → Custom domain** 填
`example.com`，保存。等 DNS 生效 + GitHub 签证书
（自动，几十分钟）。

## 四、验证 DNS 生效

```bash
# 本机看解析（没生效可能是缓存）
nslookup example.com
nslookup example.com 8.8.8.8

# 看完整链路和 TTL
dig example.com +trace
```

**生效时间**：几分钟到几小时（看记录的 TTL）。
新记录一般 10 分钟内；改老记录要等旧 TTL 过期
（所以[迁移要提前调 TTL](../dns.md)）。

本机缓存害事：`ipconfig /flushdns`（Windows）强刷。

## 五、HTTPS：免费证书自动来

GitHub Pages 配好自定义域名后，**自动签发 Let's Encrypt 证书**。
勾选 **Enforce HTTPS**（强制跳转 HTTPS）。

签不下来？排查顺序：

1. DNS 解析对不对（dig 看）；
2. 域名实名认证通过没（国内注册商）；
3. CAA 记录限制了签发机构（控制台删掉 CAA 或加上 letsencrypt.org）；
4. 等 —— 有时就是慢，24 小时都正常。

自己服务器（非 Pages）的证书：certbot 手动签，
见 [Nginx 部署](../nginx-static-deploy.md)。

## 六、常见坑

**www 和不带 www 都访问？**
都解析（上面配了两条），然后 GitHub Pages 设置里
**选一个为主**，另一个会自动跳。别两个都开着当独立站点 ——
SEO 认为是重复内容。

**解析通了但打不开？**
- 国内域名没实名 → 注册商处认证；
- 服务器防火墙/安全组没开 80/443；
- GitHub 仓库 Pages 没启用（Settings → Pages → Source 选对分支）。

**邮件收不到？**
忘了配 MX 记录。域名不只是给网站用的 ——
企业邮箱要 MX，发信要 SPF（TXT）。买域名时把这些一起规划。

## 七、费用与续费

- 域名：.com 约 60-90 元/年，**设自动续费**；
- DNS 解析：阿里云/Cloudflare/DNSPod 都免费；
- 证书：Let's Encrypt 免费（Pages 自动，自己服务器用 certbot）。

**Cloudflare 全家桶**（域名 + DNS + CDN + 防护）值得了解 ——
把 NS 记录改到 Cloudflare，免费档就有 CDN 加速和安全防护。
国内访问海外站的经典提速方案。

## 小结

域名五步：**买（.com + 短名）→ 解析（A 到 Pages IP，
CNAME www）→ GitHub 设置里绑定 → 等 DNS 生效 →
勾 Enforce HTTPS**。全程半小时（不含等待）。
域名是「数字地产」—— 买对了是资产，买错了是负担。
下手前多想五分钟。
