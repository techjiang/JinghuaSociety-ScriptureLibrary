---
title: 加入
createTime: 2026-10-22
permalink: /join/
sidebar: false
description: 三种方式参与精华社 · 藏经阁：投稿、纠错、成为成员
---


精华社 · 藏经阁不是一个人的阁。**三种参与方式，从轻到重，挑顺手的来。**

## 方式一：投稿文章（最轻，随时开始）

写好一篇 Markdown，提到 GitHub 仓库，通过审核就收录。

**投稿要求**：

1. **领域对口**：前端、后端、运维、数据库、计算机网络、编程随笔，以及**生活日常**（通勤、桌面、咖啡、断网……写代码的人也得会生活，见[日常分类](/library/daily/)）；
2. **亲测才写**：命令和代码你亲手跑过；跑不通的坑也要写，注明环境；
3. **人话优先**：术语用完要解释。能讲给实习生听懂的，别堆给架构师看；
4. **原创首发**：不接受洗稿、拼接、纯翻译。引用他人内容要标明出处；
5. **长度不限**：300 字的踩坑记录和 3000 字的系统教程都欢迎。**有用比宏大重要**。

### 内容红线（一票否决）

为守住「可信」二字，以下情况**一律不收，已收录的发现即下架**：

1. **未获许可的商业推广**：软文、广告、导流、带佣金的返利链接、未申报的赞助内容；
   文中有产品/服务推荐时，**必须主动声明是否利益相关**，由编辑判断是否收录；
2. **抄袭与洗稿**：整段复制他人文章、翻译不注明出处、AI 生成不核实直接投稿；
   引用必须标注来源，转载需作者授权；
3. **事实错误与误导**：编造假数据、伪造命令输出、把猜测当结论；
   「我试过」是唯一通行证；
4. **敏感与违规内容**：政治敏感、违法犯罪、色情低俗、人身攻击、引战拉踩；
5. **标题党与垃圾信息**：夸大、恐吓、凑字数的水文，以及纯 SEO 堆关键词；
6. **未披露的利益冲突**：你写了某工具/课程多好，却收了对方钱没说 —— 这比不写好。

> 红线不是束缚，是底气。**读者信得过，是因为这里没有藏着卖货的。**
> 有利益就说利益，有引用就标出处 —— 干净，才长久。

**投稿流程**：

```text
① Fork 仓库 → 在对应目录新建 .md 文件
② 按模板写 frontmatter（见下方）
③ 提 Pull Request，说明「写了什么、给谁看」
④ 站长 review：内容质量 + 事实核对 + 排版规范
⑤ 合并 → 自动部署上线 → 署你名字
```

**一步到位的直达链接**（省得自己翻路径）：

| 想干什么 | 点这里 |
| --- | --- |
| Fork 仓库 | [Fork `JinghuaSociety-ScriptureLibrary`](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/fork) |
| 新建投稿文章 | [tech](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/new/main/docs/library/tech) · [tutorial](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/new/main/docs/library/tutorial) · [resources](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/new/main/docs/library/resources) · [daily](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/new/main/docs/library/daily) · [articles](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/new/main/docs/articles) |
| 发起 Pull Request | [Open a Pull Request](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/compare) |
| 提 Issue（纠错 / 提名 / 自我介绍） | [New Issue](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/issues/new/choose) |

**文章模板**（复制即用）：

```markdown
---
title: 文章标题（说清讲什么，别玩标题党）
createTime: 2026-10-22
permalink: /library/tech/your-article-slug/
description: 一两句话讲清这篇解决什么问题
---

正文开始。建议结构：
- 先讲「你会遇到什么问题」（场景驱动）
- 再讲「怎么解决」（步骤/代码/命令）
- 最后「踩坑与延伸」（可选）
```

> 教程放 `docs/library/tutorial/`，技术放 `docs/library/tech/`，
> 资源放 `docs/library/resources/`，日常放 `docs/library/daily/`，随笔放 `docs/articles/`。
> 新建文件记得写 `permalink`（例：`/library/daily/your-slug/`），否则侧边栏会消失。

## 方式二：纠错与改进（零门槛）

发现文章有错、有过时、有讲不清楚的地方：

- **小改**（错别字、失效链接）：直接提 PR，标题写 `fix: 修正 XX 文章 XX 问题`；
- **大问题**（技术错误、误导内容）：提 Issue，描述「哪段、错在哪、正确的是什么」。

**纠错被合并的贡献者，一样进[成员页](/members/)。** 修 bug 和写文章同样值钱。

## 方式三：成为常驻成员

满足以下任意两条，跟站长说一声（Issue 或邮件），即可成为成员：

1. 有三篇以上文章被收录；
2. 累计纠错/改进被合并五次以上；
3. 在社区（Issue/讨论区）持续帮助他人解决问题满三个月。

**成员有什么**：

- 成员页署名 + 个人简介 + 主页链接；
- 文章直接提交到 `docs/`，无需走 Fork 流程；
- 参与选题讨论：「下一批写什么」你有投票权；
- 优先体验新功能（RSS、搜索、评论）并提需求。

**成员要做什么**：

- 每半年至少一篇产出（文章或深度纠错），忙了跟站长说，不搞 KPI；
- review 新投稿时认真点：**你放的水，是读者踩的坑**；
- 意见不合可以吵，但吵完要给结论。对事不对人。

## 常见问题

**Q：文章会不会被改成我的名字之外的东西？**
A：合并时可能调整排版和错别字，但内容和署名是你的。重大改动会先问你。

**Q：写得不够好能投吗？**
A：能。**「我踩过的坑」比「我懂的理」更值钱**——前提是真的踩过。文笔可以练，事实不能编。

**Q：多久有回复？**
A：PR 一般 48 小时内看。超过三天没回复，Issue 里 @ 站长。

---

准备好了？

- 提第一个 PR → [Open a Pull Request](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/compare)
- 先自我介绍 → [New Issue](https://github.com/techjiang/JinghuaSociety-ScriptureLibrary/issues/new/choose)
- 有站点想加入「精链」之环 → [精链 · FeaturedLink](/featured-link/)

阁门开着，进来就是客。
