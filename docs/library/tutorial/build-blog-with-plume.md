---
title: 用 VuePress 2 + Plume 搭一个博客
createTime: 2026-10-21
permalink: /library/tutorial/build-blog-with-plume/
description: 从零到部署的完整过程，本站就是这么搭出来的，含踩坑记录
---

# 用 VuePress 2 + Plume 搭一个博客

这个站（精华社 · 藏经阁）本身就是用 VuePress 2 + Plume 主题搭的。
与其空谈理论，不如把搭建过程完整记下来 —— 你照着走一遍，
也能有一个属于自己的站。

## 一、为什么选这套组合

需求列一下：要能写**文档**（教程、笔记），要能写**博客**（随笔、动态），
要支持**本地搜索**，界面别太丑。逐个看：

- VuePress 默认主题：只有文档，没博客；
- VitePress：轻快，但插件生态和博客支持还嫩了点；
- Hexo：博客强，文档弱，主题质量参差；
- **VuePress 2 + Plume**：文档博客一把抓，配置 declarative，选中它。

Plume 是国人开发的主题，中文文档全，更新也勤，对中文站点友好。

## 二、初始化项目

```bash
mkdir my-blog && cd my-blog
npm init -y
npm install -D vuepress@next vue vuepress-theme-plume @vuepress/bundler-vite@next
```

`package.json` 里加两条脚本：

```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

目录结构：

```text
my-blog/
├── docs/
│   ├── .vuepress/
│   │   ├── config.ts        # 站点配置（核心）
│   │   └── public/          # 静态资源（图片、favicon）
│   └── README.md            # 首页
└── package.json
```

## 三、最小可用配置

`docs/.vuepress/config.ts`：

```ts
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '我的博客',
  description: '写点技术，记点笔记',
  theme: plumeTheme({
    hostname: 'https://example.com',
  }),
  bundler: viteBundler(),
})
```

然后 `npm run docs:dev`，浏览器开 `http://localhost:8080`，成了。
一个空站能跑了，接下来填内容。

## 四、理解 collections（集合）

Plume 的内容组织靠 `collections`，这是整个主题最核心的概念。
本站的配置：

```ts
collections: [
  { type: 'doc',  dir: 'tutorial',  title: '教程', sidebar: 'auto' },
  { type: 'doc',  dir: 'tech',      title: '技术', sidebar: 'auto' },
  { type: 'doc',  dir: 'resources', title: '资源', sidebar: 'auto' },
  { type: 'post', dir: 'blog',      title: '手札', link: '/blog/' },
],
```

- `type: 'doc'`：文档集合，`sidebar: 'auto'` 会按目录结构自动生成侧边栏 ——
  往目录里扔 md 文件，侧边栏自动更新，不用改配置；
- `type: 'post'`：博客集合，自动生成文章列表、标签页、归档页。

**目录即结构**。这是 Plume 最舒服的地方：写内容的人只管扔文件，
不用碰任何配置。

## 五、文章 frontmatter

每篇文章开头用 `---` 包一块元信息：

```yaml
---
title: Docker 快速上手
createTime: 2026-10-21
permalink: /tutorial/docker-start/
description: 镜像、容器、Dockerfile 入门，专治「我这明明能跑」
---
```

- `title`、`description`：标题和摘要（SEO 也读它）；
- `createTime`：创建时间，列表页按它排序；
- `permalink`：自定义链接。不写的话 Plume 会自动生成一个短哈希链接
  （能用，但不好看，建议显式写）。

博客文章还支持 `tags`、`sticky`（置顶）、`article` 等字段，按需加。

## 六、首页怎么拼

Plume 的首页是「积木式」的，在 `docs/README.md` 的 frontmatter 里
用 `config` 数组拼：

```yaml
---
home: true
config:
  - type: hero        # 首屏大标题 + 按钮
  - type: features    # 特色卡片
  - type: image-text  # 左图右文
  - type: text-image  # 左文右图
  - type: posts       # 最新文章列表
  - type: profile     # 个人资料卡
  - type: custom      # 自定义 Markdown
---
```

本站首页用了 hero（门头）、features（六张卡片）、image-text 和
text-image（两段图文）、posts（最新手札）、profile（站长名片）、
custom（内容分区表）。挑需要的用，五六个区块足够，别贪多。

## 七、部署

构建：

```bash
npm run docs:build
```

产物在 `docs/.vuepress/dist`，纯静态，随便找地方托管：

- **GitHub Pages**：把 dist 推到 `gh-pages` 分支，或者用 Actions 自动构建；
- **Vercel / Netlify**：连仓库，构建命令 `npm run docs:build`，
  输出目录 `docs/.vuepress/dist`，免费额度个人站够用；
- **自己的服务器**：Nginx 指到 dist 目录，配一下 `try_files $uri $uri/ /404.html;`
  让 SPA 路由正常工作。

## 八、踩坑记录（重点）

**坑一：中文必须配 `lang`**

```ts
lang: 'zh-CN',
```

不写这行，主题按英文渲染，满屏别扭。别问我是怎么知道的。

**坑二：Vite 8 下构建报 "No fs option provided to compileScript"**

新装的项目，npm 会自动给 `@vitejs/plugin-vue` 配上 Vite 8（rolldown 内核），
而这个环境探测不到 Node 的 `process`，编译主题自带的 Vue 组件时报错。
解法是在 `config.ts` 里手动给编译器注入文件系统：

```ts
bundler: viteBundler({
  vuePluginOptions: {
    script: {
      fs: {
        fileExists: (file) => existsSync(file),
        readFile: (file) => readFileSync(file, 'utf-8'),
      },
    },
  },
}),
```

（`import { existsSync, readFileSync } from 'node:fs'`）
本站 `config.ts` 里就是这么干的，带注释。

**坑三：dev 运行时会改写你的源文件**

Plume 的 `autoFrontmatter` 很贴心，会自动补全 frontmatter、规范化
`createTime`。但如果你在 dev server 运行时手动改文章 frontmatter，
两边可能打架，写出重复的行。**规矩：改 frontmatter 前先停 dev server**。

**坑四：图片路径**

文章里相对路径（`./images/a.png`）跟文章走；全站通用图（logo、头像）
放 `docs/.vuepress/public/`，用绝对路径（`/images/logo.svg`）引用。
两者混用会 404。

**坑五： permalink 短哈希**

不写 `permalink`，文章链接是 `/tutorial/a8f3k2/` 这种。能访问，
但分享出去像个钓鱼网站。花三十秒给每篇写上语义化 permalink，值。

## 九、本站的配置要点

抄作业时间，本站 `config.ts` 里这些值得看：

```ts
search: { provider: 'local' },    // 本地搜索，断网可用，不用接 Algolia
watermark: { enabled: true, content: '精华社 · 藏经阁' }, // 全站水印
cache: 'filesystem',              // 编译缓存，二次启动快很多
contributors: false,              // 没接 Git 仓库，关掉 Git 相关功能
```

## 小结

搭博客的完整链路：装依赖 → 写 config → 建 collections → 扔文章 →
拼首页 → build → 部署。真正的难点不在技术，在**开始写并且写下去**。
工具十分钟就能备好，内容才是那个旷日持久的工程。

本站就是这么来的。你现在看到的每一篇，都是这条流程的产物。
