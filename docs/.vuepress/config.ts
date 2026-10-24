import { existsSync, readFileSync } from 'node:fs'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { rssPlugin } from './plugins/rss'
import { seoPlugin } from './plugins/seo'
import { updatesPlugin } from './plugins/updates'

// 已绑定自定义域名 jinghuasociety-scripturelibrary.asoe.cn，
// 站点在该域名「根路径」下提供服务，因此 base 固定为根路径 '/'。
// （自定义域名下不能再使用 /JinghuaSociety-ScriptureLibrary/ 子路径，
//  否则所有 CSS/JS/图片资源都会 404，整站白屏。）
const command = process.argv[2] ?? ''
const isBuild = command === 'build'
const BASE = '/'

export default defineUserConfig({
  // ==================== 站点基础信息 ====================
  lang: 'zh-CN',
  base: BASE,
  title: '精华社 · 藏经阁',
  description: '藏技术菁华，见字节山河',

  head: [
    // ==================== 图标 ====================
    // 导航栏 logo 与标签页图标同源，保证完全同步
    // 注意：VuePress 不会给 head 里的 link href 自动加 base 前缀，
    // 构建时必须手动带上子路径，否则 Pages 下 favicon 404
    ['link', { rel: 'icon', href: isBuild ? `${BASE}images/logo.svg` : '/images/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],

    // ==================== 基础信息 ====================
    ['meta', { name: 'theme-color', content: '#c0392b' }],
    ['meta', { name: 'author', content: '精华社' }],
    ['meta', { name: 'publisher', content: '精华社 · 藏经阁' }],
    ['meta', { name: 'copyright', content: 'Copyright © 2026 精华社 · 藏经阁' }],
    ['meta', { name: 'rating', content: 'general' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          '精华社,藏经阁,技术博客,编程教程,前端开发,后端开发,计算机网络,HTTP,TCP,TLS,MySQL,Redis,Linux,运维,开发者工具,资源推荐,编程随笔,生活日常,程序员,独立博客',
      },
    ],

    // ==================== 搜索引擎抓取控制 ====================
    // 全站默认收录并跟随；单个页面想不收录，可在该页 frontmatter 里用 head 覆盖为 noindex
    [
      'meta',
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    ],
    ['meta', { name: 'googlebot', content: 'index, follow' }],
    ['meta', { name: 'bingbot', content: 'index, follow' }],
    ['meta', { name: 'baiduspider', content: 'index, follow' }],
    ['meta', { name: 'sogou spider', content: 'index, follow' }],
    ['meta', { name: '360Spider', content: 'index, follow' }],
    ['meta', { name: 'YandexBot', content: 'index, follow' }],

    // ==================== 各搜索引擎站长平台验证 ====================
    // 在对应平台添加站点后会拿到一段验证码，替换下面各项的 value 即可生效。
    // Google Search Console →「HTML 标记」方式
    ['meta', { name: 'google-site-verification', content: 'REPLACE_WITH_GOOGLE_VERIFICATION_CODE' }],
    // Bing 站长工具 → meta 标记（原名 msvalidate.01）
    ['meta', { name: 'msvalidate.01', content: 'REPLACE_WITH_BING_VERIFICATION_CODE' }],
    // 百度搜索资源平台 → HTML 标签验证
    ['meta', { name: 'baidu-site-verification', content: 'REPLACE_WITH_BAIDU_VERIFICATION_CODE' }],
    // 搜狗站长平台
    ['meta', { name: 'sogou_site_verification', content: 'REPLACE_WITH_SOGOU_VERIFICATION_CODE' }],
    // 360 站长平台
    ['meta', { name: '360-site-verification', content: 'REPLACE_WITH_360_VERIFICATION_CODE' }],
    // 神马搜索（UC）
    ['meta', { name: 'shenma-site-verification', content: 'REPLACE_WITH_SHENMA_VERIFICATION_CODE' }],
    // 头条搜索
    ['meta', { name: 'toutiao_site_verification', content: 'REPLACE_WITH_TOUTIAO_VERIFICATION_CODE' }],

    // ==================== Open Graph（微信 / QQ / 微博 / Facebook 等）====================
    // og:url / og:title / og:description 由 Plume 按 hostname 逐页生成，这里只补站点级字段
    ['meta', { property: 'og:site_name', content: '精华社 · 藏经阁' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    // og:image 由 seo.ts 插件逐页补齐（含 width/height/alt），此处仅作兜底

    // ==================== Twitter / X Card ====================
    // 只给卡片类型与封面；标题/描述回落到 og:title / og:description，避免两处不一致
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    [
      'meta',
      { name: 'twitter:image', content: 'https://jinghuasociety-scripturelibrary.asoe.cn/images/og-cover.png' },
    ],

    // ==================== RSS 自动发现 ====================
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: '精华社 · 藏经阁 RSS',
        href: isBuild ? `${BASE}rss.xml` : '/rss.xml',
      },
    ],
  ],

  plugins: [
    rssPlugin,
    seoPlugin,
    updatesPlugin,
  ],

  theme: plumeTheme({
    // ==================== 站点级配置 ====================
    // 站点正式域名（自定义域名）。canonical/og:url/sitemap/RSS 都用它。
    hostname: 'https://jinghuasociety-scripturelibrary.asoe.cn',

    // Sitemap：Plume 内置 @vuepress/plugin-sitemap，hostname 自动取自上面的 hostname。
    // 会生成 sitemap.xml + sitemap.xsl，并自动向 robots.txt 追加 Sitemap 行。
    sitemap: {
      changefreq: 'weekly',
      excludePaths: ['/404.html', '/go/'],
    },

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
        text: '精华',
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
        text: '精链',
        icon: 'material-symbols:hub-outline',
        activeMatch: '^(/go/|/featured-link)',
        items: [
          { text: '启动', link: '/go/', icon: 'material-symbols:rocket-launch-outline' },
          { text: '加入', link: '/featured-link/', icon: 'material-symbols:add-link-outline' },
          { text: '成员', link: '/featured-link/members/', icon: 'material-symbols:groups-outline' },
        ],
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
          { text: '动态', link: '/updates/' },
          { text: '名人堂', link: '/hall-of-fame/' },
          { text: '荣誉榜', link: '/honor-roll/' },
          { text: '历史公告', link: '/announcements/' },
          { text: '加入', link: '/join/' },
          { text: '成员名单', link: '/members/' },
        ],
      },
    ],

    // 社交链接（github 会同时出现在导航栏）
    social: [
      { icon: 'mdi:github', link: 'https://github.com/example', ariaLabel: 'GitHub' },
      { icon: 'mdi:email-outline', link: 'mailto:jinghua@example.com', ariaLabel: '电子邮箱' },
    ],
    navbarSocialInclude: ['github'],

    // ==================== 全站公告（Plume 内置 bulletin）====================
    // 默认所有页面展示；关闭后由 localStorage 记住（lifetime: 'once'）。
    // 想换文案时改 id 即可重新弹出。布局可选 top-left/top-right/bottom-left/bottom-right/center。
    bulletin: {
      // 更换 id 可让公告对所有老访客重新弹出（localStorage 以 id 为记忆键）
      id: 'v5-20261024-founding',
      title: '公告',
      content: '精华社 · 藏经阁 在2026年10月20日正式成立！',
      layout: 'top-right',
      border: true,
      // 'always'：成立公告常驻显示，关掉后刷新仍会重新弹出，不再“闪一下就消失”
      lifetime: 'always',
    },
    bulletinLabel: '公告',
    closeLabel: '关闭',

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
        title: '精华',
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
        `<span class="jh-footer-slogan">藏技术菁华，见字节山河</span>` +
        ` · <a class="jh-footer-rss" href="/rss.xml">RSS 订阅</a>`,
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
