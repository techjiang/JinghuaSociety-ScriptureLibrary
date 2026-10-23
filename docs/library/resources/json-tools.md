---
title: JSON 工具集
createTime: 2026-10-22
permalink: /resources/json-tools/
description: 格式化、可视化、转换、校验——和 JSON 纠缠的日常工具箱
---

<CategoryTag name="资源" link="/library/resources/" />

# JSON 工具集

接口调试、数据处理、配置文件 —— 天天和 JSON 打交道。
这堆收「真的会反复打开」的 JSON 工具，按用途分。

## 一、格式化与查看

### JSON Crack：把 JSON 画成图

[jsoncrack.com](https://jsoncrack.com)

粘贴一段 JSON → 生成**节点关系图**，嵌套结构一目了然。
深层接口返回（比如配置树、复杂对象）看一眼就懂。
支持粘贴 URL、上传文件、导出图片。
**本站排接口结构的第一工具。**

### JSON Hero：结构化的另一种看法

[jsonhero.io](https://jsonhero.io)

类似 JSON Crack，但偏「文档式浏览」：侧栏看字段树、
主区看值、支持搜索字段。适合「读」大 JSON。

### VS Code 内置（最方便）

`.json` 文件打开 → 右键 Format Document（Shift+Alt+F）。
折叠层级（Ctrl+Shift+[ ）、大纲视图（Ctrl+Shift+O 看字段树）——
日常小 JSON 不用开网页。

## 二、命令行：jq 是神

```bash
# 基础：美化
curl -s https://api.example.com/data | jq '.'

# 取字段（点语法）
jq '.user.name'
jq '.items[0].id'

# 过滤数组
jq '.[] | select(.age > 18)'
jq '.users[] | {name, email}'        # 只保留两字段

# 计算
jq 'length'                          # 数组/对象大小
jq '[.[] | .price] | add'            # 求和
jq 'group_by(.category)'             # 分组

# 改字段
jq '.user.name = "新名字"'
jq '.items |= map(.price * 0.8)'     # 每个元素打八折

# 流式处理大文件
jq --stream 'select(.[0][0]=="id")' big.json
```

**jq 是运维/数据处理的基本功** —— 装一个
（`apt install jq` / `brew install jq`），
配 curl 使用，接口调试不用开 GUI。
[ jq 手册](https://jqlang.github.io/jq/manual/)当字典。

## 三、格式转换

| 工具 | 用途 |
| --- | --- |
| [transform.tools](https://transform.tools) | JSON → TS 类型/YAML/CSV/Go struct…… 一站大全 |
| [JSON to TS](https://transform.tools/json-schema-to-typescript) | 接口 JSON 秒变 TS interface（ transform.tools 里有） |
| [quicktype](https://quicktype.io) | JSON → 各种语言的类型定义（TS/Python/Go/Java） |
| [json2yaml](https://www.json2yaml.com) | JSON ↔ YAML（写配置常用） |

**TS 项目日常**：接口返回粘进 transform.tools →
拿 TS 类型 → 配 zod 校验（[TS 入门](../ts-basics.md)）。

## 四、校验与生成

- **[JSONLint](https://jsonlint.com)**：语法校验
  （报错带行号，找逗号/引号错）；
- **[JSON Schema](https://json-schema.org)**：JSON 的
  「类型系统」—— 定义数据结构规则，运行时校验
  （库：ajv/JS、zod/TS 更现代）；
- **[Mockaroo](https://mockaroo.com)**：造测试数据
  （100 条假用户数据，一秒生成，接口没就绪时联调神器）；
- **[JSON Generator](https://json-generator.com)**：按模板造数据。

**联调没后端时**：Mockaroo 造数据 + Hoppscotch 打接口
（[API 工具](../api-tools.md)），前端不等后端。

## 五、diff 与合并

- **VS Code**：两个 JSON 文件 → 右键 Compare Selected ——
  接口返回前后对比，改动一目了然；
- **命令行 diff**：`diff <(jq -S . a.json) <(jq -S . b.json)`
  （`-S` 按 key 排序后比，忽略顺序差异）；
- **JSON Merge**（VS Code 插件）：合并 JSON 配置
  （package.json 合并场景）。

## 六、编码相关

JSON 里的转义（引号、Unicode）也能工具化：

- **[URL Encode/Decode](https://www.urlencoder.org)**：
  JSON 塞 URL 参数前编码（[URL 编码](../url-encoding.md)）；
- **[Base64](https://www.base64encode.org)**：JWT 的
  payload 解码（[Base64 不是加密](../url-encoding.md)）；
- **[JSON 转义](https://www.freeformatter.com/json-escape.html)**：
  把 JSON 变成字符串字面量（嵌进代码/配置时）。

## 七、本站实践

本站（VuePress）的 JSON 场景：

- **siteData/搜索索引**：构建时生成的 JSON
  （本地搜索的 minisearch 索引）；
- **package.json**：VS Code 的 diff 对比处理版本升级；
- **feed.xml**：RSS 是 XML，但生成前是 JS 对象 ——
  `JSON.stringify` 的思路贯穿（[RSS 源码](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/blob/main/docs/.vuepress/plugins/rss.ts)）。

**验证 JSON 没坏**：构建后 `node -e "JSON.parse(fs.readFileSync(...))"` ——
CI 里加一步，配置坏了提前炸。

## 小结

JSON 工具箱四件套：**JSON Crack（看结构）、
transform.tools（转类型）、jq（命令行处理）、
Mockaroo（造数据）**。加上 VS Code 内置的格式化/diff，
覆盖九成场景。JSON 是前端的「普通话」——
这些工具就是你的「词典和语法书」。
