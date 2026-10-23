---
title: 精链 · FeaturedLink
permalink: /featured-link/
description: 精链（FeaturedLink）是一个精选独立站点之环，灵感来自「开往」。加入精链，必须也添加精链的友情链接。
createTime: 2026/10/23 12:55:54
---

# 精链 · FeaturedLink

「精链」是一个**精选独立站点之环**——灵感来自「开往」。

你在本站或任意成员站点上点一下「精链」徽章，就会**随机串门**到环里的另一个好站。
像逛集市，一家接一家，总有意外的收获。

<FeaturedLinkPanel />

## 怎么用

- 在本页点「**随机前往一个成员站点**」，或直接访问
  [jinghuasociety-scripturelibrary.asoe.cn/go/](/go/)，即会跳转到环里的一个成员站点；
- 在任意成员站点上点它们的「精链」徽章，效果相同；
- 跳转路由默认是 `/go/`，**可改**：改 `docs/go.md` 的 `permalink`，并同步改下面徽章代码里的地址即可。

## 徽章（挂上它，你就进了环）

把下面任意一段 HTML 放到你的站点上（任意页面、侧边栏、页脚都行），它就加入了「精链」之环：

**标准尺寸**

```html
<a href="https://jinghuasociety-scripturelibrary.asoe.cn/go/" target="_blank" rel="noopener" title="精链 FeaturedLink">
  <img src="https://jinghuasociety-scripturelibrary.asoe.cn/images/featured-link-badge.svg" alt="精链 FeaturedLink" height="34" />
</a>
```

**小尺寸（适合侧边栏）**

```html
<a href="https://jinghuasociety-scripturelibrary.asoe.cn/go/" target="_blank" rel="noopener" title="精链 FeaturedLink">
  <img src="https://jinghuasociety-scripturelibrary.asoe.cn/images/featured-link-badge.svg" alt="精链 FeaturedLink" height="24" />
</a>
```

**纯文字链接（不想用图片时）**

```html
<a href="https://jinghuasociety-scripturelibrary.asoe.cn/go/" target="_blank" rel="noopener">精链 · FeaturedLink</a>
```

徽章图片地址：`https://jinghuasociety-scripturelibrary.asoe.cn/images/featured-link-badge.svg`（可自行保存到本地引用）。

## 加入精链（硬性规定）

> ### 加入「精链」，必须也添加「精链」的友情链接。
>
> 翻译成大白话：**你链我，我链你——缺一不可。** 这是「精链」的硬性规定：
>
> - 你的站点须放置上面的「精链」徽章，或至少有一条指向
>   `https://jinghuasociety-scripturelibrary.asoe.cn/go/` 的友链；
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

## 怎么提交（PR 加入）

1. **先**在你的站点上放好「精链」徽章（上面任意一段 HTML），这是加入的前提；
2. Fork 仓库并编辑 `docs/.vuepress/featured-links.ts`，在 `featuredLinks` 数组里**追加一条**：

   ```ts
   {
     name: '你的站点名',
     url: 'https://你的域名/',
     desc: '一句话简介，说说你的站点讲什么',
     category: '技术', // 或 日常 / 生活 / 资源 / 设计 / 其它
   }
   ```

3. 提交 **Pull Request**，标题写 `add: 精链成员 - 你的站点名`，并在 PR 描述里附上**已放置徽章的页面地址**，方便核对回链；
4. 核对通过后合并，你的站点立即出现在下面的成员列表，并能被「精链」随机串门到。

**直达链接**：[Fork 仓库](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/fork) · [编辑成员文件](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/edit/main/docs/.vuepress/featured-links.ts) · [Open a Pull Request](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/compare) · [New Issue](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/issues/new/choose)

> 暂时不会用 PR？也可以发邮件到 `jinghua@example.com`，附上你的站点地址、简介与已放徽章的页面——但**回链依然要有**，否则不加。

## 成员

<FeaturedLinkList />

---

「精链」不求多，只求精：能彼此认真挂链、认真做内容的站点，才配得上这个「精」字。
环会慢慢长——**今天它短，是因为我们才刚开始。**
