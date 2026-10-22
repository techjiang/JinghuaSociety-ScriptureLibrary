---
title: HTML 语义化：让机器读懂你的页面
createTime: 2026-10-22
permalink: /library/tutorial/html-semantic/
description: 语义化标签不只是 SEO——读屏软件、爬虫、未来的你自己，都靠它理解页面
---

# HTML 语义化：让机器读懂你的页面

新手写 HTML 的通病：满页 `<div>`。一个按钮用 div，一个导航用 div，
一篇文章还是 div。不是说不能跑，但机器 —— 搜索引擎爬虫、读屏软件、
三个月后回来改代码的你 —— 看到的就是一堆没有名字的盒子。

语义化就是**给每个盒子起对名字**。这篇讲常用标签、为什么重要、怎么落地。

## 一、常用语义标签速查

### 页面骨架

```html
<body>
  <header>       <!-- 页头：logo、导航。一个页面可以有多个（文章内也能用）-->
    <nav>…</nav>  <!-- 导航链接区域 -->
  </header>

  <main>          <!-- 页面主体。一个页面只该有一个 -->
    <article>     <!-- 独立内容：一篇博客、一条新闻、一个帖子 -->
      <h1>标题</h1>
      <p>正文…</p>
    </article>

    <aside>       <!-- 侧边内容：相关推荐、广告位 -->
    </aside>

    <section>     <!-- 文档中的"章节"，带标题 grouping -->
  </main>

  <footer>       <!-- 页脚：版权、备案号 -->
  </footer>
</body>
```

### 内容级标签

| 场景 | 用什么 | 别用 |
| --- | --- | --- |
| 按钮 | `<button>` | `<div onclick>` |
| 导航链接列表 | `<nav>` + `<ul>` | div 套 div |
| 时间 | `<time datetime="2026-10-22">` | `<span>` |
| 强调 | `<strong>` / `<em>` | `<b>` / `<i>`（后者只是样式） |
| 缩写 | `<abbr title="…">` | 直接写 |
| 图片说明 | `<figure>` + `<figcaption>` | div 套 img |
| 代码 | `<code>` / `<pre>` | div |
| 表格数据 | `<table>` | div 模拟（网格布局除外） |

## 二、为什么值得费这个事

### 1. SEO：爬虫靠标签判断内容权重

搜索引擎爬虫解析 HTML 时，`<h1>` 是页面主标题，`<article>` 里是正文，
`<nav>` 里是导航噪音。你用 div 一把梭，爬虫只能靠猜 ——
猜错的代价是排名靠后。

实测感受：同一个页面，把正文从 div 改成 article/section 结构、
标题层级理顺，收录和摘要展示质量都有提升。不玄学，是爬虫的工作方式。

### 2. 无障碍：读屏软件用户的体验

视障用户用读屏软件「听」页面。软件会念：「导航区域，5 个链接」、
「文章标题」、「正文开始」。全是 div 的话，听到的是一串没有结构的文字，
跟听电话簿似的。

国内对无障碍的重视还在起步，但这是趋势，也是良心。

### 3. 你自己：三个月后回来看代码

```html
<div class="box">
  <div class="title">…</div>
  <div class="content">…</div>
</div>
```

vs

```html
<article>
  <h2>…</h2>
  <p>…</p>
</article>
```

哪个一眼看懂？语义化是写给未来的自己的文档。

## 三、标题层级：h1 到 h6 的纪律

纪律就两条：

1. **一个页面一个 h1**（文章大标题，别拿 h1 做 logo 旁边的装饰文字）；
2. **层级不跳级**：h1 → h2 → h3，别 h2 下面蹦出 h4。

跳级的后果：读屏软件和爬虫都会认为你的文档结构断裂。
本站所有文章的标题层级都遵守这条 —— 你也可以按 F12 检查任何一篇。

## 四、动手改造：一个反例

改造前（某年某月我写的商城首页）：

```html
<div class="header">
  <div class="logo">我的商城</div>
  <div class="menu">
    <div class="menu-item">首页</div>
    <div class="menu-item">商品</div>
  </div>
</div>
<div class="main">
  <div class="goods">
    <div class="goods-title">热销商品</div>
    <div class="goods-list">
      <div class="goods-item">…</div>
    </div>
  </div>
</div>
```

改造后：

```html
<header>
  <h1 class="logo">我的商城</h1>   <!-- 或者 logo 用 img + aria-label -->
  <nav>
    <ul>
      <li><a href="/">首页</a></li>
      <li><a href="/goods">商品</a></li>
    </ul>
  </nav>
</header>
<main>
  <section aria-labelledby="hot-title">
    <h2 id="hot-title">热销商品</h2>
    <ul class="goods-list">
      <li>…</li>
    </ul>
  </section>
</main>
```

变化就三点：div 换成有名字的标签、菜单变成 ul/li/a、
标题层级理顺。CSS 类名可以保留，样式不受影响。

## 五、搭配使用的两个属性

### alt：图片的遗嘱

```html
<img src="chart.png" alt="2026 年第三季度销售额增长 23%">
```

图片挂了、读屏软件、图片搜索 —— 都靠 alt。写不出 alt 的图片，
先想想这张图是不是必要的。装饰性图片用 `alt=""`（告诉读屏软件跳过）。

### aria-label：给图标按钮补名字

```html
<button aria-label="关闭弹窗">
  <svg>…叉叉图标…</svg>
</button>
```

图标按钮没有文字，读屏软件念不出来。`aria-label` 给它起名。
注意：**能不用就不用** —— 有可见文字最好，aria-label 是补充不是主力。

## 六、检验工具

- **WAVE**（浏览器扩展）：一页扫完，语义问题、对比度问题全标出来；
- **Lighthouse 的 Accessibility 评分**：DevTools 里跑，100 分不难；
- **最原始的方法**：开读屏软件听一遍（macOS 按 Ctrl+F5 启动旁白），
  听不下去的地方就是用户听不下去的地方。

## 小结

语义化三本账：**SEO 账**（爬虫读得懂，排名有优势）、**良心账**
（读屏用户能正常浏览）、**维护账**（未来的你看得懂）。
成本只是把 div 换成有名字的标签 —— 这买卖，划算。
