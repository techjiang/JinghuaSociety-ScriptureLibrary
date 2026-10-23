---
title: 语义化版本：1.2.3 里的纪律
createTime: 2026-10-22
permalink: /library/tech/semantic-versioning/
description: MAJOR.MINOR.PATCH 的含义、^ 与 ~ 的规则、lock 文件与升级策略
---

<CategoryTag name="技术" link="/library/tech/" />

# 语义化版本：1.2.3 里的纪律

每个依赖都带个版本号 `1.2.3`。这三个数字不是随便编的 ——
**语义化版本（SemVer）是一套契约**：看版本号就知道升级会不会炸。
这篇讲这套契约，以及 npm 生态怎么围绕它运转。

## 一、三段数字各管什么

```text
1 . 4 . 2
│   │   └── PATCH（补丁号）：修 bug，不碰 API
│   └────── MINOR（次版本号）：加功能，向后兼容
└────────── MAJOR（主版本号）：破坏性变更，API 不兼容
```

判断标准一句话：**用户啥都不改，升级后还能用吗？**

- 能，还多了功能 → MINOR +1；
- 能，只修了问题 → PATCH +1；
- 不能，得改代码 → MAJOR +1，MINOR/PATCH 归零。

## 二、npm 的范围符号：^ 和 ~

`package.json` 里写的 `^1.2.3`、`~1.2.3` 不是版本，
是「允许装的范围」：

| 写法 | 允许装 | 直觉 |
| --- | --- | --- |
| `1.2.3` | 就这个 | 锁死 |
| `^1.2.3` | `1.x.x` 最新 | 「大版本别动，其他随意」 |
| `~1.2.3` | `1.2.x` 最新 | 「小版本也别动」 |
| `>=1.2.3` | 1.2.3 及以上（含 2.x） | 激进 |
| `*` / `latest` | 最新 | 裸奔 |

**npm 默认 `^`**（`npm install vue` 自动写 `^3.5.0`）。
所以「升级大版本」从来不会自动发生 —— 那是 SemVer 的安全绳。

### 0.x 的特例

`^0.4.2` 只允许 `0.4.x`！因为 **0.x 版本「随时可能全变」**，
SemVer 对 0.x 的约定是「次版本就可能破坏」。

表现：依赖写着 `^0.19.0`，你 `npm update` 永远上不了 0.20 ——
这是特性不是 bug。0.x 包要手动 `npm i pkg@0.20`。

## 三、lock 文件：范围的「落实」

你写 `^1.2.3`，今天装到 `1.9.9`。lock 文件
（`package-lock.json`）**记住这个确切值**，于是：

- 同事 `npm install` → 也装 1.9.9（不是 1.2.3，也不是明天的 1.10.0）；
- CI 构建 → 同样 1.9.9。

**所以 lock 必须提交 git，别手改。** 团队版本不一致的
「悬案」，九成是 lock 没提交或没同步。

`npm ci` vs `npm install`：CI 里用 `ci`（严格按 lock，
不一致直接报错）；本地用 `install`（可能更新 lock）。
详见 [npm 指南](../npm-package.md)。

## 四、实践中的四条纪律

### 1. 依赖别锁死（除非有理由）

```json
"vue": "^3.5.13"        // ✅ 收安全补丁
"vue": "3.5.13"         // ⚠️ 锁死：3.5.14 修了安全漏洞你也收不到
```

锁死的正当理由：某个包的下个补丁有 breaking 前科、
或构建复现有极端要求。否则用 `^`。

### 2. 大版本升级 = 小型迁移项目

React 17 → 18、Vue 2 → 3：**读 migration guide、
逐条改、跑测试**。别 `npm i pkg@latest` 一把梭 ——
breaking change 之所以叫 breaking，就是会碎。

### 3. npm audit 要当真

```bash
npm audit            # 看漏洞
npm audit fix        # 自动修（可能动版本，看 diff）
```

高危漏洞别拖。`npm audit fix` 改了版本范围，
提交前 review 一遍（它可能升 minor/major）。

### 4. Renovate / Dependabot：自动化的「升级流」

仓库里配个 bot，每周开 PR：「把 lodash 从 4.17.20 升到 4.17.21」。
CI 跑测试，绿了合并。**小步快跑地升级，比憋半年一次大升级
（然后炸三天）强得多。** 个人项目也值得配。

## 五、版本号怎么看「项目健康度」

挑依赖时的参考信号：

```text
0.x.y        – 试验品，API 随时变，生产慎用
1.x.y        – 稳定多年，生态成熟（也可能停滞）
高频大版本（一年三次 2.0/3.0/4.0）– 迭代猛，但要跟着跑
最后发布三年前    – 无人维护，慎入（安全问题没人修）
```

查看：`npm view pkg versions`、`npm view pkg time.modified`
（最后发布时间）、GitHub 的 release 频率。

## 六、Date-based 版本号：另一套哲学

有些项目用日期版本：`2026.10.1`、`Ubuntu 24.04`、
`Chrome 130`（其实是 `130.0.6698.77` 的四段式变体）。

Date-based 的逻辑：「版本号就是发布日期，不承诺兼容性」。
配合持续交付（Chrome、Ubuntu LTS）工作得很好。

**做库/框架别学这个**（调用方需要兼容承诺）；
做持续交付的应用/系统，日期版本反而清爽。

## 七、给库作者的话

发布时：

```bash
npm version patch    # 1.2.3 → 1.2.4，自动打 git tag
npm version minor    # 1.2.3 → 1.3.0
npm version major    # 1.2.3 → 2.0.0
```

它自动改 package.json、创建 tag，你只管 push。
CHANGELOG 要认真写 —— **用户升不升级，就看这个**
（Conventional Commits + 自动生成 CHANGELOG 是标配）。

## 小结

语义化版本三句话：**MAJOR 破坏、MINOR 加功能、PATCH 修 bug；
`^` 是默认不是锁；lock 文件进 git**。实践四纪律：
**依赖别锁死、大版本当项目做、audit 别拖、
bot 自动化升级**。版本号是作者和使用者之间的合同 ——
看懂它，少踩八成的「升级惊魂」。
