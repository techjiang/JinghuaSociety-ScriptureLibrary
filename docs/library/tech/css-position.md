---
title: CSS 定位完全指南
createTime: 2026-10-22
permalink: /library/tech/css-position/
description: static/relative/absolute/fixed/sticky 五种定位的行为、场景与坑
---

# CSS 定位完全指南

定位（`position`）五个值，日常只用两三个，但每个都有
「不设nan」的坑。这篇把五个讲清，配使用场景和翻车现场。

## 一、五种定位速览

```text
static    默认，不定位（设 top/left 无效）
relative  相对自己原来的位置偏移，原来占的地方还在
absolute  脱离文档流，相对最近的定位祖先定位
fixed     脱离文档流，相对视口（浏览器窗口）定位
sticky    粘性：正常流里，到阈值变 fixed
```

## 二、逐个说

### static：默认

文档流的自然位置。**只能用来「取消定位」**（`position: static`
覆盖继承来的 absolute/fixed）。

### relative：微调神器

```css
.badge {
  position: relative;
  top: -2px;      /* 比自己原位置高 2px（视觉微调）*/
  left: 4px;
}
```

特点：

- **不脱离流** —— 原来占的地方还占着，后面的元素不会挤上来；
- `top/left` 是「相对自己」的偏移，可正可负；
- 最常见用途：当 `absolute` 子元素的**定位锚点**（见下）；
- 图标对齐微调（「这个图标往下 1px 才和文字对齐」）。

### absolute：精准摆放

```css
.tooltip {
  position: absolute;
  top: 100%;        /* 相对定位祖先：父顶边算，往下 100%（= 父的高度）*/
  left: 50%;
  transform: translateX(-50%);    /* 配合位移实现居中 */
}
```

关键规则：**相对「最近的定位祖先」（position 非 static 的元素）定位**；
找不到，一路往上到初始包含块（通常是 body/视口）。

```html
<!-- 经典结构：父 relative 当锚，子 absolute 摆放 -->
<div style="position: relative">
  父元素
  <div style="position: absolute; top: 0; right: 0">角标</div>
</div>
```

**翻车点**：父忘了 `position: relative`，子 absolute 跑到了
页面角落 —— 「我的角标怎么飞了」九成是这个。

### fixed：钉在视口

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;        /* 撑满宽 */
  z-index: 100;
}
```

- 相对**视口**定位，滚动不动；
- **脱离流**：不占地方，后面的内容会「钻」到它下面
  （所以 fixed 头要配 `body { padding-top: 头高 }`）；
- 祖先有 `transform/filter/perspective` 时，fixed 会以那个祖先为基准
  （不是视口！）—— 移动端「fixed 弹层跟着滚」的玄学多因为这。

### sticky：两者杂交

```css
.sidebar {
  position: sticky;
  top: 20px;        /* 距视口顶 20px 时吸住 */
}
```

- **在流里**（占地方），但滚动到阈值后「粘」住；
- 阈值由 `top/left/right/bottom` 定义；
- **只在最近的滚动祖先内有效**（滚出父容器就跟着走）；
- 必须给阈值，不给等于 relative。

```html
<!-- 经典：长目录侧栏，滚到顶吸住 -->
<aside style="position: sticky; top: 20px; align-self: start">
  目录
</aside>
```

**注意 `align-self: start`**：在 flex/grid 容器里，
sticky 元素默认被拉伸成等高，sticky 失效 —— 加 `align-self: start`。

## 三、场景选型表

| 需求 | 用啥 |
| --- | --- |
| 图标微调对齐 | relative |
| 角标/徽标/下拉菜单 | 父 relative + 子 absolute |
| 弹窗/抽屉 | fixed + 遮罩 |
| 顶栏/返回顶部 | fixed（或 sticky） |
| 侧边目录/表头 | sticky |
| 取消定位 | static |

## 四、层叠：z-index 的规则

```css
.modal { z-index: 1000; }
```

z-index 只在**定位元素**（非 static）上生效。**大的盖小的**，
但只在同一「层叠上下文」里比。

常见问题：「我 z-index 9999 还被盖」——

- 盖你的是**祖先**建的层叠上下文里更高的；
- 或者对方也定位且 z-index 更大；
- 或者对方根本不是定位元素但创建了新的层叠上下文。

排查：DevTools Elements → Computed → 看 Stacking Context。
**别只会狂加 9** —— 9999 对 99999 没用，理清上下文才有用。

## 五、定位的副作用：脱流

absolute/fixed **脱离文档流** = 不占空间 + 后面的元素当它不存在。

- 用 absolute 做布局（比如「三栏中间 absolute」）—— 
  高度塌陷、内容重叠的噩梦；
- 正解：absolute 只用于「浮在内容上」的小东西（角标、tooltip、
  弹层），大布局用 flex/grid（[布局模式](../css-layout.md)）。

## 六、无障碍与体验细节

```css
/* 弹层打开时锁滚动（防背景跟着滚）*/
body.modal-open { overflow: hidden; }

/* fixed 元素盖住焦点？打开弹层把焦点移进去，关闭还回去 */
/* 键盘 Esc 关弹层 —— 别让键盘用户困在弹层里 */
```

定位做交互组件时，键盘和焦点管理比位置更重要 ——
不然视觉正常，读屏/键盘用户直接卡死。

## 小结

定位五兄弟：**relative 微调和当锚、absolute 精准摆放（找锚点）、
fixed 钉视口（注意脱流）、sticky 粘住（记得给阈值）、
static 用来取消**。层叠看 z-index 但更要看层叠上下文。
布局交给 flex/grid，定位只做「浮层」—— 这是 2026 年的正道。
