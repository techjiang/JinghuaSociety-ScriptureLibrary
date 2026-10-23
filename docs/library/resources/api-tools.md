---
title: API 调试工具横评
createTime: 2026-10-22
permalink: /resources/api-tools/
description: Postman、Apifox、Hoppscotch、curl 与 Bruno——接口调试怎么选
---

<CategoryTag name="资源" link="/library/resources/" />

# API 调试工具横评

前后端联调、测试接口、写文档 —— 都需要 API 工具。
Postman 老牌但越来越重，国产 Apifox 一体化，
轻量党 Hoppscotch/Bruno。这篇横评，按需求选。

## 一、能力对比表

| | Postman | Apifox | Hoppscotch | Bruno |
| --- | --- | --- | --- | --- |
| 界面 | 客户端 | 客户端 | 网页 | 客户端 |
| 价格 | 免费档受限，团队贵 | 免费档大方 | 完全免费开源 | 免费开源 |
| 集合/环境管理 | 强 | 强 | 中 | 强（文件即集合） |
| Mock 数据 | ✅ | ✅ 强 | ❌ | ❌ |
| 文档生成 | ✅ | ✅ 强 | ❌ | 弱 |
| 团队协作 | ✅ 强 | ✅ 强 | ❌ | Git 协作 |
| 国内访问 | 慢 | **快** | 一般 | 快 |
| 数据存哪 | 账号云 | 账号云 | 本地 | **本地文件** |

## 二、逐个说

### Postman：老牌全能（也越来越重）

**优点**：功能最全（测试脚本、Mock、Monitor、文档）、
生态最大（导入导出格式成事实标准）、团队协作成体系。

**缺点**：

- **越来越重**：启动几秒，界面像驾驶舱；
- **强制登录**（2024 起 collections 不同步就废）；
- 国内访问慢，免费档协作人数受限；
- 高级功能（团队、Monitor）贵。

**适合**：企业团队（已有 Postman 工作流的）。
**个人**：值得重新考虑。

### Apifox：国产一体化

**定位**：Postman + Swagger + Mock + 测试，一个软件全包。

**优点**：

- **国内访问快**，中文界面；
- 接口文档自动生成（设计即文档）；
- Mock 强（不需要后端先写完就能联调）；
- 免费档 generous；
- 导入 Postman/OpenAPI 无痛。

**缺点**：

- 客户端体积也不小；
- 数据在它云上（私有部署收费）；
- 高级自动化比 Postman 弱。

**适合**：国内团队、前后端分离项目、要文档的。
**本站后端（如果有）会用它的平替。**

### Hoppscotch：轻量开源

[hoppscotch.io](https://hoppscotch.io) —— 浏览器打开就用。

**优点**：零安装、开源免费、快、支持 GraphQL/WebSocket、
PWA 能「装」成 app。

**缺点**：无集合管理（轻量的代价）、数据存浏览器
（清缓存没）、团队协作无。

**适合**：快速调试单个接口、临时抓包验证。
**不适合**：管理几十个接口的项目。

### Bruno：文件即集合的新派

[usebruno.com](https://www.usebruno.com) —— 理念先进：
**接口集合就是文件夹里的文本文件**，git 管理。

**优点**：

- 数据本地、纯文本、可 git diff（API 协作新范式）；
- 离线优先，无账号；
- 免费（连 PRO 都不要钱）；
- 界面现代不卡。

**缺点**：年轻（bug 和生态不如老牌）、
复杂协作流程（CI 跑测试）要自己搭。

**适合**：开发者个人、git 工作流团队、讨厌
「什么都要账号」的人。

### curl：永远的底线

```bash
curl -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"user":"zhangsan","pwd":"123456"}'
```

**任何时候都能用**：服务器上、CI 里、排查网络问题时。
DevTools 的 "Copy as cURL" 一键生成复现命令。
复杂调试用 GUI，脚本/CI 用 curl。

## 三、选型决策

```text
团队在国内、要文档 + Mock    → Apifox
企业团队、已有一套工作流     → Postman
讨厌账号、git 工作流          → Bruno
临时调试单个请求             → Hoppscotch
服务器上/CI/脚本             → curl
```

**我的日常**：Hoppscotch 快速试 + curl 写脚本 +
DevTools 复制请求。项目级集合用 Bruno（git 友好）。

## 四、使用技巧（通用）

1. **环境变量**：dev/staging/prod 的 baseURL 用环境切，
   别每个请求写死域名；
2. **复制为 cURL**：出问题贴给同事/后端，比描述强
   （DevTools Network 里任何请求都能转）；
3. **保存「模板请求」**：带鉴权头的通用请求存成模板，
   新接口复制改路径；
4. **断言/测试脚本**：不只「看返回」，写断言
   （`expect(res.status).toBe(200)`），回归测试白捡；
5. **导入 OpenAPI**：后端有 Swagger 文档的，
   导进来自动生成全部请求 —— 别手敲。

## 五、安全提醒

- **别在工具里存生产密码/token**（云端同步的等于公开）；
- **敏感请求用环境变量 + 本地值**，别提交进集合；
- 团队共享集合前，检查有没有硬编码的密钥
  （[Web 安全](../web-security.md) 的老问题）。

## 小结

API 工具四类：**Postman（企业全家桶）、Apifox（国产一体化）、
Hoppscotch（轻量网页）、Bruno（git 原生）**。
个人开发者我的推荐：Bruno + curl，零账号、可版本化、
团队能协作。工具是手段，接口调通是目的 —— 
顺手那个，就是最好的。
