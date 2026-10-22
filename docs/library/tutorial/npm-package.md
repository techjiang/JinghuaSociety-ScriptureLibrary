---
title: npm 与 package.json 完全指南
createTime: 2026-10-22
permalink: /library/tutorial/npm-package/
description: dependencies 与 devDependencies 的区别、语义化版本、scripts 与 lock 文件
---
每个前端项目都有 `package.json`，但能把里面每个字段讲清楚的人不多。
`dependencies` 和 `devDependencies` 到底怎么分？`^1.2.3` 和 `~1.2.3`
差在哪？`npm ci` 和 `npm install` 该用哪个？这篇一次说清。

## 一、package.json 核心字段

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": { "vue": "^3.5.13" },
  "devDependencies": { "vite": "^7.0.0" }
}
```

### dependencies vs devDependencies

判断标准一句话：**这个包是「产品运行需要的」还是「开发/构建才需要的」**。

| 类型 | 例子 | 生产环境要装吗 |
| --- | --- | --- |
| dependencies | vue、react、axios、lodash | **要** |
| devDependencies | vite、eslint、typescript、jest | 不要（CI 除外） |

装错了的后果：生产镜像里塞一堆构建工具，体积翻几倍。
`npm install 包名 --save-dev`（或 `-D`）装开发依赖。

### private: true

个人/内部项目一定加上。加了之后 `npm publish` 会拒绝发布 ——
防止你哪天手滑把私有代码推到公网仓库（真有过这种事故）。

### scripts：项目命令中心

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --fix",
    "test": "vitest",
    "format": "prettier --write ."
  }
}
```

两个实用技巧：

**pre/post 钩子**：`prebuild` 会在 `build` 前自动跑，`postbuild` 在跑完后跑：

```json
{
  "scripts": {
    "prebuild": "rm -rf dist",
    "build": "vite build",
    "postbuild": "node scripts/copy-assets.js"
  }
}
```

**脚本里互相调用**：`npm run` 可以调其他脚本：

```json
{ "scripts": { "check": "npm run lint && npm run test" } }
```

## 二、版本号：^ 和 ~ 的秘密

npm 包里版本号都是「语义化版本」（SemVer）：`主版本.次版本.补丁号`。

```text
1.4.2
│ │ └── 补丁：修 bug，不影响功能
│ └──── 次版本：加功能，向后兼容
└────── 主版本：破坏性变更，API 不兼容
```

你写的范围符号决定「能装到多新的版本」：

| 写法 | 含义 | 例子 |
| --- | --- | --- |
| `1.2.3` | 锁死这个版本 | 只装 1.2.3 |
| `^1.2.3` | 1.x.x 里最新的（默认） | 能装 1.9.9，不装 2.0.0 |
| `~1.2.3` | 1.2.x 里最新的 | 能装 1.2.9，不装 1.3.0 |
| `>=1.2.3` | 不低于 1.2.3 | 2.x 也装 |
| `*` 或 `latest` | 最新 | 风险自负 |

**`^` 是 npm 默认行为**（你 `npm install vue` 不写范围，它默认加 `^`）。
所以「锁版本」必须显式写死 `1.2.3`，或者靠 lock 文件。

**主版本号跳变要警惕**：`^1` 永远不到 `2`，这是 SemVer 的安全绳。
但生态里 `0.x` 版本不算数 —— `^0.4.2` 只允许 `0.4.x`，
因为 0.x 的 API 随时可能全变。

## 三、lock 文件：团队协作的锚

`package-lock.json`（或 `pnpm-lock.yaml` / `yarn.lock`）记录的是
**整棵依赖树的确切版本**。你写 `^3.5.0`，lock 里记的是「今天装到的 3.5.17」。

为什么必须有它：

- 没有 lock，同事 `npm install` 可能装到 3.6.0，你本地是 3.5.17 ——
  「我这好的啊」疑案频发；
- CI 上每次装可能不一样，玄学 bug 的温床。

**规矩：lock 文件必须提交进 git，别手改，冲突了重新 install 生成。**

### npm ci vs npm install

| | npm install | npm ci |
| --- | --- | --- |
| 读 lock | 参考（可能更新） | 严格遵循 |
| 改 lock | 可能 | 不改，不一致直接报错 |
| 速度 | 慢 | 快（跳过解析） |
| 删 node_modules | 增量装 | **先删干净再装** |
| 用途 | 本地开发 | **CI / Docker 构建** |

本站 CI 用的就是 `npm install`（因为 npm 10/11 的 peer 记录差异，之前踩过坑），
但如果你 lock 文件健康，**CI 里优先 `npm ci`**。

## 四、常用命令速查

```bash
npm install              # 装全部依赖（按 package.json）
npm install 包名          # 装并写入 dependencies
npm install -D 包名       # 装并写入 devDependencies
npm uninstall 包名        # 卸载
npm update               # 在版本范围内更新到最新
npm outdated             # 看哪些包能更新
npm ls 包名               # 看装的版本和依赖树
npm audit                # 安全漏洞扫描
npm audit fix            # 自动修漏洞（可能升版本，谨慎）
npm run 脚本名            # 跑 scripts 里的命令
npx 包名 命令             # 临时下载并执行（不安装）
```

### npx：不安装也能用

```bash
npx create-vite@latest my-app      # 临时下载最新版 create-vite 并执行
npx eslint --init                  # 本地没装 eslint 也能跑
npx cowsay hello                   # 玩玩
```

## 五、node_modules 的那些事

**为什么那么大**：你装 1 个包，它依赖 5 个包，那 5 个又各依赖几个……
npm 3 之前是嵌套安装（一份包存多份），后来改成扁平化（提升到顶层），
但版本冲突时还是得嵌套。四百多兆不稀奇。

**幽灵依赖**：你在代码里 `import 'foo'`，但 package.json 里没声明 foo ——
因为它被提升到了顶层你能 import 到。哪天 foo 不再被提升，代码就崩。
**规矩：用了什么就声明什么**。pnpm 默认禁止幽灵依赖，这是它比 npm 严的地方。

**别提交 node_modules**：`.gitignore` 加上（本站仓库已加）。
有人把 node_modules 提交进 git，仓库几个 G，clone 到下辈子。

## 六、发布自己的包（进阶）

写完工具想分享：

```bash
npm login
npm publish
```

发布前检查清单：

1. `private` 不是 `true`；
2. 包名没被占用（`npm view 包名` 查一下）；
3. `files` 字段白名单（别把源码测试全发上去）：

```json
{
  "name": "my-utils",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"]
}
```

4. README 写好（npm 官网直接渲染它）。

版本更新用 `npm version patch/minor/major`，它会自动改版本号、
打 tag，你只管 push。

## 小结

日常记住四条：**依赖分两类（runtime/开发）、版本 `^` 是默认不是锁、
lock 必须进 git、CI 用 ci 不用 install**。其他的命令 `npm help` 随查随有。
把 package.json 当项目的「说明书 + 命令中心」对待，它就不只是个配置文件。
