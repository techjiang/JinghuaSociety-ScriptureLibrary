---
title: 免费商用字体资源
createTime: 2026-10-22
permalink: /library/resources/free-fonts/
description: 中文免费字体、英文字体站点与授权常识，别再乱用微软雅黑了
---

# 免费商用字体资源

「字体侵权律师函」是设计公司的经典噩梦。个人开发者也要留神：
你网站用的字体，真的授权了吗？这篇收集中文免费字体、
英文字体站，以及授权常识。

> 免责声明：授权条款会变，商用前以字体官方说明为准。本文不构成法律意见。

## 一、中文字体：免费商用的选择

中文免费字体比英文少（造字成本高），但够用：

| 字体 | 风格 | 授权 |
| --- | --- | --- |
| **思源黑体**（Source Han Sans） | 现代无衬线，字重全 | SIL OFL，免费商用 |
| **思源宋体**（Source Han Serif） | 衬线，正文/标题都行 | SIL OFL，免费商用 |
| **阿里巴巴普惠体** | 简洁现代，官方出品 | 免费商用 |
| **MiSans**（小米） | 几何感，屏显好 | 免费商用 |
| **HarmonyOS Sans**（华为） | 均衡耐看 | 免费商用 |
| **OPPO Sans** | 现代人文 | 免费商用 |
| **得意黑** | 斜体标题，有性格 | 免费商用（个人/企业） |

**实用建议**：思源黑体是「不会错」的选择 —— 字重齐全
（ExtraLight 到 Black）、屏显优化好、OFL 授权干净。

**坑：微软雅黑不能商用**。系统自带 ≠ 你能用。它是微软的
商业授权字体，用在企业官网/产品里，律师函真会来。
个人学习练习无所谓，上线项目换掉。

## 二、英文字体站点

- **[Google Fonts](https://fonts.google.com)**：第一站。全免费
  （OFL/Apache 授权），CDN 直链，`font-display: swap` 别忘；
- **[Fontshare](https://www.fontshare.com)**：Indian Type Foundry
  出品，质量高，部分免费商用；
- **[The League of Moveable Type](https://www.theleagueofmoveabletype.com)**：
  老牌开源字体站；
- **[Inter](https://rsms.me/inter/)**：屏显 UI 之王，GitHub/
  Mozilla 都在用，OFL 授权；
- **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)**：
  程序员等宽字体，连字支持，免费。

**本站用**：logo 和代码用系统字体栈（`PingFang SC`/
`Microsoft YaHei`/`Segoe UI`），没加载 Web 字体 ——
中文 Web 字体包太大（几 MB 起），不值得。

## 三、授权常识：三句话

1. **「个人免费」≠「企业免费」**。很多字体个人用不要钱，
   公司用要授权（比如某些日系字体）。看条款里的「商用」定义；
2. **嵌入 PDF/图片不等于规避**。把字体轮廓用在设计稿里，
   部分授权仍算「使用」。OFL 允许嵌入，其他要看；
3. **SIL OFL 是最友好的开源字体授权**：免费商用、可修改、
   可嵌入，唯一要求：别单独卖字体本身。

## 四、Web 字体优化

中文站上自定义字体，务必注意体积：

```css
/* 1. font-display: swap —— 字体没到位前用后备字体，别白屏 */
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-display: swap;
}

/* 2. 只用需要的字重，别全家桶 */
/* 400 + 700 两档够了，五档体积翻五倍 */

/* 3. 中文字体考虑子集化：只打包用到的字 */
```

**子集化工具**：[fontmin](https://github.com/ecomfe/fontmin)、
[subfont](https://github.com/Munter/subfont)。中文常用字 3500 个
打包后几百 KB，全字库几 MB —— 差别巨大。

**更优解**：标题用系统字体 + 特殊字重，正文用系统字体，
「设计感」靠排版（字号、行高、留白）而不是稀奇字体。
本站走这条路。

## 五、图标字体 vs SVG 图标

以前图标用 iconfont（字体方式），现在主流是 SVG：

- **SVG**：多色支持、按需加载、无 FOUT（字体闪烁）问题；
- **iconfont 字体**：一套字体几十个图标，但单色、加载整包。

本站用 Iconify 方案（主题内置）—— 按需加载单个 SVG，
两千多个图标随便挑，性能最好。

## 小结

中文免费字体选**思源黑体/阿里巴巴普惠体**不会错，
英文去 **Google Fonts**。三条铁律：**微软雅黑不商用、
「个人免费」看清楚、OFL 是好朋友**。
加载 Web 字体记得 `font-display: swap` 和子集化 —— 
中文字体包，省的都是用户体验。
