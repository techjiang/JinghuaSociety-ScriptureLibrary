---
title: 免费部署方案对比：Pages、Netlify、Vercel、Cloudflare
createTime: 2026-10-22
permalink: /library/tutorial/static-deploy-free/
description: 四个主流免费静态托管怎么选，附本站的部署选择理由
---

<CategoryTag name="教程" link="/library/tutorial/" />

# 免费部署方案对比：Pages、Netlify、Vercel、Cloudflare

网站做好了，放哪？四个免费主流：**GitHub Pages、Netlify、
Vercel、Cloudflare Pages**。个人项目全免费，但各有脾气。
这篇横向对比，帮你（和未来的我）少纠结。

## 一、一张对比表

| | GitHub Pages | Netlify | Vercel | Cloudflare Pages |
| --- | --- | --- | --- | --- |
| 免费额度 | 100GB 带宽/月 | 100GB 带宽/月 | 100GB 带宽/月 | **不限**带宽 |
| 构建时长 | 2000 分钟/月 | 300 分钟/月 | 6000 分钟/月 | 500 次/月 |
| 自定义域名 | ✅ | ✅ | ✅ | ✅ |
| HTTPS | ✅ 自动 | ✅ 自动 | ✅ 自动 | ✅ 自动 |
| 国内访问 | 慢（被墙过） | 一般 | 一般 | 看运气 |
| CI 构建 | Actions（可编程） | 内置 | 内置 | 内置 |
| 适合 | 开源项目 | 个人站 | 前端框架 | 流量站 |

## 二、逐个说

### GitHub Pages（本站用的）

**怎么工作**：push 到 GitHub → Actions 自动构建 → 发布到 Pages。

**优点**：

- 代码和网站在一起，开源项目「顺便就有官网」；
- Actions 完全可编程（本站的 RSS、sitemap 都是自己脚本生成的）；
- 稳定，GitHub 不倒它不倒。

**缺点**：

- 国内访问慢（时好时坏，看缘分）；
- 构建排队（高峰期等几分钟）；
- 只有静态（没有 serverless 函数）。

### Netlify

**优点**：

- 拖拽文件夹就能部署（零配置，本地 build 完拖上去）；
- 内置表单处理、身份认证（免费档有限额）；
- 回滚一键（每次部署都是快照）。

**缺点**：国内一般；免费档构建分钟数少（300/月）；
大项目构建可能超时。

### Vercel

**优点**：

- 前端框架支持最好（Next.js 亲儿子，零配置）；
- 预览部署（每个 PR 自动生成预览链接，评审神器）；
- 边缘网络快。

**缺点**：国内一般；商用要付费（条款严格）；
非 Vercel 生态的项目优势不大。

### Cloudflare Pages

**优点**：

- **带宽不限量**（其他家超了要付费）；
- Cloudflare 全球 CDN 网络，速度快；
- 和 Workers（serverless）无缝配合。

**缺点**：免费档每月 500 次构建（超了等）；
国内访问看 IP（Cloudflare 的国内线路不稳定）。

## 三、怎么选：决策树

```text
你的项目是？
├─ 开源项目，代码在 GitHub → GitHub Pages（省事，一起管）
├─ 个人博客，想要拖拽即部署 → Netlify
├─ Next.js / 前端框架项目 → Vercel
├─ 预计流量大（图片站/下载站）→ Cloudflare Pages（不限带宽）
└─ 国内用户为主 → 都不合适，看下面
```

## 四、国内访问的真相

四个都部署在境外 CDN，国内访问都看缘分：

- **GitHub Pages**：间歇性抽风，有时完全打不开；
- **Cloudflare**：部分 IP 走国内节点（快），部分绕美国（慢）；
- **Netlify/Vercel**：中等，偶尔被运营商 QoS。

**真要服务国内用户**：

1. **国内云 + 备案**：阿里云 OSS / 腾讯云 COS 静态托管，
   备案后 CDN 加速，体验最好（要域名备案，个人可以）；
2. **Gitee Pages**：国内访问快，但规则多（要实名、更新审核、
   不能放外链），适合「展示用」；
3. **EdgeOne / CDN 中转**：技术向方案，成本低。

本站选 GitHub Pages：内容技术站，读者能翻墙或看镜像，
先解决「有」和「免费稳定」，流量大了再迁。

## 五、迁移成本：几乎为零

四家都是「连 git 仓库，自动构建」。以本站为例，
想从 Pages 迁到 Netlify：

1. Netlify 注册 → New site from Git → 选仓库；
2. Build command: `npm run docs:build`；
3. Publish directory: `docs/.vuepress/dist`；
4. Deploy。完事。

**域名解绑旧家、绑新家**，DNS 改个 CNAME。
内容不动、构建命令不动。这就是静态站的优势 ——
**没有服务器依赖，说走就走**。

## 六、部署前检查清单

不管选哪家：

- [ ] `base` 配置对（项目页要带子路径，自定义域名用 `/`）；
- [ ] `hostname` 配置对（sitemap/SEO 用）；
- [ ] 404 页面有（VuePress 自动生成）；
- [ ] favicon 是绝对路径能访问的；
- [ ] 构建命令在本地跑通过再推；
- [ ] `.gitignore` 挡住了 `node_modules` 和构建产物。

## 小结

个人项目四选一：**开源项目 Pages、框架项目 Vercel、
省心拖拽 Netlify、大流量 Cloudflare**。国内用户另说
（国内云+备案）。别纠结，先上一个 —— 部署这事儿，
完成比完美重要，反正随时能迁。
