---
title: Chrome DevTools 调试技巧
createTime: 2026-10-21
permalink: /library/tutorial/chrome-devtools/
description:  Elements、Console、Network 三大面板的实战用法，附断点调试入门
---

# Chrome DevTools 调试技巧

很多人用 DevTools 只会两件事：看 Console 里的报错，和
Elements 里改样式。这就好比买了把瑞士军刀只用来开瓶盖。
这篇把常用的几招讲透，调试效率翻倍不敢说，少加班是够的。

> 基于 Chrome 128，Firefox/Safari 的面板大同小异。

## 一、Console：不只是看报错

### 直接当计算器用

打开 Console 随便打：

```js
[1,2,3].map(x => x * 2)     // [2, 4, 6] —— 直接验证想法，比建文件快
```

### $ 选择器，jQuery 的味道

```js
$('button')        // document.querySelector 的简写
$$('button')       // querySelectorAll，返回数组，能直接 .map
$0                 // 当前在 Elements 面板选中的元素
```

在 Elements 里点选一个元素，Console 里 `$0` 就是它。
想改它：`$0.style.color = 'red'`，当场生效，随手试随手扔。

### 表格化输出

```js
console.table([{name: 'Vue', stars: 48000}, {name: 'React', stars: 230000}])
```

对象数组瞬间变表格，一眼看清结构。接口返回一堆数据时特别好用。

### 保留日志

Console 左上角齿轮图标里勾 **Preserve log**，
页面跳转后日志不清空。排查「点击后跳转，报错一闪而过」的问题必开。

## 二、Elements：CSS 调试主战场

### 找继承自哪的样式

选中元素后右侧 Styles 面板，每条样式后面标着来源文件
（比如 `main.css:142`）。点它直接跳源码。
搞不清某个样式哪来的时候，看 `Computed`（计算后）面板，
它会列出最终生效值和来自哪条规则。

### 强制状态

Styles 面板顶部有个 `:hov` 按钮，勾上能看 `:hover`、`:focus`、
`:active` 状态下的样式。写hover 样式不用再把鼠标死死停在上面。

### 盒模型一目了然

选中元素后底部（或右侧）的盒模型图，内边距、边框、
外边距都用不同颜色标出。调间距时看一眼，比猜快。
按住 Alt 还能直接看到每块占的像素值。

## 三、Network：性能与排障都靠它

### 看什么

- **Status**：200？304？404？502？第一个要看的；
- **Type**：js/css/img/font/document/xhr；
- **Size**：传输大小 vs 资源大小，差距大说明压缩生效了；
- **Time**：耗时，找最慢的那个；
- **Waterfall**：瀑布流，看请求是排队还是并发，有没有阻塞。

### 过滤

Network 面板顶部可以按类型过滤（JS/CSS/Img/XHR）。
调试接口只勾 XHR/Fetch，页面清爽一半。

### 慢速模拟

顶部的 Online 下拉菜单能模拟 Slow 3G / Fast 3G。
想知道弱网下页面啥样、 loading 态有没有做好，用它，
别靠拔网线。

### 复制请求

右键任意请求 → **Copy as cURL**，直接得到一条完整的
`curl` 命令，拿去复现、发给后端都行。
排查接口问题第一神技，没有之一。

## 四、断点调试：别只会 console.log

`console.log` 调试法是石器时代的技艺，断点才是现代文明。

### Sources 面板基础流程

1. 左侧找到对应的 JS 文件（`Ctrl+P` 按文件名搜）；
2. 点行号左侧打下断点（出现蓝色标记）；
3. 页面上触发相关操作，执行到断点处停下；
4. 右侧面板能看到：作用域里的所有变量、调用栈、监听的事件。

### 常用操作

- **F10** 单步跳过（不进入函数内部）；
- **F11** 单步进入（钻到函数里看）；
- **F8** 继续执行到下一个断点；
- 鼠标悬停在变量上看当前值，右侧 Scope 面板看全部作用域。

### 条件断点（神技）

右键行号 → **Add conditional breakpoint**，输入条件：

```js
item.id === 'u_10086'
```

循环里只想在某个特定值停下，用条件断点。
不用再写一堆 `if (id === xxx) debugger`。

### DOM 断点

Elements 面板右键元素 → **Break on** → subtree modifications。
想知道「这段 DOM 被谁改了」，打这个断点，谁改谁现行。
 Vue/React 项目里追「这行文本怎么自己变了」特别好使。

## 五、DevTools 面板速查

![六大面板分工](/images/devtools-panels.svg)

*图：六大面板各管一摊，按图索骥就行*

## 六、应用面板：存的东西一目了然

**Application** 面板里：

- **Local Storage / Session Storage**：看键值、改键值、删键值；
- **Cookies**：看每个 cookie 的 domain/path/过期时间；
- **Cache Storage**：Service Worker 缓存的东西。

排查「登录态莫名其妙丢了」，先来这看 cookie 在不在、
过期时间对不对。

## 七、性能与 Lighthouse

- **Performance 面板**：录一段操作，看火焰图，找出卡顿的函数；
- **Lighthouse 面板**：一键生成性能/SEO/无障碍报告，
  按它给的提示逐条改，新手优化第一站。

## 小结

DevTools 的日常套餐：**Console 验想法、Elements 调样式、
Network 查请求、Sources 打断点、Application 看存储**。
五个面板各管一摊，够用很多年。剩下的（渲染面板、
内存快照、覆盖报告）等真遇到了再挖，不着急。
