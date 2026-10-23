---
title: VS Code 插件精选
createTime: 2026-10-22
permalink: /library/resources/vscode-extensions/
description: 按用途分类的 VS Code 插件清单，全是自用款，附精简原则
---

<CategoryTag name="资源" link="/library/resources/" />
插件装多了，启动慢半拍、弹窗多一倍、快捷键还互相打架。
这份清单按用途分，全是装机自用款，每个只留一个最顺手的。

## 一、代码质量（必装）

| 插件 | 作用 |
| --- | --- |
| **ESLint** | 规范检查，红波浪线实时提醒。装了要配 `eslint.config.js` |
| **Prettier** | 格式化。配 `formatOnSave`，保存即排版 |
| **Error Lens** | 报错直接红底显示在代码行尾，不用 hover 看 |
| **Code Spell Checker** | 拼写检查，专治 `recieve`、`seperate` |

四个齐了，代码质量的基本盘就有了。别装两个格式化插件互相打架。

## 二、效率提效

| 插件 | 作用 |
| --- | --- |
| **GitLens** | 每行代码显示谁、什么时候改的。甩锅/追溯神器 |
| **Path Intellisense** | 路径自动补全，`./components/…` 敲个 `/` 就出提示 |
| **Auto Rename Tag** | 改 `<div>` 开头，结尾跟着改 |
| **Import Cost** | 行内显示 `import` 的包体积，警惕大依赖 |
| **Todo Tree** | 收集全项目的 `TODO/FIXME` 注释成侧边栏清单 |

`Todo Tree` 是被低估的：散落的 `// TODO` 终于有个地方集中看，
review 自己的烂尾楼专用。

## 三、前端专项

| 插件 | 作用 |
| --- | --- |
| **Vue - Official** | Vue 3 官方，模板类型检查、路径跳转 |
| **ES7+ React/Redux snippets** | React 代码片段（`rafce` 一秒生成组件骨架） |
| **Tailwind CSS IntelliSense** | Tailwind 类名补全 + 悬停看实际 CSS |
| **Sass** | `.scss` 语法支持 |
| **DotENV** | `.env` 文件高亮 |

写什么框架装什么，别全家桶都装。

## 四、 Markdown / 写作（本站就这么写的）

| 插件 | 作用 |
| --- | --- |
| **Markdown All in One** | 目录生成、表格格式化、快捷键 |
| **markdownlint** | Markdown 规范检查 |
| **Paste Image** | 截图直接 `Ctrl+Alt+V` 贴进 Markdown，自动存文件 |

`Paste Image` 写文档神器：截图粘贴自动存到 `./images/` 并插入引用，
手写 `![](...)` 的日子终结。

## 五、美化与主题

- **One Dark Pro**：经典深色，久看不累；
- **GitHub Theme**：贴近 GitHub 观感；
- **Material Icon Theme**：文件图标按类型显示，找文件快；
- **indent-rainbow**：缩进着色，Python/深嵌套 HTML 的救命稻草。

主题这事主观，挑一个用到底，别每周换。

## 六、AI 辅助（2026 版）

- **GitHub Copilot**：行内补全老牌，tab  Accept 就行；
- **Codeium**：免费替代品，补全质量不差；
- **Cursor**：严格说是编辑器分支不是插件，AI 深度融合，
  愿意换编辑器的值得试。

AI 补全当「副驾驶」：接受建议前扫一眼，别让它替你思考。
生成的代码是草案，不是答案。

## 七、不建议装的类型

- **多个格式化插件**（Prettier + Beautify 同装 = 精神分裂）；
- **「XX 语言全家桶」**（除非真写那门语言，占启动时间）；
- **来历不明的小插件**（有偷代码/传数据的前科，装前看评价和权限）；
- **功能重复的内置替代**（比如「中文语言包」——VS Code 命令面板
  早已支持中文输入直接搜）。

## 八、管理建议

```bash
# 列出已装插件（命令行）
code --list-extensions

# 导出清单（换电脑用）
code --list-extensions > extensions.txt

# 一键安装
cat extensions.txt | % { code --install-extension $_ }   # PowerShell
```

或者用 Settings Sync（GitHub 账号同步）—— 换电脑五分钟恢复手感。
**季度审查一次**：把三个月没主动用过的插件卸了，启动速度会感谢你。

## 小结

插件哲学：**少而精，按需装**。核心四件（ESLint/Prettier/GitLens/
Error Lens）+ 框架官方插件 + 一两个提效，覆盖九成场景。
其他都是 distraction。
