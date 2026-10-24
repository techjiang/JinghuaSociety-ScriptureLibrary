---
title: 时间与时区工具
createTime: 2026-10-22
permalink: /resources/time-tools/
description: 时间戳转换、cron 表达式、时区处理——被时间坑过的程序员必备
---

<CategoryTag name="资源" link="/library/resources/" />

「8 小时时差」「定时任务没跑」「时间戳对不上」——
时间问题是程序员的经典折磨源。这篇收工具和「防坑守则」。

## 一、时间戳转换（天天用）

- **[timestamp.io](https://timestamp.io)** / **[tool.lu](https://tool.lu/timestamp/)**：
  秒/毫秒时间戳 ↔ 日期，一站；
- **[time.is](https://time.is)**：世界时钟 + 时区对比；
- **[Unix 时间戳](https://www.unixtimestamp.com)**：经典。

**速算口诀**：

```text
秒级时间戳 10 位（1700000000 附近 = 2023 年）
毫秒级 13 位（1700000000000）
现在是 17 开头 → 2023-2024；18 开头 → 2027 年后
```

**JS 里**：

```js
Date.now()                    // 毫秒时间戳（13 位）
Math.floor(Date.now() / 1000) // 秒级
new Date(1700000000000)       // 毫秒 → Date
new Date(1700000000 * 1000)   // 秒 → Date（别忘 ×1000！）
```

**最大坑**：秒级时间戳忘了 ×1000 传给 `new Date()`，
得到 1970 年 —— 这个 bug 我见过不止十次。

## 二、cron 表达式（定时任务）

```text
* * * * * 命令
│ │ │ │ │
│ │ │ │ └─ 星期几（0-7，0 和 7 都是周日）
│ │ │ └─── 月份（1-12）
│ │ └───── 日（1-31）
│ └─────── 小时（0-23）
└───────── 分钟（0-59）
```

常用速查：

```text
0 3 * * *       每天凌晨 3 点
*/5 * * * *     每 5 分钟
0 */2 * * *     每 2 小时
0 9 * * 1       每周一上午 9 点
0 0 1 * *       每月 1 号零点
```

**在线工具**：[crontab.guru](https://crontab.guru) ——
输入表达式，人话解释（「At 03:00」）。
反过来也能用：选「Every day at 3am」生成表达式。

**服务器上用**：`crontab -e`
（[Linux 服务器篇](../linux-server-basic.md) 有完整用法）。

**GitHub Actions 的 cron**：同样语法，注意是 **UTC**：

```yaml
on:
  schedule:
    - cron: '0 0 * * *'     # UTC 0 点 = 北京早 8 点
```

**时区坑**：服务器 cron 默认系统时区，Actions 是 UTC ——
「凌晨 3 点的任务早上 11 点才跑」，查这个。

## 三、时区处理（跨国项目的痛）

### 存储铁律

```text
数据库存 UTC（或时间戳），展示时转本地
```

**永远别存「本地时间字符串」** —— 用户换个时区看，
全乱。MySQL 用 `TIMESTAMP`（自动转 UTC 存）或
应用层统一转。

### JS 时区工具

```js
// 原生 toLocaleString（现代够用）
new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

// Intl API：完整时区支持
const fmt = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit',
})
fmt.format(new Date())
```

**库**（复杂场景）：

- [date-fns](https://date-fns.org) / [dayjs](https://day.js.org) ——
  轻量，dayjs 2KB 且 API 像 moment；
- [Luxon](https://moment.github.io/luxon/) ——
  Moment 团队的正统后继，时区处理强；
- **Temporal**（新的 JS 原生日期 API）——
  2026 年了还没全绿，但值得关注。

**别用 moment**（项目停更、体积大）——
新项目 dayjs/date-fns。

### ISO 8601 格式

```text
2026-10-22T15:30:00+08:00    带时区偏移（推荐）
2026-10-22T07:30:00Z         UTC（Z = Zulu）
2026-10-22 15:30:00          不带时区（歧义！别用于存储）
```

**API 返回时间统一带 Z 或偏移** —— 让客户端自己算。
（[JSON 篇](../json.md) 的 Date 变字符串，说的就是它。）

## 四、前端展示的常见需求

```js
// 「3 分钟前」「昨天」这种相对时间
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)

dayjs('2026-10-22T07:30:00Z').locale('zh-cn').fromNow()
// '2 小时前'

// 「今天 15:30」「昨天」格式
dayjs(d).calendar()
```

**本站文章时间**：Plume 主题展示 `createTime` ——
日期格式由主题管，作者只写 `2026-10-22`。

## 五、日历与排期

- **[crontab.guru](https://crontab.guru)**（重复利用）；
- **[timeanddate.com](https://www.timeanddate.com)**：
  时区转换 + 会议时间协调（跨时区约会神器）；
- **Google Calendar / 飞书日历**：排期 + 时区显示；
- **[Mermaid 甘特图](../markdown-table-diagram.md)**：
  文档里画排期。

## 六、被时间坑的清单

- [ ] 秒级时间戳忘 ×1000；
- [ ] cron 在 Actions 里用本地时区思维（实际 UTC）；
- [ ] 数据库存本地时间（不存 UTC）；
- [ ] API 返回不带时区的时间字符串；
- [ ] 用 `new Date('2026-10-22')`（被当 UTC，差 8 小时）——
  用 `new Date('2026-10-22T00:00:00+08:00')`；
- [ ] 月份从 0 开始（`getMonth()` 0 = 一月）——
  经典，`getMonth() + 1`；
- [ ] `toISOString()` 拿「本地日期」（它是 UTC）——
  想要本地，用 `toLocaleDateString` 或自己拼。

## 小结

时间三件套：**timestamp.io（转时间戳）、
crontab.guru（解释 cron）、dayjs（JS 处理）**。
防坑三铁律：**存 UTC、传带时区、秒级×1000**。
时间 bug 的特点：平时不显，一显就是跨国事故 —— 
把清单打勾，少一次凌晨排查。
