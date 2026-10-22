import { existsSync, readFileSync } from 'node:fs'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { rssPlugin } from './plugins/rss'

// 已绑定自定义域名 jinghuasociety-scripturelibrary.asoe.cn，
// 站点在该域名「根路径」下提供服务，因此 base 固定为根路径 '/'。
// （自定义域名下不能再使用 /JinghuaSociety-ScriptureLibrary/ 子路径，
//  否则所有 CSS/JS/图片资源都会 404，整站白屏。）
const command = process.argv[2] ?? ''
const isBuild = command === 'build'
const BASE = '/'
// 页脚 HTML 里的站内链接前缀（根路径下为空）
const LINK_PREFIX = ''

export default defineUserConfig({
  // ==================== 站点基础信息 ====================
  lang: 'zh-CN',
  base: BASE,
  title: '精华社 · 藏经阁',
  description: '藏技术菁华，见字节山河',

  head: [
    // 导航栏 logo 与标签页图标同源，保证完全同步
    // 注意：VuePress 不会给 head 里的 link href 自动加 base 前缀，
    // 构建时必须手动带上子路径，否则 Pages 下 favicon 404
    ['link', { rel: 'icon', href: isBuild ? `${BASE}images/logo.svg` : '/images/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#c0392b' }],
    ['meta', { name: 'author', content: '精华社' }],
    // RSS 自动发现：浏览器/阅读器检测到地址栏图标即可订阅
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: '精华社 · 藏经阁 RSS',
        href: isBuild ? `${BASE}feed.xml` : '/feed.xml',
      },
    ],
  ],

  plugins: [rssPlugin],

  theme: plumeTheme({
    // ==================== 站点级配置 ====================
    // 站点正式域名（自定义域名）。canonical/og:url/sitemap/RSS 都用它。
    hostname: 'https://jinghuasociety-scripturelibrary.asoe.cn',

    // 编译缓存，加快重复启动速度
    cache: 'filesystem',

    // 本地搜索（基于 minisearch，离线可用）
    search: { provider: 'local' },

    // 未接入 Git 仓库，关闭依赖 Git 的功能
    contributors: false,
    editLink: false,
    lastUpdated: false,

    // 全站水印（已按要求关闭）
    watermark: {
      enabled: false,
      fullPage: true,
      content: '精华社 · 藏经阁',
      opacity: 0.06,
      rotate: -22,
      gap: 120,
    },

    // ==================== 导航栏 ====================
    home: '/',
    logo: '/images/logo.svg',

    navbar: [
      { text: '首页', link: '/', icon: 'material-symbols:cottage-outline' },
      {
        text: '文库',
        link: '/library/',
        icon: 'material-symbols:menu-book-outline',
        activeMatch: '^/library/',
      },
      {
        text: '文章',
        link: '/articles/',
        icon: 'material-symbols:edit-document-outline',
        activeMatch: '^/articles/',
      },
      {
        text: '友链',
        link: '/links/',
        icon: 'material-symbols:link-rounded',
        activeMatch: '^/links/',
      },
      {
        text: '关于',
        link: '/about/',
        icon: 'material-symbols:info-outline',
        activeMatch: '^/about/',
      },
      {
        text: '阁中阁',
        icon: 'material-symbols:groups-outline',
        items: [
          { text: '名人堂', link: '/hall-of-fame/' },
          { text: '加入', link: '/join/' },
          { text: '成员', link: '/members/' },
        ],
      },
    ],

    // 社交链接（github 会同时出现在导航栏）
    social: [
      { icon: 'mdi:github', link: 'https://github.com/example', ariaLabel: 'GitHub' },
      { icon: 'mdi:email-outline', link: 'mailto:jinghua@example.com', ariaLabel: '电子邮箱' },
    ],
    navbarSocialInclude: ['github'],

    // ==================== 内容集合 ====================
    // 文库：教程/技术/资源三个文档分区（侧边栏默认折叠）
    // 文章：独立博客集合（列表/标签/归档）
    collections: [
      {
        type: 'doc',
        dir: 'library',
        title: '文库',
        link: '/library/',
        sidebarScrollbar: true,
        sidebar: [
          {
            text: '教程',
            icon: 'material-symbols:school-outline',
            prefix: 'tutorial/',
            items: 'auto',
            collapsed: true,
          },
          {
            text: '技术',
            icon: 'material-symbols:code-blocks-outline',
            prefix: 'tech/',
            items: 'auto',
            collapsed: true,
          },
          {
            text: '资源',
            icon: 'material-symbols:folder-special-outline',
            prefix: 'resources/',
            items: 'auto',
            collapsed: true,
          },
          {
            text: '日常',
            icon: 'material-symbols:sunny',
            prefix: 'daily/',
            items: 'auto',
            collapsed: true,
          },
        ],
      },
      {
        type: 'post',
        dir: 'articles',
        title: '文章',
        link: '/articles/',
        autoFrontmatter: { permalink: true },
        postCover: 'right',
        pagination: 10,
        tags: true,
        archives: true,
        categories: true,
        profile: {
          avatar: '/images/avatar.svg',
          name: '站长',
          description: '写点技术，记点笔记，踩点坑',
          location: '中国 · 互联网',
          organization: '精华社',
          layout: 'left',
        },
      },
    ],

    // ==================== 文章页配置 ====================
    createTime: true,
    prevPage: true,
    nextPage: true,
    readingTime: true,
    copyCode: true,
    outline: [2, 3],
    aside: true,
    externalLinkIcon: true,

    // ==================== 页脚 ====================
    // message/copyright 均支持 HTML（主题 v-html 渲染）
    // 注意：HTML 里的站内链接要带 base 前缀，否则 Pages 子路径下 404
    footer: {
      message:
        `<nav class="jh-footer-nav" aria-label="页脚导航">` +
        `<span class="jh-footer-nav-title">阁中阁</span>` +
        `<a href="${LINK_PREFIX}/hall-of-fame/">名人堂</a>` +
        `<a href="${LINK_PREFIX}/join/">加入</a>` +
        `<a href="${LINK_PREFIX}/members/">成员</a>` +
        `<span class="jh-footer-nav-title">关于本站</span>` +
        `<a href="${LINK_PREFIX}/about/">关于</a>` +
        `<a href="${LINK_PREFIX}/links/">友链</a>` +
        `</nav>` +
        `<span class="jh-footer-slogan">藏技术菁华，见字节山河</span>`,
      copyright: 'Copyright © 2026 精华社 · 藏经阁',
    },
  }),

  bundler: viteBundler({
    // vite 8 (rolldown) 的构建环境中无法自动探测 Node 的 process，
    // 导致 @vue/compiler-sfc 编译主题 SFC 的泛型 props 时报
    // "No fs option provided to compileScript"。
    // 此处显式为 compileScript 注入文件系统访问。
    vuePluginOptions: {
      script: {
        fs: {
          fileExists: (file) => existsSync(file),
          readFile: (file) => readFileSync(file, 'utf-8'),
        },
      },
    },
  }),
})
