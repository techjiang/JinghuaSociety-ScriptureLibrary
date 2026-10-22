---
title: Chrome 扩展推荐：开发者向
createTime: 2026-10-22
permalink: /library/resources/chrome-extensions/
description: 前端调试、效率工具与隐私保护，开发者真正会装的扩展清单
---

# Chrome 扩展推荐：开发者向

Chrome 扩展装十个是上限，装三十个浏览器变老爷车。
这份按「开发调试」和「日常效率」分，全是长期自用款。

## 一、开发调试（前端主力）

| 扩展 | 作用 |
| --- | --- |
| **Vue.js devtools** | Vue 组件树、Pinia/Vuex 状态、路由、性能面板 |
| **React Developer Tools** | React 组件树、props/state 检查、Profiler |
| **JSON Formatter** | 接口返回的 JSON 自动格式化、折叠、高亮 |
| **ModHeader** | 改请求头（测缓存、测鉴权、模拟 UA） |
| **Allow CORS** | 一键加 CORS 响应头，联调救急（别依赖它，正解在服务端配） |
| **Lighthouse** | 性能/SEO/无障碍一键跑分 |
| **WhatFont** | 鼠标一指显示用了什么字体、字号、行高 |

`ModHeader` 排最前：测「带特定 token 会怎样」「模拟移动端 UA」，
不用改代码不用 Postman，浏览器点几下。

## 二、效率工具

| 扩展 | 作用 |
| --- | --- |
| **Vimium** | 键盘操作浏览器（`j/k` 滚动、`f` 打开链接），双手不离键盘 |
| **uBlock Origin** | 去广告（比 AdBlock 省内存） |
| **Bitwarden** | 密码管理（和本站无关，但人人都该有） |
| **Google 翻译** | 划词翻译，读英文文档刚需 |
| **Tampermonkey 油猴** | 脚本平台，装各种「网站增强脚本」 |

`Vimium` 学习曲线半天，回本一辈子 —— 尤其查资料时
「滚一下、点个链接、再滚」的节奏，键盘比鼠标快三倍。

## 三、隐私与洁癖

| 扩展 | 作用 |
| --- | --- |
| **uBlock Origin**（重复但重要） | 去广告去追踪 |
| **ClearURLs** | 清掉链接里的追踪参数（`?utm_source=…`） |
| **Cookie AutoDelete** | 关标签页自动清 Cookie，防跟踪 |

「洁癖党」三件套：上网不留痕迹。`ClearURLs` 复制链接时会自动
把跟踪参数剥掉，分享出去的链接干净很多。

## 四、装了会后悔的

- **各种「主页导航」扩展**：劫持浏览器主页，卸载还留残留；
- **「一键下载视频」类**：部分有劫持搜索/插广告行为；
- **功能重叠的截图工具**：系统截图（`Win+Shift+S`）已经够用，
  要标注再装一个 Snipaste 客户端比扩展强；
- **来路不明的「破解」扩展**：读你所有页面数据的权限，等于把家门钥匙给它。

## 五、安装与排障

**只从 Chrome Web Store 装**。第三方 `.crx` 强行安装的，
权限审核那关是绕过的，风险自负。

装多了变慢的处置：

```text
chrome://extensions        → 关掉不常用的（别卸，留档）
chrome://settings/performance → 看「内存节省」建议
```

**排障技巧**：页面出怪问题（按钮点了没反应、样式错乱），
开无痕模式（`Ctrl+Shift+N`，默认禁用所有扩展）访问 ——
无痕正常，就是某个扩展的锅，挨个关着试。

## 六、扩展 vs 客户端：什么时候用客户端

有些活扩展干不好：

- **截图标注** → Snipaste 客户端（贴图到屏幕顶层是扩展做不到的）；
- **接口调试** → Hoppscotch/Apifox 客户端（要保存集合、团队协作）；
- **密码管理** → Bitwarden 客户端 + 扩展配合。

判断标准：**只用浏览器能力就够的用扩展，要跨应用/系统能力的用客户端**。

## 小结

开发者向 Chrome 扩展核心五件：**Vue/React devtools（按框架选）、
JSON Formatter、ModHeader、Vimium、uBlock Origin**。
其他按需。记住「无痕模式排障法」—— 扩展是背锅大户，
先排除再排查，省一小时是一小时。
