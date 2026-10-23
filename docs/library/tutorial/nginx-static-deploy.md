---
title: Nginx 部署静态站点
createTime: 2026-10-21
permalink: /library/tutorial/nginx-static-deploy/
description: 从安装到配置缓存、Gzip、HTTPS，把手里的静态站点真正发上线
---

<CategoryTag name="教程" link="/library/tutorial/" />
`npm run docs:build` 出来的 `dist` 文件夹，拷到服务器上就能跑，
但「能跑」和「跑得好」之间隔着不少事：缓存要配、Gzip 要开、
单页应用的路由要兜底、HTTPS 要申请。这篇把这些一次讲完。

> 测试环境：Ubuntu 24.04 + Nginx 1.24。CentOS 之类命令略有差别，
> 配置语法通用。

## 一、安装与启动

```bash
sudo apt update
sudo apt install nginx
sudo systemctl status nginx    # 看状态，active 就成了
```

装完浏览器访问 `http://服务器IP`，看到 Nginx 欢迎页 = 成功。
配置文件在 `/etc/nginx/`，站点配置一般在 `/etc/nginx/conf.d/` 或
`sites-available`（Debian 系）。

## 二、最小站点配置

```nginx
server {
    listen 80;
    server_name example.com;              # 你的域名

    root /var/www/my-site/dist;           # 构建产物目录
    index index.html;

    location / {
        try_files $uri $uri/ /index.html; # 关键，见下文
    }
}
```

`try_files $uri $uri/ /index.html` 这行是单页应用（SPA）的命根子：
用户直接访问 `/blog/hello-site/` 这种「前端路由」地址时，
Nginx 找不到对应文件，就 fallback 到 `index.html`，
让前端路由自己接管。少了这行，刷新深链接直接 404。

![Nginx 处理请求的流程](/images/nginx-flow.svg)

*图：一个 Nginx server 块同时干静态直出、接口代理、缓存和压缩*

改完配置：

```bash
sudo nginx -t        # 语法检查，一定要先跑
sudo systemctl reload nginx
```

`nginx -t` 是个好习惯，配置写错了它会告诉你哪行有问题，
`reload` 失败也不影响正在跑的旧配置。

## 三、上传文件的两种姿势

**scp 直接拷**（适合一次性）：

```bash
scp -r dist/* user@服务器IP:/var/www/my-site/dist/
```

**rsync 增量同步**（适合反复部署，只传改动的文件，快得多）：

```bash
rsync -avz --delete dist/ user@服务器IP:/var/www/my-site/dist/
```

`--delete` 会把远端多出来的文件删掉，保持两边完全一致。
注意参数结尾的斜杠方向：`dist/` 是传内容，`dist` 是传目录本身，
搞错了会在远端套一层娃，别问我怎么知道的。

## 四、缓存策略：跟着构建产物的特点配

部署前端站点，缓存配置是重头戏（原理看
[HTTP 缓存详解](../tech/http-cache.md)）。直接抄这套：

```nginx
# HTML：每次都要验证，保证用户拿到最新入口
location / {
    add_header Cache-Control "no-cache";
}

# 带 hash 的静态资源：缓存一年，内容变文件名自然变
location ~* \.(?:js|css|png|jpe?g|svg|woff2?|ttf)$ {
    add_header Cache-Control "max-age=31536000, immutable";
}
```

构建工具（Vite/Webpack）输出的文件名都带内容 hash，
比如 `main.8f3k2.js`。这种文件缓存多久都安全 —— 内容一改，
文件名就变，等于自带版本号。**HTML 千万别跟着一起缓存**，
不然发了新版，用户还挂在旧页面上，排查半天以为是 CDN 的锅。

## 五、Gzip：零成本的提速

```nginx
server {
    gzip on;
    gzip_comp_level 5;              # 1-9，越大越费 CPU，5 是甜点
    gzip_min_length 1k;             # 小于 1k 的文件不压缩，省得白忙
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
}
```

文本类资源（JS/CSS/HTML/SVG/JSON）压缩率普遍 60%-80%，
一个 500KB 的 JS 压完一百多 KB，用户秒开，CPU 那边几乎无感。
图片视频不用压 —— JPEG/PNG/MP4 本身已经是压缩格式，
再 Gzip 一遍是负优化。

验证：

```bash
curl -H "Accept-Encoding: gzip" -I https://example.com/main.js
# 响应头出现 content-encoding: gzip 就成了
```

## 六、HTTPS：Let's Encrypt 免费证书

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

certbot 会自动改 Nginx 配置、拿证书、配续期。
之后证书快过期时 `sudo certbot renew` 续（它会装个定时任务自动跑）。
HTTP 自动跳 HTTPS：

```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

个人站用免费证书完全够，别去花钱买。

## 七、安全相关的几个小项

```nginx
# 隐藏 Nginx 版本号，少暴露一点信息
server_tokens off;

# 安全响应头，一行一个，便宜好用
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# 别把 .git 目录暴露出去（真见过这么干的）
location ~ /\.git {
    deny all;
}
```

## 八、日志与排障

```bash
tail -f /var/log/nginx/access.log    # 谁来了、请求了什么
tail -f /var/log/nginx/error.log     # 出了什么错
```

部署完先自己访问一遍，再看 access log 里有没有你的记录。
状态码 404 查路径，502 查后端，403 查权限
（`/var/www` 下的文件记得给 nginx 用户读权限，
不行就 `sudo chmod -R 755 /var/www/my-site`）。

## 小结

静态站点部署五件套：**try_files 兜底路由、hash 资源长缓存、
HTML 不缓存、Gzip 开起来、HTTPS 套上**。配一次管三年，
性价比在运维界也是排得上号的操作。
