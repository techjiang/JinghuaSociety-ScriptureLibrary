import type { PluginFunction } from '@vuepress/core'

/**
 * SEO 增强插件
 * ---------------------------------------------------------------
 * Plume 已按 hostname 生成 og:url / og:title / og:description，
 * 但**不会**生成 canonical、og:image 与结构化数据（JSON-LD）。
 * 这里补齐这几项，覆盖 Google / Bing / 百度 / 搜狗 / 360 / 神马 / 头条 的抓取需求：
 *
 *  1. canonical —— 规范链接，避免重复内容被拆分权重；
 *  2. og:image / twitter:image —— 社交分享封面；
 *  3. article:published_time —— 文章发布时间；
 *  4. JSON-LD 结构化数据 —— WebSite / Organization / Article，
 *     让搜索引擎在结果里显示站点名、Logo、发布时间等富媒体摘要。
 */

const HOSTNAME = 'https://jinghuasociety-scripturelibrary.asoe.cn'
const SITE_NAME = '精华社 · 藏经阁'
const OG_IMAGE = `${HOSTNAME}/images/og-cover.png`

type HeadItem = [string, Record<string, string>, string?]

const hasHead = (head: unknown, key: string, value: string): boolean =>
  Array.isArray(head) &&
  head.some(
    (item) =>
      Array.isArray(item) &&
      typeof item[1] === 'object' &&
      item[1] !== null &&
      item[1][key] === value
  )

export const seoPlugin: PluginFunction = () => ({
  name: 'jinghua-seo',

  extendsPage(page) {
    const fm = page.frontmatter as Record<string, any>
    const head: HeadItem[] = Array.isArray(fm.head) ? [...fm.head] : []
    const url = HOSTNAME + page.path

    // 单页可用 frontmatter `head` 自行覆盖；这里只补默认值
    if (!hasHead(head, 'rel', 'canonical')) {
      head.push(['link', { rel: 'canonical', href: url }])
    }

    if (!hasHead(head, 'property', 'og:image')) {
      head.push(['meta', { property: 'og:image', content: OG_IMAGE }])
      head.push(['meta', { property: 'og:image:width', content: '1200' }])
      head.push(['meta', { property: 'og:image:height', content: '630' }])
      head.push(['meta', { property: 'og:image:alt', content: SITE_NAME }])
    }

    const createTime = fm.createTime ?? fm.date
    if (createTime && !Number.isNaN(new Date(createTime).getTime())) {
      head.push([
        'meta',
        { property: 'article:published_time', content: new Date(createTime).toISOString() },
      ])
    }

    // ==================== JSON-LD 结构化数据 ====================
    // 首页：WebSite（含站内搜索 Action）+ Organization
    if (page.path === '/' || fm.home) {
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              name: SITE_NAME,
              url: `${HOSTNAME}/`,
              inLanguage: 'zh-CN',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${HOSTNAME}/?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@type': 'Organization',
              name: SITE_NAME,
              url: `${HOSTNAME}/`,
              logo: `${HOSTNAME}/images/logo.svg`,
              sameAs: ['https://github.com/techjiang/JinghuaSociety-ScriptureLibrary'],
            },
          ],
        }),
      ])
    }

    // 文章/文库内容页：Article
    if (!fm.home && page.path !== '/' && page.path !== '/404.html') {
      const isPost = String(page.path).startsWith('/articles/')
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': isPost ? 'BlogPosting' : 'Article',
          headline: String(page.title || SITE_NAME),
          description: String(fm.description || ''),
          image: OG_IMAGE,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          author: { '@type': 'Organization', name: SITE_NAME },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: { '@type': 'ImageObject', url: `${HOSTNAME}/images/logo.svg` },
          },
          ...(createTime ? { datePublished: new Date(createTime).toISOString() } : {}),
        }),
      ])
    }

    fm.head = head
  },
})
