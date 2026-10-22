---
title: VS Code 高效使用技巧
createTime: 2026-10-22
permalink: /tutorial/vscode-tips/
description: 快捷键、多光标、命令面板、调试与设置同步，每天省半小时
---

# VS Code 高效使用技巧

编辑器是程序员待得最久的地方。同样是 VS Code，有人用得行云流水，
有人还在跟鼠标较劲。这篇挑**真正每天用**的技巧讲，不堆快捷键表。

## 一、先记住这五个快捷键

其他都可以忘，这五个忘了天天亏：

| 快捷键 | 作用 | 使用场景 |
| --- | --- | --- |
| `Ctrl+P` | 快速打开文件 | 项目里跳文件，别用鼠标点树 |
| `Ctrl+Shift+P` | 命令面板 | 任何「找不到按钮」的操作 |
| `Ctrl+`` | 打开/关闭终端 | 跑命令不用切窗口 |
| `Alt+↑/↓` | 上下移动整行 | 调整代码顺序 |
| `Ctrl+/` | 注释/取消注释 | 调试代码 |

`Ctrl+P` 输入 `>` 可以进命令面板，输入 `:` 跳行号，输入 `@` 跳当前文件的符号。
一个框干三件事。

## 二、多光标：批量改名的救星

要把十处 `userName` 改成 `username`：

1. 双击选中第一处 `userName`；
2. `Ctrl+D` 逐个选下一处（按一次选一个）；
3. 直接打字，十处一起改。

或者更粗暴：`Ctrl+Shift+L` 一次选**所有**匹配项。

其他多光标技巧：

- `Alt+鼠标点击`：多点几个光标，同时编辑；
- `Ctrl+Alt+↑/↓`：上下加光标（竖列编辑）；
- `Home/End` 配多光标，批量在行首行尾插东西。

改配置、改属性名、批量格式化 JSON —— 多光标是 VS Code 最被低估的功能。

## 三、终端集成：不切窗口

`Ctrl+`` 开终端，直接在编辑器里跑命令：

```bash
npm run dev
git status
```

终端里跑 `code .` 可以在当前目录打开 VS Code；
跑 `code 文件名` 直接打开文件。

多个终端：终端面板右上角的 `+` 号新建，`trash` 图标关。
跑 dev server 一个、跑测试一个，互不干扰。

## 四、调试：不用 console.log 了

写 Node 或前端代码，断点调试比 `console.log` 高效一个量级。

**Node 项目**：左侧 Run and Debug（`Ctrl+Shift+D`）→ 点 "create a launch.json" →
选 Node.js，生成配置后 F5 启动。断点打在代码行号左侧，
变量、调用栈、求值全在调试面板。

**浏览器端**：装 Debugger for Chrome 扩展，配 `launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "启动 Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

F5 起浏览器，断点直接打在源码上。原理和 Chrome DevTools 一样
（详见 [Chrome DevTools 调试技巧](../chrome-devtools.md)），
但不用在 DevTools 里翻压缩后的代码。

## 五、设置：几行改习惯

`Ctrl+Shift+P` → "Preferences: Open Settings (JSON)"，贴这些：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.pttier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.autoSave": "onFocusChange",
  "editor.tabSize": 2,
  "editor.rulers": [80],
  "explorer.confirmDelete": false
}
```

逐条解释：

- `formatOnSave`：保存即格式化，团队代码风格统一的底线；
- `autoSave: onFocusChange`：切窗口自动存，防崩了丢代码；
- `rulers: [80]`：80 列参考线，逼你把长行拆开；
- `confirmDelete: false`：删文件不弹确认（手快党专属，慎用）。

**设置同步**：左下角齿轮 → "Turn on Settings Sync"，用 GitHub 账号同步。
换电脑五分钟恢复手感，这是重装系统后第一件该做的事。

## 六、插件：少而精

我的清单（和[前端环境搭建](../frontend-env.md) 那篇一致）：

| 插件 | 干嘛的 |
| --- | --- |
| ESLint | 规范检查 |
| Prettier | 格式化 |
| GitLens | 看每行代码谁改的 |
| Error Lens | 报错直接显示在行上 |
| Path Intellisense | 路径自动补全 |
| Auto Rename Tag | 改开始标签，结束标签跟着改 |
| DotENV | .env 高亮 |

插件不是越多越好。装十几个互相打架的，启动慢半拍，
弹窗多一倍。**用到什么装什么，季度清理一次。**

## 七、命令面板：忘掉菜单

命令面板（`Ctrl+Shift+P`）能干的事超乎想象：

- "Format Document" 格式化
- "Change All Occurrences" 全局替换当前词
- "Rename Symbol"（F2）重命名变量，所有引用跟着改
- "Go to Symbol in Workspace"（`Ctrl+T`）跳函数/类定义
- "Toggle Word Wrap" 开关自动换行
- "Emoji…" 插入 emoji（真的）

养成习惯：**想要什么功能，先 `Ctrl+Shift+P` 搜，搜不到再翻菜单**。
大部分「VS Code 有没有这个功能」的疑问，都是有的，只是藏在面板里。

## 八、被忽略的小技巧

- **分屏**：`Ctrl+\` 左右分栏，对照代码/文档写；
- **Zen 模式**：`Ctrl+K Z` 全屏无干扰，只剩代码；
- **折叠区域**：`Ctrl+Shift+[` / `]`，大文件理清结构；
- **Markdown 预览**：`Ctrl+Shift+V`，写 README 实时看效果（本站文章就这么写的）；
- **比较文件**：右键 → "Select for Compare" → 右键另一个文件 → "Compare with Selected"，diff 不切工具。

## 小结

VS Code 的核心效率来自三件事：**命令面板（少点鼠标）、
多光标（批量编辑）、断点调试（少写 log）**。
快捷键不用背，用得多自然记住 —— 先从 `Ctrl+P` 和 `Ctrl+D` 开始，
这俩回本最快。
