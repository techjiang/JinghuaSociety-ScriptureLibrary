---
title: Nginx 反向代理入门
createTime: 2026-10-22
permalink: /library/tutorial/nginx-reverse-proxy/
description: 一个站点同时跑前端和 Node 服务，Nginx 当门房分流的完整配置
---

# Nginx 反向代理入门

「Nginx 部署静态站点」那篇讲静态托管，这篇讲另一半：
**Node/Python/Java 服务怎么用 Nginx 暴露出去**。
这也是「前后端分离」部署的标准姿势。

## 一、场景：一个域名，两个服务

```text
用户 → https://myapp.com/
         ├─ /            → 前端静态文件（dist/）
         └─ /api/        → Node 服务（localhost:3000）
```

Nginx 站在最前面当门房：静态的自己给，/api 的转给后端。
浏览器只看到一个域名，不知道背后有几个服务。

## 二、完整配置

```nginx
server {
    listen 80;
    server_name myapp.com;

    # 前端静态文件
    location / {
        root /var/www/myapp/dist;
        index index.html;
        try_files $uri $uri/ /index.html;    # SPA 路由兜底
    }

    # API 反向代理到 Node 服务
    location /api/ {
        proxy_pass http://localhost:3000/;   # 注意结尾的 /（见下文坑一）

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持（如果需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

改完 `sudo nginx -t && sudo systemctl reload nginx`。

## 三、proxy_pass 的斜杠坑

**最容易懵的点**：`proxy_pass` 结尾带不带 `/`，行为完全不同。

```nginx
# 场景：访问 /api/users

location /api/ {
    proxy_pass http://localhost:3000/;     # 带 /：/api 被替换掉 → 请求 /users
}

location /api/ {
    proxy_pass http://localhost:3000;      # 不带 /：原样转发 → 请求 /api/users
}
```

**选哪个取决于后端路由怎么写**：

- 后端路由是 `/users` → 带 `/`；
- 后端路由是 `/api/users` → 不带 `/`。

Express 项目通常后端不含 `/api` 前缀 → 带 `/` 常见。
**配错了的表现**：接口全 404 —— 先查这里。

## 四、为什么要经过 Nginx（而不是直接暴露 3000）

直接 `node server.js` 监听 3000，用户访问 `myapp.com:3000` 行不行？
行，但糟点多：

| 问题 | Nginx 方案 |
| --- | --- |
| 端口号难看（:3000） | 80/443 默认端口 |
| Node 单线程，静态文件也它发 | Nginx 发静态，Node 只算业务 |
| HTTPS 要应用层搞 | Nginx 统一管证书 |
| 多服务要开多个端口 | 一个域名按路径分流 |
| 崩了没有兜底 | Nginx 能返回 502 页面 |

**静态给 Nginx，动态给应用**，各干各擅长的。

## 五、负载均衡：多开几个后端

一台 Node 扛不住？开三个，Nginx 分流：

```nginx
upstream myapp_api {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    location /api/ {
        proxy_pass http://myapp_api/;
    }
}
```

默认轮询（雨露均沾）。其他策略：

```nginx
upstream myapp_api {
    ip_hash;                    # 同一 IP 固定到一台（会话保持）
    # least_conn;               # 谁闲给谁（长连接场景）
    server localhost:3001 weight=3;   # 权重：3001 接三倍流量
    server localhost:3002;
}
```

单机多实例先用 `weight`/轮询；多机器部署才需要
`ip_hash` 或一致性哈希（配合会话外置）。

## 六、HTTPS + 反向代理一起配

```nginx
server {
    listen 443 ssl http2;
    server_name myapp.com;

    ssl_certificate     /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;

    # ...location 配置同上...
}

# HTTP 跳 HTTPS
server {
    listen 80;
    server_name myapp.com;
    return 301 https://$host$request_uri;
}
```

证书用 certbot 免费办（[Nginx 部署那篇](../nginx-static-deploy.md)
有完整步骤）。

## 七、常见问题排查

**502 Bad Gateway**
后端没起，或 proxy_pass 地址/端口错。查：
`systemctl status myapp`、`curl localhost:3000` 直连后端通不通。

**504 Gateway Timeout**
后端太慢没响应。查后端日志；必要时调
`proxy_read_timeout 60s`（默认 60s，大计算场景要放宽）。

**404（但后端直接访问正常）**
大概率是 proxy_pass 斜杠问题（见上）。对比着转发前后的 URL 看。

**WebSocket 断**
少配了 Upgrade/Connection 头（上面配置里有）。

## 八、安全两件套

```nginx
location /api/ {
    proxy_pass http://localhost:3000/;

    # 限流：单 IP 每秒 10 个请求（防刷）
    limit_req zone=api burst=20 nodelay;
}

# http 块里定义（server 外）
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

登录、短信这类敏感接口，Nginx 层先挡一层限流，
后端再细判。安全全景在 [Web 安全入门](../web-security.md)。

## 小结

反向代理三要素：**location 分流（静态/动态）、proxy_pass
转发（注意斜杠）、upstream 负载均衡（多实例）**。
配好 Nginx，Node 服务才能「像模像样」地对外服务。
本站没这需求（纯静态），但你的下一个全栈项目一定用得上。
