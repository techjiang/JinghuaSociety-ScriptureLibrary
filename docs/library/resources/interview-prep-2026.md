---
title: 前端面试高频题库（2026）
createTime: 2026-10-22
permalink: /resources/interview-questions/
description: 按主题归类的真实高频题与答题要点，本站文章即是答案索引
---

<CategoryTag name="资源" link="/library/resources/" />

面试题散落各处，这篇按主题归类**真正常考的**，
每题给「答题要点」和**本站答案索引**（技术区的文章）。
用法：自测 → 不会的照索引补。

## 一、JavaScript 基础（必考区）

| 题目 | 答题要点 | 本站索引 |
| --- | --- | --- |
| 原型链是什么 | 对象查属性的链、`__proto__`、class 是语法糖 | [原型链](../prototype/) |
| 闭包是什么/用途 | 函数记住出生作用域；模块化、私有变量 | [事件循环](../js-event-loop/) 前置 |
| this 的绑定规则 | 四条：默认/隐式/显式/new，箭头函数特殊 | [DOM 与事件](../js-dom/) |
| 事件循环/宏任务微任务 | 同步→微任务全清→一个宏任务，循环 | [事件循环](../js-event-loop/) |
| 深浅拷贝 | 赋值是引用；`{...}` 浅、`structuredClone` 深 | [深浅拷贝](../js-copy/) |
| 0.1+0.2 为什么≠0.3 | IEEE754、二进制存不全 | [浮点数](../float-precision/) |
| 类型判断 | typeof 六坑、toString.call、Array.isArray | [类型判断](../js-typeof/) |
| Promise/async | 三状态、链式、并发控制、错误处理 | [异步实战](../js-async/) |
| 防抖节流 | 定义+场景+手写 | [防抖节流](../debounce-throttle/) |
| new 一个对象发生了什么 | 三步：建对象、接原型、调构造 | [原型链](../prototype/) |

## 二、CSS（挂人区）

| 题目 | 要点 | 索引 |
| --- | --- | --- |
| 盒模型/BFC | content-box vs border-box、BFC 三用 | [盒模型](../box-model/) |
| 居中方案 | flex 四行、grid、absolute+transform | [布局模式](../css-layout/) |
| 选择器优先级 | 行内>ID>类>元素，`!important` 核弹 | [选择器](../css-selectors/) |
| flex:1 是什么 | `1 1 0%` 的缩写 | [布局模式](../css-layout/) |
| 回流重绘 | 改几何 vs 改颜色；transform 只合成 | [浏览器渲染](../browser-render/) |
| 定位五种 | relative/absolute/fixed/sticky 行为 | [CSS 定位](../css-position/) |
| 响应式怎么做 | 视口 + 流式 + 断点 + 图片适配 | [响应式](../responsive-web/) |

## 三、浏览器与网络（拉分区）

| 题目 | 要点 | 索引 |
| --- | --- | --- |
| 输入 URL 到显示 | 全链路十步 | [请求旅程](../request-lifecycle/) |
| 强缓存/协商缓存 | Cache-Control vs ETag/Last-Modified | [HTTP 缓存](../http-cache/) |
| 三次握手为什么 | 防历史连接、双向确认 | [TCP 握手](../tcp-handshake/) |
| HTTP1.1/2/3 差异 | keep-alive/多路复用/QUIC | [HTTP 演进](../http-versions/) |
| 跨域/CORS | 同源策略、预检、响应头 | [CORS](../cors/) |
| XSS/CSRF | 注入脚本 vs 冒用登录态；防御 | [Web 安全](../web-security.md) |
| 存储区别 | cookie/localStorage/IndexedDB | [浏览器存储](../browser-storage/) |
| 事件委托 | 冒泡 + closest，动态列表 | [DOM 与事件](../js-dom/) |

## 四、工程化与框架

| 题目 | 要点 | 索引 |
| --- | --- | --- |
| 浏览器渲染流程 | DOM→CSSOM→渲染树→布局→绘制 | [浏览器渲染](../browser-render/) |
| 性能优化手段 | 图片/缓存/懒加载/分包，按性价比 | [性能优化](../web-performance/) |
| SPA/SSR/SSG | 渲染位置不同、取舍 | [SSR/SSG](../ssr-ssg/) |
| Vue/React 响应式 | Proxy vs 不可变数据 + setState | [Vue 上手](../vue3-quickstart/) / [React 上手](../react-quickstart.md) |
| 模块化 | CJS vs ESM、Tree Shaking | [模块化](../js-modules/) |
| 语义化版本 | MAJOR.MINOR.PATCH、^ vs ~ | [语义化版本](../semantic-versioning/) |

## 五、Node 与后端基础

| 题目 | 要点 | 索引 |
| --- | --- | --- |
| 事件循环（Node） | 阶段 + nextTick 微任务 | [事件循环](../js-event-loop.md) |
| 中间件/洋葱模型 | Koa compose，Express next | [Node 篇](../../../library/tech/) 建设中 |
| 登录态方案 | Session vs JWT vs OAuth | [Cookie/JWT](../cookie-jwt/) |
| SQL 注入防护 | 参数化查询 | [SQL 注入](../sql-injection/) |

## 六、软技能题（别背，想清楚）

```text
「你做过最有挑战的项目」→ STAR 讲一个，重点在「你做了什么决策」
「为什么离职」→ 说发展不说人坏话
「怎么学新技术」→ 给方法论（本站[学习方法](../../articles/how-i-learn/)）
「你的缺点」→ 真实的 + 正在改的
「有什么问我的」→ 必问！团队/技术栈/挑战（别问薪资福利，那是 HR 环节）
```

## 七、答题技巧（比答案重要）

1. **先问清楚再答**：「你问的是 Vue2 还是 Vue3？」——
   展现严谨；
2. **结构化**：总（一句话结论）→ 分（两三点）→ 例（项目里怎么用）；
3. **不会就诚实**：「这个我没深入，我的理解是 X，
   可能是 Y，不确定」—— 比硬编强一万倍；
4. **往熟悉引**：每答一题，往你准备好的项目/深度上引
   （「这让我想起我做的 X，当时…」）；
5. **手写题先讲思路**：边写边说，写不出完整的写框架，
   别沉默。

## 八、刷题资源

- [LeetCode 力扣](https://leetcode.cn) + [CodeTop](https://codetop.cc)（按公司频率）；
- 本站[面试准备](../interview-resources.md)（策略向）；
- 八股自测：拿本页左边盖住，复述要点 ——
  说得出的划掉，说不出的照索引补。

## 小结

题库用法：**当自测表，不当背诵手册**。每题能
「讲人话 + 举例子」才算过。本站技术区 20 篇
就是这套题的「参考答案」—— 复习 = 读文章 + 盖住复述。
面试考的不是「知道」，是「讲得清」。
