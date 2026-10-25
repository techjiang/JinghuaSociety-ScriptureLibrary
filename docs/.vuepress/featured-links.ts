/**
 * 「精链 FeaturedLink」成员数据
 * ----------------------------------------------------------------
 * 这是一个精选独立站点之「环」（灵感来自「开往」）。
 *
 * 想加入？两步：
 *   1) 在你的站点上先放好「精链」徽章（见 /featured-link/ 页的 HTML 片段，
 *      徽章指向 https://eslibrary.asoe.cn/go/）；
 *   2) 在此数组追加一条你的站点信息，提交 Pull Request 即可。
 *
 * 硬性规定：加入精链，必须也添加精链的友情链接（即挂上精链徽章）。
 * 未回链的站点不予收录——因为「环」需要彼此挂链才能串起来。
 *
 * 跳转路由 /go/（docs/go.md 的 permalink）可改：想换路径，改 go.md 的
 * permalink 与下面徽章里的地址保持一致即可。
 */

export interface FeaturedLinkSite {
  /** 站点名称 */
  name: string
  /** 站点地址（建议首页）。/go 会随机跳到这里的某一个 */
  url: string
  /** 一句话简介 */
  desc: string
  /** 分组类别，用于成员列表展示 */
  category: string
  /**
   * 站点图标/头像地址（建议 1:1，如 favicon、logo）。
   * 成员瓷砖为正方形，图片以 cover 方式裁切填充；
   * 不填则回退显示站点名首字。
   */
  icon?: string
  /**
   * 是否为示例占位。提交 PR 时请替换为真实成员，或删除该条。
   * /go 随机跳转时会自动跳过示例成员。
   */
  example?: boolean
  /**
   * 是否为「环」的发起/当前站点自身。/go 随机跳转时会自动跳过自身，
   * 避免出现“点了精链又跳回自己站点”的死循环；
   * 当除自身外没有其它成员时，/go 会进入“招募首批成员”状态。
   */
  self?: boolean
}

export const featuredLinks: FeaturedLinkSite[] = [
  {
    name: '精华社 · 藏经阁',
    url: 'https://eslibrary.asoe.cn/',
    desc: '藏技术菁华，见字节山河。把计算机与互联网技术，讲成人话。',
    category: '技术',
    icon: 'https://eslibrary.asoe.cn/images/logo.svg',
    self: true,
  },
]
