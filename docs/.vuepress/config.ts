import { existsSync, readFileSync } from 'node:fs'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { rssPlugin } from './plugins/rss'

// GitHub Pages 项目页部署在 /JinghuaSociety-ScriptureLibrary/ 子路径下，
// 生产构建时 base 必须是该子路径，本地开发时用根路径。
const command = process.argv[2] ?? ''
const isBuild = command === 'build'
const BASE = '/JinghuaSociety-ScriptureLibrary/'

export default defineUserConfig({
  // ==================== 站点基础信息 ====================
  lang: 'zh-CN',
  base: isBuild ? BASE : '/',
  title: '精华社 · 藏经阁',
  description: '藏技术菁华，见字节山河 —— 把计算机与互联网技术，讲成听得懂的人话。',

  head: [
    // 导航栏 logo 与标签页图标同源，保证完全同步
    ['link', { rel: 'icon', href: '/images/logo.svg', type: 'image/svg+xml' }],
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
    hostname: 'https://techjiang.github.io/JinghuaSociety-ScriptureLibrary',

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
    footer: {
      message: '计算机 · 互联网 · 信息技术',
      copyright: 'Copyright © 2026-present 精华社 · 藏经阁',
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
