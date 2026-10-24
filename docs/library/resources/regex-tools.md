---
title: 正则可视化与调试工具
createTime: 2026-10-22
permalink: /resources/regex-tools/
description: regex101、Debuggex 与可视化方案——把正则从玄学变工程
---

<CategoryTag name="资源" link="/library/resources/" />

正则写的时候爽，三天后自己看不懂。这篇收「调试 + 可视化 +
学习」工具，把正则从玄学变工程。（语法基础见
[正则食谱](../regex-cookbook.md)。）

## 一、regex101：行业标准

[regex101.com](https://regex101.com) —— 正则调试的「默认答案」。

**功能**：

- 实时匹配高亮（左边写正则，右边看匹配）；
- **逐字符解释**（Explanation 面板：每个符号什么意思）；
- 单元测试（Test 面板：一组「该匹配/不该匹配」的用例）；
- 多方言（PCRE2/JS/Python/Go/Java）；
- 代码生成（把正则变成各语言的字符串字面量）。

**日常流**：

```text
① 粘贴正则 + 测试文本
② 看高亮对不对
③ 用 Explanation 确认语义（怀疑人生时用）
④ Test 面板加几条边界用例
⑤ 复制成代码
```

**支持的 flavor 要选对** —— JS 和 PCRE 语法有差异
（比如 `\d` 在 JS 里默认不匹配 Unicode 数字）。

## 二、Debuggex：可视化状态机

[debuggex.com](https://debuggex.com) —— 把正则画成
**状态机流程图**。

```text
输入正则 → 自动画出 NFA/DFA 图 → 点「播放」逐步看匹配过程
```

**适合**：理解「这个正则到底怎么匹配的」（回溯路径）、
教学演示。界面复古（WebGL），但思路独特。

## 三、RegexLearn / iHateRegex：学习向

### RegexLearn

[regexlearn.com](https://regexlearn.com) —— **游戏化教程**，
一关一关学（从 `.` 到 lookahead）。零基础友好，
两小时通关。

### iHateRegex

[ihateregex.io](https://ihateregex.io) —— 按
「我要匹配什么」组织的模式库：邮箱、URL、IP、日期、
十六进制颜色…… 复制即用。

**本站[正则食谱](../regex-cookbook.md) 也配了常用模式速查**
—— 两边对着用。

## 四、VS Code 里调试

不想开网页？编辑器内方案：

- **Regex Previewer**（插件）：边写正则边高亮
  当前文件里的匹配（[市场](https://marketplace.visualstudio.com/items?itemName=chrmarti.regex)）；
- **正则预览**（部分语言包自带）。

**配合测试文件**：写正则前，先建个 `test.txt` 放各种
边界用例，插件里实时看命中 —— 正则的 TDD。

## 五、命令行工具

```bash
# grep -P（Perl 正则，比 POSIX 强）
grep -P '\d{3}-\d{4}' file.txt

# rg（ripgrep，Rust 正则引擎，默认强）
rg '\b\w+@\w+\.\w+\b' file.txt

# sd（更直观的替换）
sd '(\w+)=(\w+)' '$2=$1' file.txt
```

**Node/Python 脚本里**：正则写进测试，
[Jest/Vitest](https://vitest.dev) 一条条断言 ——
正则的回归测试比 UI 测试好写十倍。

## 六、性能检查

正则可能「灾难性回溯」（`(a+)+b` 匹配长串 a 直接卡死）——

- regex101 的 steps 计数：匹配用了多少步
  （几千步以上警惕）；
- 超长输入测试：贴 10000 字符看卡不卡；
- 规避：嵌套量词、前后交替改写法
  （[正则食谱](../regex-cookbook.md) 的「性能红线」一节）。

## 七、收藏配置

个人工具箱建议：

```text
调试：regex101（书签，选 JS flavor）
可视化理解：Debuggex（偶尔）
查模式：iHateRegex / 本站正则食谱
写时验证：VS Code Regex Previewer
```

**正则学习的投入产出**：学会常用模式两小时，
受益整个职业生涯（日志分析、数据清洗、表单校验、
编辑器搜索全用它）。值得。

## 小结

正则调试三件套：**regex101（实时+解释+测试）、
iHateRegex（模式库）、VS Code Regex Previewer（写时高亮）**。
进阶理解用 Debuggex 看状态机。核心习惯：
**先写测试用例再写正则** —— 这一步，把八成的
「正则玄学」变成「正则工程」。
