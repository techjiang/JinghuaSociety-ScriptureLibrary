---
title: 自己的服务器上 HTTPS：certbot 实操
createTime: 2026-10-22
permalink: /library/tutorial/https-certbot/
description: Let's Encrypt 免费证书申请、自动续期与常见故障，一条命令搞定
---

<CategoryTag name="教程" link="/library/tutorial/" />

# 自己的服务器上 HTTPS：certbot 实操

HTTPS 不是可选项。Let's Encrypt 提供免费证书，
certbot 让申请和续期全自动。本篇把流程走通，
含「证书为什么会突然失效」的排查。

## 一、原理一图流

```text
certbot 帮你：
1. 向 Let's Encrypt 证明「域名是你的」（ACME 挑战）
2. 拿到证书（90 天有效）
3. 配进 Nginx
4. 装定时任务自动续期（到期前 30 天开始尝试）
```

你要做的：**一个能解析到服务器的域名 + Nginx 已装**。

## 二、安装与申请（Ubuntu + Nginx）

```bash
# 1. 安装 certbot 和 Nginx 插件
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 2. 申请（一条命令，自动改 Nginx 配置）
sudo certbot --nginx -d example.com -d www.example.com
```

过程中会问：

1. **邮箱**：用来收续期提醒（真有事它真发邮件）；
2. **同意条款**：yes；
3. **是否共享邮箱给 EFF**：随意；
4. **HTTP 全跳 HTTPS 吗**：选 **2（Redirect）**。

完事。`https://example.com` 已经能访问，
HTTP 自动跳 HTTPS。

**证书在哪**：

```text
/etc/letsencrypt/live/example.com/fullchain.pem    # 证书（含中间链）
/etc/letsencrypt/live/example.com/privkey.pem       # 私钥
/etc/letsencrypt/live/example.com/chain.pem         # 中间链
```

## 三、自动续期：确认它活着

Let's Encrypt 证书 90 天过期。certbot 包装了 systemd timer
自动续期，但**要验证**：

```bash
# 看 timer 在不在
systemctl list-timers | grep certbot

# 手动试一次续期（不会真续，只演练）
sudo certbot renew --dry-run
```

`--dry-run` 显示「Congratulations, all renewals succeeded」
就万事大吉。**建议加监控**（到期前 14 天告警）——
certbot 自动续也可能失败（网络、DNS、Nginx 配置变更），
证书过期 = 网站「不安全」大红字，用户跑光。

## 四、Nginx 配置（certbot 自动配后的样子）

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # 安全增强（certbot 也未必帮你配全）
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # HSTS：告诉浏览器「以后只走 HTTPS」（小心，开了难退）
    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        root /var/www/example;
        index index.html;
    }
}

server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

改完 `sudo nginx -t && sudo systemctl reload nginx`。
配置解释见 [HTTPS 与 TLS](../../tech/https-tls.md)。

## 五、续期失败：常见四因

**1. 80 端口不通**
ACME 验证走 HTTP（80 端口）。防火墙/安全组挡了 → 验证失败。
确保 `sudo ufw status` 里 80 是 allow。

**2. Nginx 配置被改坏**
你后来手改了 server 块，certbot 找不到该改哪。
用 `sudo certbot certificates` 看现有证书，
续期时报错会指明哪个域名哪个 server 块。

**3. DNS 不指向这台服务器**
换了服务器 IP 忘了改 DNS —— 验证请求打到别处去了。
`dig example.com +short` 对一下。

**4. 域名过期**
忘续域名，Let's Encrypt 拒绝签发。这种最冤。

## 六、多域名与泛域名

**多域名**（一台服务器几个站）：

```bash
sudo certbot --nginx -d a.com -d b.com -d c.com
```

一个证书带多个域名（SAN 证书），各自续期。

**泛域名（`*.example.com`）**：
子域名随便加，但要 DNS 验证：

```bash
sudo certbot --nginx -d example.com -d "*.example.com" \
  --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/cf.ini
```

（用哪个 DNS 商装哪个插件，API token 配好。）
个人站一般用不到，知道有这条路。

## 七、强制 HTTPS 之后：安全收尾

```nginx
# 1. HSTS（开之前想清楚：接下来半年你真不会回 HTTP）
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# 2. 混合内容清理：页面里别引 http:// 资源（浏览器会拦）
#    检查：DevTools Console 搜 "Mixed Content"

# 3. 测评分：https://www.ssllabs.com/ssltest/ 输入域名
#    A+ 需要：现代 TLS、HSTS、无混合内容
```

## 八、Docker 里的服务怎么办

Nginx 在容器里跑？证书挂载进去：

```yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro    # 证书只读挂入
    ports:
      - "443:443"
```

certbot 在宿主机跑（或用 `certbot/certbot` 容器），
证书落在宿主 `/etc/letsencrypt`，Nginx 容器挂载读取。
**别在容器里跑 certbot 改 Nginx** —— 路径地狱，
不如宿主机管证书、容器管服务。

## 小结

HTTPS 三步：**`apt install certbot python3-certbot-nginx` →
`certbot --nginx -d 域名` → 确认 `certbot renew --dry-run` 能过**。
剩下的它全自动。你要做的只是**监控证书别过期**
和**续期失败时按四因排查**。免费的证书，自动的续期，
不用白不用 —— 用户的浏览器替你盯着呢。
