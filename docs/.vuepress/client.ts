import { defineClientConfig } from 'vuepress/client'
import FeaturedLinkGo from './components/FeaturedLinkGo.vue'
import FeaturedLinkList from './components/FeaturedLinkList.vue'

export default defineClientConfig({
  enhance({ app }) {
    // 精链（FeaturedLink）：/go 随机跳转 + 成员列表
    app.component('FeaturedLinkGo', FeaturedLinkGo)
    app.component('FeaturedLinkList', FeaturedLinkList)
  },
})
