import { defineClientConfig } from 'vuepress/client'
import FeaturedLinkGo from './components/FeaturedLinkGo.vue'
import FeaturedLinkList from './components/FeaturedLinkList.vue'
import FeaturedLinkPanel from './components/FeaturedLinkPanel.vue'
import UpdatesFeed from './components/UpdatesFeed.vue'
import CategoryTag from './components/CategoryTag.vue'

export default defineClientConfig({
  enhance({ app }) {
    // 精链（FeaturedLink）：/go 随机跳转 + 成员列表
    app.component('FeaturedLinkGo', FeaturedLinkGo)
    app.component('FeaturedLinkList', FeaturedLinkList)
    app.component('FeaturedLinkPanel', FeaturedLinkPanel)
    // 动态页：自动更新的时间线（数据来自构建期生成的 /updates.json）
    app.component('UpdatesFeed', UpdatesFeed)
    // 文库文章顶部「所属分类」标签
    app.component('CategoryTag', CategoryTag)
  },
})
