---
title: CSS 选择器与优先级完全指南
createTime: 2026-10-22
permalink: /library/tutorial/css-selectors/
description: 从基础选择器到 :has()，附优先级计算表和一份踩坑清单
---

# CSS 选择器与优先级完全指南

选择器是 CSS 的基本功。写得准，一行 CSS 搞定；写得糙，
满屏 `!important` 打架。这篇按使用频率讲，最后给优先级计算表。

## 一、基础选择器（天天用）

```css
* {}              /* 所有元素（初始化用，别滥用） */
div {}            /* 标签选择器 */
.class {}         /* 类选择器 —— 主力 */
#id {}            /* ID 选择器（权重高，尽量少用） */
[type="text"] {}  /* 属性选择器 */
```

**类选择器是日常主力**：权重适中、可复用、不冲突。ID 选择器权重太高，
一个 `#header` 能压掉后面十个 `.header`，覆盖起来想撞墙。

## 二、组合选择器（决定你能写多精细）

```css
.a .b {}      /* 后代：.a 里面的 .b（隔着多少层都算） */
.a > .b {}    /* 子代：.a 的直接儿子 */
.a + .b {}    /* 相邻兄弟：紧跟在 .a 后面的 .b */
.a ~ .b {}    /* 后续兄弟：.a 后面的所有 .b 兄弟 */
```

实战场景：

```css
/* 列表里最后一项去掉下边框 */
.list-item + .list-item { border-top: 1px solid #eee; }

/* 导航当前项高亮（配合 JS 加 class） */
.nav-item + .nav-item { margin-left: 16px; }
```

**优先用 `>` 不用空格**：性能略好（少遍历），语义更准（防误伤深层元素）。

## 三、伪类与伪元素（提效利器）

### 常用结构伪类

```css
li:first-child {}      /* 第一个子元素 */
li:last-child {}       /* 最后一个 */
li:nth-child(2n) {}    /* 偶数项（2n+1 是奇数）*/
li:nth-child(3n+1) {}  /* 第 1、4、7… 项 */
li:not(.disabled) {}   /* 排除某类 */
```

 zebra 条纹表格一行搞定：

```css
tr:nth-child(even) { background: #f8f9fa; }
```

### 状态伪类

```css
a:hover {}       /* 悬停 */
a:focus-visible {}  /* 键盘聚焦（无障碍必用） */
input:disabled {}   /* 禁用态 */
input:checked {}    /* 选中态（配单复选框） */
```

`:focus-visible` 比 `:focus` 聪明：鼠标点击不显示聚焦圈，
键盘 Tab 才显示。做无障碍的同时不破坏鼠标用户体验。

### 伪元素

```css
.clearfix::after { content: ""; display: block; clear: both; }  /* 经典清除浮动 */
.required::before { content: "*"; color: red; }                 /* 加标记 */
.ellipsis::after { content: "…"; }                              /* 截断补省略号 */
```

注意 `::before` / `::after` 必须有 `content` 属性，不然不渲染。

## 四、现代选择器（2026 年该用了）

### :is() 和 :where()

```css
/* 以前 */
article h2, article h3, section h2, section h3 { color: #333; }

/* 现在 */
:is(article, section) :is(h2, h3) { color: #333; }
```

`:where()` 和 `:is()` 功能一样，但 **`:where()` 的权重是 0** ——
适合写「默认样式，随便被覆盖」的规则：

```css
/* 默认小字，任何类选择器都能覆盖 */
:where(.tip, .note) { font-size: 13px; color: #666; }
```

### :has() —— 父选择器，CSS 等了二十年

```css
/* 有图片的卡片改成横向布局 */
.card:has(img) { flex-direction: row; }

/* 表单某项校验失败时整个变红 */
.form-item:has(input:invalid) { border-color: #dc2626; }

/* 没头像的用户显示默认图标 */
.user:not(:has(.avatar)) .avatar-default { display: block; }
```

以前这些都得 JS 加 class。`:has()` 现在主流浏览器全支持
（Chrome 105+/Safari 15.4+/Firefox 121+），放心用。

## 五、优先级：一场四个等级的战争

CSS 规则冲突时，按优先级决胜：

| 等级 | 选择器 | 权重值 |
| --- | --- | --- |
| 1 | 行内样式 `style=""` | 1000 |
| 2 | ID `#a` | 100 |
| 3 | 类/属性/伪类 `.a` `[x]` `:hover` | 10 |
| 4 | 元素/伪元素 `div` `::before` | 1 |

计算规则：**数个数，比大小，同级后写的赢**。

```css
#nav .item {}          /* 100 + 10 = 110 */
.nav .item.active {}   /* 10 + 10 + 10 = 30 */
div p span {}          /* 1 + 1 + 1 = 3 */
```

110 > 30 > 3，第一条赢，跟顺序无关。

两个例外：

- `!important` 无视一切（除了另一个 `!important`）——
  **能不用就不用**，它是技术债，后面覆盖要写更多 `!important`；
- `:where()` 权重为 0，`:is()`/`:not()` 取内部最高权重。

**调试技巧**：DevTools 的 Computed 面板看每条属性最终生效值和来源，
冲突时一眼看出谁赢了。

## 六、踩坑清单

**坑一：全局 `* { margin: 0 }` 后患**
方便是方便，但表单元素、列表的默认间距全没了，后面一个个补。
现代做法用 CSS Reset 或 `box-sizing` 一招鲜：

```css
*, *::before, *::after { box-sizing: border-box; }
```

**坑二：类名越写越具体**
`.sidebar .widget .title .text` —— 四层后代，换个结构全失效。
**类名到两层够了**，第三层就该考虑把组件拆细。

**坑三：用元素选择器改组件样式**
`section h2 { font-size: 20px }` —— 某天有人在 section 里放个别的组件，
样式莫名其妙继承过去。组件样式用类名圈住，别用元素选择器撒网。

## 小结

日常武器库：**类选择器打主力，`>` 管直接子级，`:nth-child` 处理列表，
`:has()` 替代 JS 加类，`:where()` 写可覆盖的默认值**。
优先级记四句话：行内 1000、ID 100、类 10、元素 1，
`!important` 是核武器，别急着按。
