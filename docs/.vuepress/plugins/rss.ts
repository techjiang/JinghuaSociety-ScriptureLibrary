import type { PluginFunction } from '@vuepress/core'

/**
 * RSS 2.0 订阅源生成插件
 *
 * Plume 主题没有内置 RSS，这里自己写一个：
 * 构建结束时遍历所有页面，取最新 20 篇生成 feed.xml。
 */

const HOSTNAME = 'https://techjiang.github.io/JinghuaSociety-ScriptureLibrary'
const SITE_TITLE = '精华社 · 藏经阁'
const SITE_DESC = '藏技术菁华，见字节山河 —— 把计算机与互联网技术，讲成听得懂的人话。'

const esc = (s: string): string =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const rssPlugin: PluginFunction = () => ({
  name: 'jinghua-rss',

  async onGenerated(app) {
    const fs = await import('node:fs')
    const path = await import('node:path')

    const items = app.pages
      .filter((p) => {
        const fm = p.frontmatter as Record<string, any>
        return !fm.home && !fm.friends && p.path !== '/404.html' && p.path !== '/'
      })
      .map((p) => {
        const fm = p.frontmatter as Record<string, any>
        return {
          title: String(p.title || p.path),
          link: HOSTNAME + p.path,
          date: fm.createTime ? new Date(fm.createTime) : new Date(),
          desc: String(fm.description || ''),
        }
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 20)

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
      `  <channel>\n` +
      `    <title>${esc(SITE_TITLE)}</title>\n` +
      `    <link>${HOSTNAME}/</link>\n` +
      `    <description>${esc(SITE_DESC)}</description>\n` +
      `    <language>zh-CN</language>\n` +
      `    <atom:link href="${HOSTNAME}/feed.xml" rel="self" type="application/rss+xml" />\n` +
      items
        .map(
          (i) =>
            `    <item>\n` +
            `      <title>${esc(i.title)}</title>\n` +
            `      <link>${i.link}</link>\n` +
            `      <guid isPermaLink="true">${i.link}</guid>\n` +
            `      <pubDate>${i.date.toUTCString()}</pubDate>\n` +
            `      <description>${esc(i.desc)}</description>\n` +
            `    </item>`
        )
        .join('\n') +
      `\n  </channel>\n</rss>\n`

    const dest = app.dir.dest()
    fs.writeFileSync(path.join(dest, 'feed.xml'), xml, 'utf8')
    console.log(`[rss] feed.xml generated with ${items.length} items`)
  },
})
