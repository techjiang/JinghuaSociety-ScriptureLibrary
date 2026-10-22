import { defineClientConfig } from 'vuepress/client'
import Announcement from './components/Announcement.vue'

export default defineClientConfig({
  rootComponents: [Announcement],
})
