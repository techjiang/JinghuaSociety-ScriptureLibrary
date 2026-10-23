---
title: 精链 · FeaturedLink
permalink: /featured-link/
description: 精链（FeaturedLink）是一个精选独立站点之环，灵感来自「开往」。加入精链，必须也添加精链的友情链接。
createTime: 2026/10/23 12:55:09
---

# 精链 · FeaturedLink

「精链」是一个**精选独立站点之环**——灵感来自「开往」。

你在本站或任意成员站点上点一下「精链」徽章，就会**随机串门**到环里的另一个好站。像逛集市，一家接一家，总有意外的收获。

## 怎么用

- 在本站任意页面右上角的「精链」徽章，或直接访问 [jinghuasociety-scripturelibrary.asoe.cn/go/](/go/)，即可随机跳转到一个成员站点；
- 想让你的站点也出现在环里？看下面的「加入精链」。

## 徽章（挂上它，你就进了环）

把下面这段 HTML 放到你的站点上（任意页面、侧边栏、页脚都行），它就加入了「精链」之环：

```html
<a href="https://jinghuasociety-scripturelibrary.asoe.cn/go/" target="_blank" rel="noopener" title="精链 FeaturedLink">
  <img src="https://jinghuasociety-scripturelibrary.asoe.cn/images/featured-link-badge.svg" alt="精链 FeaturedLink" height="34" />
</a>
```

徽章图片地址：`https://jinghuasociety-scripturelibrary.asoe.cn/images/featured-link-badge.svg`

（想要纯文字链接也行，只要 `href` 指向 `/go/` 即可。）

## 加入精链（硬性规定）

> ### 加入「精链」，必须也添加「精链」的友情链接。
>
> 翻译成大白话：**你链我，我链你——缺一不可。** 这是「精链」的硬性规定：
>
> - 你的站点须放置上面的「精链」徽章，或至少有一条指向
>   `https://jinghuasociety-scripturelibrary.asoe.cn/go/` 的友链；
> - **未在你的站点上添加「精链」回链的，不予收录。**
>
> **为什么这么硬？** 因为「精链」是一个**环**。只有彼此都挂上对方的链接，访客才能一家接一家地串下去；单方面挂链，环就断了，对谁都没好处。请把这条规定当作加入的「门票」，而不是附加项——它保证这个环里的每一家，都真真切切地连在一起。

### 怎么提交（PR 加入）

1. **先**在你的站点上放好「精链」徽章（上面那段 HTML），这是加入的前提；
2. 打开仓库 [`techjiang/JinghuaSociety-ScriptureLibrary`](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary)（若地址不同请替换为实际仓库），编辑 `docs/.vuepress/featured-links.ts`，在 `featuredLinks` 数组里**追加一条**：

   ```ts
   {
     name: '你的站点名',
     url: 'https://你的域名/',
     desc: '一句话简介，说说你的站点讲什么',
     category: '技术', // 或 日常 / 生活 / 资源 / 其它
   }
   ```

3. 提交 **Pull Request**，标题写 `add: 精链成员 - 你的站点名`；
4. 合并后，你的站点就出现在下面的成员列表，并能被「精链」随机串门到。

> 暂时不会用 PR？也可以发邮件到 `jinghua@example.com`，附上你的站点地址与简介，我们帮你加——但**回链依然要有**，否则不加。

## 成员

<FeaturedLinkList />

---

「精链」不求多，只求精：能彼此认真挂链、认真做内容的站点，才配得上这个「精」字。
