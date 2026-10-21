import { existsSync, readFileSync } from 'node:fs'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

// GitHub Pages 项目页部署在 /JinghuaSociety-ScriptureLibrary/ 子路径下，
// 生产构建时 base 必须是该子路径，本地开发时用根路径。
// vuepress dev docs → argv[2] = 'dev'；vuepress build docs → argv[2] = 'build'
const command = process.argv[2] ?? ''
const isBuild = command === 'build'

export default defineUserConfig({
  // ==================== 站点基础信息 ====================
  lang: 'zh-CN',
  base: isBuild ? '/JinghuaSociety-ScriptureLibrary/' : '/',
  title: '精华社 · 藏经阁',
  description: '计算机、互联网与信息技术 —— 教程、技术笔记与资源整理，写给正在路上的人',

  head: [
    ['link', { rel: 'icon', href: isBuild ? '/JinghuaSociety-ScriptureLibrary/favicon.svg' : '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'author', content: '精华社' }],
  ],

  theme: plumeTheme({
    // ==================== 站点级配置 ====================
    // 部署域名：配置后自动生成 sitemap 与 SEO 信息
    hostname: 'https://techjiang.github.io/JinghuaSociety-ScriptureLibrary',

    // 编译缓存，加快重复启动速度
    cache: 'filesystem',

    // 本地搜索（基于 minisearch，离线可用）
    search: { provider: 'local' },

    // 未接入 Git 仓库，关闭依赖 Git 的功能
    contributors: false,
    editLink: false,
    lastUpdated: false,

    // 全站水印
    watermark: {
      enabled: true,
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
        text: '教程',
        link: '/tutorial/',
        icon: 'material-symbols:school-outline',
        activeMatch: '^/tutorial/',
      },
      {
        text: '技术',
        link: '/tech/',
        icon: 'material-symbols:code-blocks-outline',
        activeMatch: '^/tech/',
      },
      {
        text: '资源',
        link: '/resources/',
        icon: 'material-symbols:folder-special-outline',
        activeMatch: '^/resources/',
      },
      {
        text: '手札',
        link: '/blog/',
        icon: 'material-symbols:edit-document-outline',
        activeMatch: '^/blog/',
      },
    ],

    // 社交链接（github 会同时出现在导航栏）
    social: [
      { icon: 'mdi:github', link: 'https://github.com/example', ariaLabel: 'GitHub' },
      { icon: 'mdi:email-outline', link: 'mailto:jinghua@example.com', ariaLabel: '电子邮箱' },
    ],
    navbarSocialInclude: ['github'],

    // ==================== 内容集合 ====================
    // 教程、技术、资源为文档集合；手札为博客集合
    collections: [
      {
        type: 'doc',
        dir: 'tutorial',
        title: '教程',
        sidebar: 'auto',
        sidebarScrollbar: true,
        sidebarCollapsed: false,
      },
      {
        type: 'doc',
        dir: 'tech',
        title: '技术',
        sidebar: 'auto',
        sidebarScrollbar: true,
        sidebarCollapsed: false,
      },
      {
        type: 'doc',
        dir: 'resources',
        title: '资源',
        sidebar: 'auto',
        sidebarScrollbar: true,
        sidebarCollapsed: false,
      },
      {
        type: 'post',
        dir: 'blog',
        title: '手札',
        link: '/blog/',
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
