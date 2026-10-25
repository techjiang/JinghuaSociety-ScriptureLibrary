import type { PluginFunction } from '@vuepress/core'

/**
 * 去掉 sitemap.xml 里的 XSLT 引用，避免浏览器弹出
 * “此网站使用 XSLT；该功能将从此浏览器中移除”的弃用告警。
 *
 * 背景：@vuepress/plugin-sitemap 会硬编码注入
 *   <?xml-stylesheet type="text/xsl" href=".../sitemap.xsl"?>
 * 并同时生成 sitemap.xsl 用于浏览器美化渲染。现代浏览器（Chrome）
 * 正在弃用 XSLT，访问 sitemap.xml 就会弹这个提示（搜索引擎不在意渲染）。
 * 这里在构建结束时把那行处理指令剥掉，并删掉用不到的 sitemap.xsl。
 */
export const sitemapCleanPlugin: PluginFunction = () => ({
  name: 'jinghua-sitemap-clean',

  async onGenerated(app) {
    const fs = await import('node:fs')
    const path = await import('node:path')

    const dest = app.dir.dest()
    const xmlPath = path.join(dest, 'sitemap.xml')
    if (fs.existsSync(xmlPath)) {
      const s = fs.readFileSync(xmlPath, 'utf8').replace(
        /<\?xml-stylesheet[^>]*\?>\s*/i,
        ''
      )
      fs.writeFileSync(xmlPath, s, 'utf8')
    }

    const xslPath = path.join(dest, 'sitemap.xsl')
    if (fs.existsSync(xslPath)) {
      fs.unlinkSync(xslPath)
    }

    console.log('[sitemap-clean] removed XSLT stylesheet reference from sitemap.xml')
  },
})
