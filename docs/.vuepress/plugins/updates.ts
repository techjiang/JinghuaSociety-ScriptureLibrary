import type { PluginFunction } from '@vuepress/core'

/**
 * 「动态」数据插件
 * ---------------------------------------------------------------
 * 构建结束时遍历所有页面，抽取标题 / 路径 / 时间 / 所属分类，
 * 按时间倒序写入 `updates.json`，由 <UpdatesFeed /> 在 /updates/ 页渲染。
 *
 * 这样「动态」页的列表是**自动生成**的（不用手维护），
 * 而 md 页面里的说明、置顶公告等仍由管理者自由编辑。
 */

const HOSTNAME = 'https://eslibrary.asoe.cn'

interface UpdateItem {
  title: string
  path: string
  url: string
  date: string
  category: string
  type: string
  description: string
}

interface RawItem extends UpdateItem {
  _ts: number
}

const CATEGORY_RULES: [RegExp, string, string][] = [
  [/^\/library\/tutorial\//, '教程', '文库'],
  [/^\/library\/tech\//, '技术', '文库'],
  [/^\/library\/resources\//, '资源', '文库'],
  [/^\/library\/daily\//, '日常', '文库'],
  [/^\/articles\//, '精华', '精华'],
]

export const updatesPlugin: PluginFunction = () => ({
  name: 'jinghua-updates',

  async onGenerated(app) {
    const fs = await import('node:fs')
    const path = await import('node:path')

    const raws: RawItem[] = app.pages
      .map((page) => {
        const fm = page.frontmatter as Record<string, any>
        const rawDate = fm.createTime ?? fm.date ?? fm.updatedTime
        const d = rawDate ? new Date(rawDate) : null
        const valid = d !== null && !Number.isNaN(d.getTime())

        let category = '站内'
        let type = '页面'
        for (const [re, cat, t] of CATEGORY_RULES) {
          if (re.test(page.path)) {
            category = cat
            type = t
            break
          }
        }

        return {
          title: String(page.title || page.path),
          path: page.path,
          url: HOSTNAME + page.path,
          date: valid ? (d as Date).toISOString().slice(0, 10) : '',
          category,
          type,
          description: String(fm.description || ''),
          _ts: valid ? (d as Date).getTime() : 0,
        }
      })
      .filter(
        (item) =>
          item._ts > 0 &&
          item.path !== '/' &&
          item.path !== '/404.html' &&
          !item.path.startsWith('/go') &&
          !item.path.startsWith('/featured-link')
      )
      .sort((a, b) => b._ts - a._ts)
      .slice(0, 200)

    const items: UpdateItem[] = raws.map(({ _ts, ...rest }) => rest)

    const dest = app.dir.dest()
    fs.writeFileSync(path.join(dest, 'updates.json'), JSON.stringify(items), 'utf8')
    console.log(`[updates] updates.json generated with ${items.length} items`)
  },
})
