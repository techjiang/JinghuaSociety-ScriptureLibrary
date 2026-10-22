---
title: 技术
createTime: 2026-10-21
permalink: /library/tech/
description: 技术区 —— 原理向笔记，把一件事讲透，共 40 篇
---

# 技术

这一区放**原理向**的笔记。教程教你怎么做，这里讲为什么。
写这区的规矩：**啃明白了才写**，一知半解的先放着。
共 40 篇，按主题分。

## 名人堂

啃懂了才敢放这里，编辑首推三篇：

| 文章 | 一句话理由 |
| --- | --- |
| [一次网络请求的完整旅程](./request-lifecycle.md) | 一张图串起整条链路，面试常考 |
| [TCP 三次握手与四次挥手](./tcp-handshake.md) | 自己抓包验证，比死记牢 |
| [原型链与继承](./prototype-chain.md) | JS 的立身之本，讲透才敢写业务 |

## 最火文章

- 🔥 [JavaScript 事件循环](./js-event-loop.md) —— 宏任务微任务到底谁先跑
- 🔥 [浏览器是怎么渲染页面的](./browser-render.md) —— 重排重绘的来龙去脉
- 🔥 [前端性能优化清单](./web-performance.md) —— 按性价比排序的手段

## 推荐文章

- 【技术】[DNS 解析](./dns.md) —— 递归迭代、记录类型、TTL 与迁移
- 【技术】[HTTP 缓存详解](./http-cache.md) —— 强缓存协商缓存怎么配合
- 【技术】[跨域与 CORS 详解](./cors.md) —— 同源策略、预检、配置
- 【技术】[Cookie、Session 与 JWT](./cookie-jwt.md) —— 登录态三条路怎么选

## 全部文章

### 网络与协议

| 文章 | 一句话内容 |
| --- | --- |
| [一次网络请求的完整旅程](./request-lifecycle.md) | 从敲回车到看像素，全链路一图流 |
| [DNS 解析](./dns.md) | 递归迭代、记录类型、TTL 与迁移 |
| [OSI 七层与 TCP/IP 四层](./osi-tcpip.md) | 两张分层地图 + 排障对照表 |
| [TCP 三次握手与四次挥手](./tcp-handshake.md) | 为什么是三次，自己抓包验证 |
| [IP 地址与子网入门](./ip-subnet.md) | 私有地址、CIDR、安全组 /32 |
| [HTTP 缓存详解](./http-cache.md) | 强缓存协商缓存怎么配合 |
| [HTTP 版本演进](./http-versions.md) | 1.0→1.1→2→3 每个版本解决什么 |
| [HTTP 状态码使用指南](./status-codes.md) | 什么场景返回什么，附决策树 |
| [HTTP 方法与幂等性](./http-methods.md) | GET/POST/PUT/PATCH/DELETE 语义边界 |
| [HTTPS 与 TLS](./https-tls.md) | 一次握手的全过程、前向保密 |
| [跨域与 CORS 详解](./cors.md) | 同源策略、预检请求、配置 |
| [CDN 原理](./cdn.md) | 边缘节点、回源、缓存刷新 |

### JavaScript 核心

| 文章 | 一句话内容 |
| --- | --- |
| [JavaScript 事件循环](./js-event-loop.md) | setTimeout 和 Promise 谁先跑 |
| [原型链与继承](./prototype-chain.md) | 原型、new、class 语法糖 |
| [JS 模块化](./js-modules.md) | CJS、ESM、Tree Shaking、循环依赖 |
| [JS 深浅拷贝](./js-copy.md) | 引用陷阱与 structuredClone |
| [JS 类型判断与转换](./js-typeof.md) | typeof 的坑、== 转换表 |
| [0.1+0.2 为什么不等于 0.3](./float-precision.md) | IEEE 754 与金额计算正解 |
| [JS 垃圾回收入门](./js-gc.md) | 可达性分析、分代、内存泄漏四姿势 |
| [URL 编码与 Base64](./url-encoding.md) | encodeURIComponent 与「Base64 不是加密」 |
| [JSON 完全指南](./json.md) | 语法、大数陷阱、Date 变字符串 |
| [字符编码：ASCII 到 UTF-8](./char-encoding.md) | 乱码是怎么来的、防乱码清单 |

### CSS

| 文章 | 一句话内容 |
| --- | --- |
| [盒模型与 BFC](./box-model.md) | 标准盒模型、margin 合并、BFC 三用 |
| [CSS 定位完全指南](./css-position.md) | 五种定位的行为、场景与坑 |
| [CSS 单位全解](./css-units.md) | px/em/rem/vw/ch/cqi 选型 |

### 浏览器

| 文章 | 一句话内容 |
| --- | --- |
| [浏览器是怎么渲染页面的](./browser-render.md) | 字节流到像素、重排重绘 |
| [浏览器存储完全指南](./browser-storage.md) | 五兄弟姐妹对比与选型 |
| [浏览器缓存与存储辨析](./cache-vs-storage.md) | HTTP 缓存、Cache Storage、Web Storage |
| [SPA、SSR、SSG](./ssr-ssg.md) | 渲染位置决定命运 |

### 性能与安全

| 文章 | 一句话内容 |
| --- | --- |
| [前端性能优化清单](./web-performance.md) | 按性价比排序的优化手段 |
| [Web 安全入门：XSS 与 CSRF](./web-security.md) | 两种最常见攻击的原理与防御 |
| [SQL 注入与防护](./sql-injection.md) | 一条查询怎么被拖全库 |
| [Cookie、Session 与 JWT](./cookie-jwt.md) | 登录态三条路怎么选 |

### 后端与数据

| 文章 | 一句话内容 |
| --- | --- |
| [MySQL 索引原理与优化](./mysql-index.md) | B+ 树、最左前缀、EXPLAIN 实战 |
| [Redis 十分钟入门](./redis-basics.md) | 五结构、三场景、三坑 |
| [语义化版本](./semantic-versioning.md) | 1.2.3 里的纪律、^ 与 ~ |

## 阅读建议

原理这东西有个特点：看的时候都懂，用的时候想不起。
所以每篇都配了速查表和建议的「使用场景」，
用到什么回来翻什么，比通读有用。
