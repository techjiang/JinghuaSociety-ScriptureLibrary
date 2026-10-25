---
title: 加入精链
createTime: 2026-10-24
permalink: /featured-link/
description: 加入精链（FeaturedLink）的要求与流程 —— 必须先添加精链的友情链接（徽章），再通过 PR 提交你的站点
---

「精链」是一个**精选独立站点之环**——灵感来自「开往」。

你在任意成员站点上点一下「精链」徽章，就会**随机串门**到环里的另一个好站。
像逛集市，一家接一家，总有意外的收获。

<FeaturedLinkPanel />

## 加入精链（硬性规定）

> ### 加入「精链」，必须也添加「精链」的友情链接。
>
> 翻译成大白话：**你链我，我链你——缺一不可。** 这是「精链」的硬性规定：
>
> - 你的站点须放置下面的「精链」徽章，或至少有一条指向
>   `https://eslibrary.asoe.cn/go/` 的友链；
> - **未在你的站点上添加「精链」回链的，不予收录。**
>
> **为什么这么硬？** 因为「精链」是一个**环**。只有彼此都挂上对方的链接，访客才能一家接一家地串下去；
> 单方面挂链，环就断了，对谁都没好处。请把这条规定当作加入的「门票」，而不是附加项。
>
> **回链被移除怎么办？** 定期巡检，发现回链被撤下的站点会移出「精链」，并可在 Issues 里公示原因。

### 站点要求

除了回链，还希望你满足这几点（和「开往」一类站点环的通例一致）：

1. **站点可正常访问**——能打开、不跳死链、不是空白页；
2. **有实质内容**——不是纯导航页、非纯采集/批量生成的垃圾内容；
3. **内容合法合规**——不含政治敏感、色情低俗、赌博、侵权、恶意软件等；
4. **欢迎原创为主**——技术、生活、随笔、工具、设计都行，**求精不求多**；
5. 若在国内服务器运营，建议完成 ICP 备案（不强制，但更稳）。

## 徽章（挂上它，你就进了环）

把下面任意一段 HTML 放到你的站点上（任意页面、侧边栏、页脚都行），它就加入了「精链」之环。
**SVG 无限缩放不失真，PNG 兼容性最好，GIF 会动更抓眼**——按你的站点情况挑一个。

### 1. 标准横版（最常用）

<img src="/images/featured-link-badge.svg" alt="精链 FeaturedLink" height="34" />

```html
<a href="https://eslibrary.asoe.cn/go/" target="_blank" rel="noopener" title="精链 FeaturedLink">
  <img src="https://eslibrary.asoe.cn/images/featured-link-badge.svg" alt="精链 FeaturedLink" height="34" />
</a>
```

> 想用 PNG：把 `featured-link-badge.svg` 换成 `featured-link-badge.png`（其余不变）。

### 2. 小尺寸（适合侧边栏 / 紧凑位）

<img src="/images/featured-link-badge-small.svg" alt="精链 FeaturedLink" height="28" />

```html
<a href="https://eslibrary.asoe.cn/go/" target="_blank" rel="noopener" title="精链 FeaturedLink">
  <img src="https://eslibrary.asoe.cn/images/featured-link-badge-small.svg" alt="精链 FeaturedLink" height="28" />
</a>
```

### 3. 方形（适合头像位 / 图标墙）

<img src="/images/featured-link-badge-square.svg" alt="精链 FeaturedLink" width="72" height="72" />

```html
<a href="https://eslibrary.asoe.cn/go/" target="_blank" rel="noopener" title="精链 FeaturedLink">
  <img src="https://eslibrary.asoe.cn/images/featured-link-badge-square.svg" alt="精链 FeaturedLink" width="72" height="72" />
</a>
```

### 4. 反白版（适合深色背景的站点）

<img src="/images/featured-link-badge-inverse.svg" alt="精链 FeaturedLink" height="34" style="background:#1f2937;padding:6px;border-radius:8px" />

```html
<a href="https://eslibrary.asoe.cn/go/" target="_blank" rel="noopener" title="精链 FeaturedLink">
  <img src="https://eslibrary.asoe.cn/images/featured-link-badge-inverse.svg" alt="精链 FeaturedLink" height="34" />
</a>
```

### 5. 动图版（白光扫过，更抓眼）

<img src="/images/featured-link-badge-animated.gif" alt="精链 FeaturedLink" height="34" />

```html
<a href="https://eslibrary.asoe.cn/go/" target="_blank" rel="noopener" title="精链 FeaturedLink">
  <img src="https://eslibrary.asoe.cn/images/featured-link-badge-animated.gif" alt="精链 FeaturedLink" height="34" />
</a>
```

> 想要矢量动图（可缩放、体积极小）？用 `featured-link-badge-animated.svg`，写法同上。
> 注意：动图请**直接外链本站地址**，不要保存到本地——本地副本不会随徽章更新。

### 6. 纯文字链接（不想用图片时）

```html
<a href="https://eslibrary.asoe.cn/go/" target="_blank" rel="noopener">精链 · FeaturedLink</a>
```

### 可用文件一览

| 文件 | 尺寸 | 格式 |
| --- | --- | --- |
| `featured-link-badge.svg` / `.png` | 156×34（PNG 为 2 倍图 312×68） | 矢量 / 位图 |
| `featured-link-badge-small.svg` / `.png` | 128×28（PNG 256×56） | 矢量 / 位图 |
| `featured-link-badge-inverse.svg` / `.png` | 156×34（PNG 312×68） | 反白 |
| `featured-link-badge-square.svg` / `.png` | 72×72（PNG 144×144） | 方形 |
| `featured-link-badge-square-lg.svg` / `.png` | 120×120（PNG 240×240） | 方形大 |
| `featured-link-badge-animated.svg` / `.gif` | 156×34（GIF 312×68） | 动图 |
| `featured-link-badge-animated-small.svg` | 128×28 | 动图小 |

统一前缀：`https://eslibrary.asoe.cn/images/`

## 怎么提交（PR 加入）

1. **先**在你的站点上放好「精链」徽章（上面任意一段 HTML），这是加入的前提；
2. Fork 仓库并编辑 `docs/.vuepress/featured-links.ts`，在 `featuredLinks` 数组里**追加一条**：

   ```ts
   {
     name: '你的站点名',
     url: 'https://你的域名/',
     desc: '一句话简介，说说你的站点讲什么',
     category: '技术', // 或 日常 / 生活 / 资源 / 设计 / 其它
     icon: 'https://你的域名/favicon.ico', // 可选：站点图标，建议 1:1；成员墙以小正方形瓷砖展示
   }
   ```

3. 提交 **Pull Request**，标题写 `add: 精链成员 - 你的站点名`，并在 PR 描述里附上**已放置徽章的页面地址**，方便核对回链；
4. 核对通过后合并，你的站点立即出现在 [成员墙](/featured-link/members/)，并能被「精链」随机串门到。

**直达链接**：[Fork 仓库](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/fork) · [编辑成员文件](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/edit/main/docs/.vuepress/featured-links.ts) · [Open a Pull Request](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/compare) · [New Issue](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/issues/new/choose)

> 暂时不会用 PR？也可以发邮件到 `jinghua@example.com`，附上你的站点地址、简介与已放徽章的页面——但**回链依然要有**，否则不加。

---

加入后，你的站点就在环里了。去看看 [精链成员](/featured-link/members/)，
或者从顶部导航的「**精链 → 启动**」随机跳一个——**今晚可能就跳到你那儿。**
