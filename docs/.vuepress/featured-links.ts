/**
 * 「精链 FeaturedLink」成员数据
 * ----------------------------------------------------------------
 * 这是一个精选独立站点之「环」（灵感来自「开往」）。
 *
 * 想加入？两步：
 *   1) 在你的站点上先放好「精链」徽章（见 /featured-link/ 页的 HTML 片段，
 *      徽章指向 https://jinghuasociety-scripturelibrary.asoe.cn/go/）；
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
   * 是否为示例占位。提交 PR 时请替换为真实成员，或删除该条。
   * /go 随机跳转时会自动跳过示例成员。
   */
  example?: boolean
}

export const featuredLinks: FeaturedLinkSite[] = [
  {
    name: '精华社 · 藏经阁',
    url: 'https://jinghuasociety-scripturelibrary.asoe.cn/',
    desc: '藏技术菁华，见字节山河。把计算机与互联网技术，讲成人话。',
    category: '技术',
  },
  {
    name: '示例站点 A',
    url: 'https://example.com/a',
    desc: '（示例成员，提交 PR 时请替换为真实站点，或删除本条）',
    category: '示例',
    example: true,
  },
  {
    name: '示例站点 B',
    url: 'https://example.com/b',
    desc: '（示例成员，提交 PR 时请替换为真实站点，或删除本条）',
    category: '示例',
    example: true,
  },
  {
    name: '示例站点 C',
    url: 'https://example.com/c',
    desc: '（示例成员，提交 PR 时请替换为真实站点，或删除本条）',
    category: '示例',
    example: true,
  },
]
