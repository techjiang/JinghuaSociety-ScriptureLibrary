---
title: 环境变量与配置管理
createTime: 2026-10-22
permalink: /tutorial/dotenv/
description: .env 文件、Vite/VuePress 的环境变量、多环境配置与密钥安全
---

# 环境变量与配置管理

「我这本地好的啊」—— 一半是缓存，另一半是**配置没管好**：
数据库地址写死在代码里，开发连本地、生产连测试库，一塌糊涂。
这篇讲怎么用环境变量把配置管明白。

## 一、核心思想：代码不变，配置随环境变

```text
同一份代码 ──► 开发环境：localhost:3000 数据库、debug 日志
           └─► 生产环境：rds.xxx.com 数据库、error 日志
```

判断标准：**会变的东西进环境变量，不变的东西留代码里**。

该进 env 的：数据库连接串、API 密钥、第三方服务地址、功能开关、
日志级别。不该进的：业务常量（比如「订单超时 30 分钟」这种产品决策）。

## 二、.env 文件：本地配置的家

项目根目录建 `.env` 文件：

```bash
# .env —— 所有环境共享的默认值
VITE_APP_TITLE=我的应用
VITE_API_TIMEOUT=10000
```

不同环境的文件：

```text
.env                # 所有环境加载（通常放公共默认值）
.env.development    # 开发环境（npm run dev 时加载）
.env.production     # 生产环境（npm run build 时加载）
.env.local          # 本地私有，优先级最高，**必须进 .gitignore**
```

加载优先级（后者覆盖前者）：

```text
.env < .env.local < .env.[mode] < .env.[mode].local
```

**`.env.local` 是你的私人领地**：放本地数据库密码、测试 token。
`.gitignore` 里一定有它 —— 提交了就等于把密钥送到 GitHub 公开展示。

## 三、Vite 项目的读取方式

Vite 只把 **`VITE_` 前缀**的变量暴露给前端代码（安全设计，
防止你把密钥打进前端包）：

```bash
# .env.production
VITE_API_BASE=https://api.myapp.com
VITE_APP_TITLE=我的应用
DB_PASSWORD=super-secret   # 没有 VITE_ 前缀，前端代码读不到！
```

代码里用：

```ts
const apiBase = import.meta.env.VITE_API_BASE
const isDev = import.meta.env.DEV      // 内置：是否开发环境
const isProd = import.meta.env.PROD    // 内置：是否生产环境
const mode = import.meta.env.MODE      // 'development' | 'production'
```

TS 项目加类型提示（`vite-env.d.ts`）：

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

这样 `import.meta.env.VITE_API_BASEE`（拼错了）会报错，而不是 `undefined` 到运行时。

## 四、Node 后端的 dotenv

Node 不认 `.env` 语法，用 `dotenv` 包：

```bash
npm install dotenv
```

```js
require('dotenv').config()   // CommonJS：最早加载
// 或 import 'dotenv/config'  // ESM

const dbUrl = process.env.DATABASE_URL
const port = process.env.PORT || 3000
```

**注意顺序**：`dotenv.config()` 要在引用其他模块**之前**调用，
不然那些模块读 `process.env` 时还是空的。

校验必填变量（缺了早崩比晚崩好）：

```js
require('dotenv').config()

const required = ['DATABASE_URL', 'JWT_SECRET']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`缺少环境变量: ${key}`)
    process.exit(1)
  }
}
```

## 五、多环境：一份模板，多份实例

团队协作的标配：仓库里放 `.env.example`（模板，无真实值），
每个人复制成自己的 `.env.local`：

```bash
# .env.example —— 提交进 git
DATABASE_URL=postgres://user:password@localhost:5432/mydb
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-me-in-production
```

README 里写一句：「复制 `.env.example` 为 `.env.local`，填上你的值」。

生产环境（服务器/CI）的变量不走 `.env` 文件，走平台的环境变量配置
（GitHub Actions 的 Secrets、Docker 的 `-e`、K8s 的 ConfigMap）。
`.env` 文件只用于本地开发 —— 这是约定，也是安全边界。

## 六、VuePress 主题里的环境变量

本站（VuePress）就在用环境变量：`config.ts` 里通过 `process.argv` 判断
dev/build 模式来切换 base 路径。VuePress 的 `config.ts` 运行在 Node 环境，
可以直接读 `process.env`：

```ts
const isCI = !!process.env.CI
const base = process.env.BASE_URL ?? '/'
```

## 七、密钥安全：三条铁律

1. **密钥不进 git**：`.gitignore` 挡住 `.env.local`，提交前 `git status` 看一眼；
2. **前端不放真密钥**：前端代码全公开，任何「前端密钥」都等于公开密钥。
   需要密钥的请求走后端代理，别在前端直连第三方服务；
3. **泄露了立刻换**：GitHub 有自动扫描（push 上去几分钟内发警告邮件），
   真泄漏了别删 commit 自欺欺人 —— 历史里还在，直接吊销换新。

## 八、调试技巧

```bash
# Vite 项目：打印当前生效的所有变量（谨慎，别在生产跑）
node -e "require('dotenv').config(); console.log(process.env)" | grep VITE

# 或临时在代码里
console.log(import.meta.env)  // 浏览器控制台看
```

「变量没生效」的排查顺序：文件名对不（`.env.development` 拼错）→
模式对不（dev 加载 development 文件）→ 前缀对不（Vite 要 VITE_ 开头）→
缓存（改完 .env 要重启 dev server）。

## 小结

配置管理三板斧：**会变的进 .env、私密的进 .env.local 且不提交、
模板放 .env.example 给团队抄**。前端密钥没有隐私，后端密钥别进包。
把这套立起来，「本地好的啊」事故能少一半。
