---
title: 学习路线与免费资源
createTime: 2026-10-21
permalink: /library/resources/learning-roadmap/
description: 前端/后端学习路线，附亲测有效的免费课程与文档，不推荐付费课
---
经常有人问「我想学编程，从哪开始」。这篇给两条路线（前端/后端），
加一份**免费**就能学到就业水平的资源清单。不推荐付费课 ——
免费的足够好，氪金买的往往是焦虑。

> 声明：站长的不是培训机构，路线是按自己的经验画的，
> 未必适合所有人，但每一步都是我真走过的。

## 一、先修：不管哪条路都要会的

1. **计算机基础操作**：文件管理、装软件、会用命令行；
2. **英语**：不用多好，能读懂技术文档就行。这是硬技能，
   比任何编程语言都值得投资；
3. **搜索能力**：会英文关键词搜 Google/GitHub，问题十有八九被人问过；
4. **Git**：看本站的 [Git 快速上手](../tutorial/git-quickstart.md)。

## 二、前端路线

```text
HTML/CSS 基础
   │
   ▼
JavaScript 语言核心（语法、DOM、事件、异步）
   │
   ▼
工程化入门（Git + npm + 构建工具）
   │
   ▼
框架（Vue 或 React 二选一，先精通一个）
   │
   ▼
周边生态（路由、状态管理、请求库、UI 组件库）
   │
   ▼
TypeScript + 构建进阶（Vite/Webpack 原理）
   │
   ▼
Node.js 基础（能写接口、懂 BFF）
   │
   ▼
性能、安全、部署（把东西发上线）
```

![前端学习路线图](/images/roadmap-frontend.svg)

*图：前端路线全貌，红色警告框是最大的坑*

关键建议：**框架之前，JavaScript 底子打牢**。跳过 JS 直接学框架的，
后面补课补到怀疑人生（事件循环、原型链、异步，一个都跑不掉）。
Vue 还是 React？国内岗位 Vue 多，生态对中文友好，零基础我建议 Vue 先。
学完一个再碰另一个，一周上手。

## 三、后端路线

```text
一门语言（Java / Go / Python / Node 选一个）
   │
   ▼
语言进阶 + 面向对象/并发模型
   │
   ▼
数据库（SQL 必学：MySQL/PostgreSQL；Redis 缓存）
   │
   ▼
HTTP 与网络基础（协议、状态码、RESTful）
   │
   ▼
Linux + 命令行 + 部署（能把服务跑在云服务器上）
   │
   ▼
框架（Spring / Gin / Django / NestJS 对应上面语言）
   │
   ▼
进阶：Docker、消息队列、系统设计
```

后端入门语言选择：Java 岗位最多生态最全；Go 简洁高薪趋势好；
Python 上手快适合转数据/AI 方向；Node 跟前端打通全栈爽。
纠结就选 Java 或 Go，资料多，岗位多。

## 四、免费资源清单（亲测）

### 文档类（当字典查）

- **[MDN Web Docs](https://developer.mozilla.org)**：前端唯一真神，
  权威、准确、有中文。HTML/CSS/JS 都查它；
- **[现代 JavaScript 教程](https://zh.javascript.info)**：最系统的
  中文 JS 教程，从零到进阶，免费在线读；
- **[roadmap.sh](https://roadmap.sh)**：各种技术路线图，
  学完一项勾一项，治迷茫；
- **[Vue 官方文档](https://cn.vuejs.org)** / **[React 官方文档](https://react.dev)**：
  框架文档本身就是最好教程，比第三方教程靠谱。

### 课程类（免费，质量不水）

- **[freeCodeCamp](https://www.freecodecamp.org)**：全免费，
  闯关式学，证书业内认可；
- **[CS50（哈佛计算机导论）](https://cs50.harvard.edu/x)**：
  计算机科学最佳入门课，B 站有官方中文字幕版；
- **[The Odin Project](https://www.theodinproject.com)**：
  全栈路线，项目驱动，全程免费；
- **[B 站大学**](https://www.bilibili.com)：黑马、尚硅谷等机构的
  免费全套课，搜「前端 2026」跟着最新的学。环境配置讲得细，
  适合完全零基础。

### 练习类

- **[LeetCode 力扣](https://leetcode.cn)**：刷题备战面试，
  先刷 HOT 100，别盲目冲量；
- **[Codewars](https://codewars.com)**：游戏化刷题，适合练小语法；
- **[Frontend Mentor](https://www.frontendmentor.io)**：
  给设计稿写页面，练手神器，作品集直接来源。

### 资讯与社区

- **[GitHub](https://github.com)**：最大的程序员社区，
  学会用 Trending 和 Explore；
- **[V2EX](https://www.v2ex.com)** / **[掘金](https://juejin.cn)**：
  中文技术社区，摸鱼学习两不误；
- **[Hacker News](https://news.ycombinator.com)**：英文，
  科技圈风向标，评论区比正文精彩。

## 五、学习方法（比资源更重要）

1. **项目驱动**：看完基础就做项目，做的过程中缺什么补什么。
   「学完再做」是永远开始不了的；
2. **别囤课**：收藏五十个课程不如看完一个。知识焦虑的解药是行动；
3. **输出倒逼输入**：写博客、写笔记、给同事讲。讲不清楚的地方，
   就是没真懂的地方；
4. **允许自己慢**：一天真正弄懂一个概念，比囫囵吞十个强。
   这一行是长跑，不是冲刺。

## 小结

资源在精不在多，路线在走在看。这篇收藏夹里吃灰没关系，
哪天迷茫了翻出来，从「先修」第一项开始，就是它最大的价值。
