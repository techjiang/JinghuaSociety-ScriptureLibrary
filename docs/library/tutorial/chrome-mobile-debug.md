---
title: 手机页面真机调试
createTime: 2026-10-22
permalink: /library/tutorial/chrome-mobile-debug/
description: Chrome DevTools 设备模拟、真机 remote debug 与常见移动端问题排查
---

# 手机页面真机调试

「我这电脑上好的啊」—— 移动端的经典事故。模拟器能验布局，
但真机的触摸、滚动、软键盘、性能，只有真机能测。
这篇讲两条路：**DevTools 模拟（快）和真机调试（真）**。

## 一、DevTools 设备模拟：先过这关

`Ctrl+Shift+M` 打开设备工具栏：

```text
顶部选设备：iPhone 15 / Pixel 7 / iPad…
或自定义：宽 × 高 + DPR（像素比）+ UA
```

**能模拟的**：

- 视口尺寸、DPR（高清屏渲染）；
- 触摸事件（点击变成 tap）；
- UA（`navigator.userAgent`）；
- 网络限速（Fast 3G / Slow 3G）；
- 地理位置、横竖屏。

**模拟不了的**（所以要真机）：

- 真实软键盘弹出（视口压缩！）；
- iOS Safari 的特有 bug（橡皮筋滚动、300ms 延迟历史）；
- 真实触摸的手势（缩放、双指）；
- 低端机的真实性能。

**模拟阶段就要查的**：320px 窄屏不横滚、触摸目标 ≥44px、
横屏不错位、字号不用放大就看不清。

## 二、真机调试：Android（Chrome）

### 准备

1. 手机开**开发者选项** → 开 **USB 调试**
   （设置里连点「版本号」七次唤出开发者选项）；
2. USB 连电脑，手机上弹「允许 USB 调试」→ 允许；
3. 电脑 Chrome 地址栏输 `chrome://inspect/#devices`；
4. 手机 Chrome 打开你的页面（localhost 不行，要局域网 IP
   或已部署的地址）。

### 开始

`chrome://inspect` 里看到你手机的标签页 → 点 **inspect**。
弹出的 DevTools 和调试桌面页一模一样：**Elements、Console、
Network、断点全都能用**，而操作的是真机页面。

常用组合：

- Console 看真机的报错（iOS/Android 差异往往在这现形）；
- Network 看弱网下的请求（手机开飞行模式模拟断网）；
- Performance 录一段，看真机上卡在哪。

## 三、真机调试：iOS（Safari）

iOS 只能用 Safari 调试（Chrome on iOS 底层也是 Safari）：

### 准备

1. 手机：设置 → Safari → 高级 → **开 Web 检查器**；
2. 手机 Safari 打开页面；
3. Mac：Safari → 设置/偏好 → 高级 → **开显示开发菜单**；
4. USB 连上，Safari 菜单「开发」→ 你的手机 → 选标签页。

**Windows 没有 Safari 调试**。iOS 真机调试的变通：

- ** Weinre **（老牌，Node 起个服务，页面注入脚本，
  能看 Console/DOM，不能断点）；
- **Eruda / vConsole**（手机页内嵌调试面板，
  适合「临时看一眼 Console」，别上线）；
- **ios-webkit-debug-proxy**（Windows/Linux 上用命令行凑合）。

## 四、移动端特有问题排查

### 软键盘弹出，布局烂了

软键盘占半屏，`100vh` 的元素被顶出界。
解法：`100dvh`（动态视口，跟随软键盘伸缩）。

```css
.hero { height: 100dvh; }     /* 软键盘弹出时自动收缩 */
```

### 点击有 300ms 延迟

老 iOS 双击缩放导致的「幽灵延迟」。现代方案：
视口设 `width=device-width, initial-scale=1` + 触摸Action
（`touch-action: manipulation`）基本解决。

### 橡皮筋滚动露出 body 背景

```css
body { overscroll-behavior-y: contain; }   /* 禁止滚动链 */
```

### 输入框被软键盘挡住

表单页面，聚焦的 input 被键盘盖住。
原生 `scrollIntoView` + 布局别写死高度。让浏览器自己处理，
别和它斗。

### iOS Safari 下划线问题

`-webkit-tap-highlight-color: transparent` 去掉点击灰块；
`-webkit-overflow-scrolling: touch` 给滚动容器加惯性（iOS 老问题）。

## 五、弱网与低端机测试

```text
DevTools Network: Slow 3G        # 模拟 400ms RTT，看 loading 策略
DevTools CPU: 4x slowdown        # 模拟低端机，看卡顿
真机：开飞行模式                 # 断网降级体验（别白屏啊）
```

**移动端两大杀手**：弱网（地铁里）+ 低端机（千元安卓）。
你的页面在这两个条件下还顺滑，才算真移动端友好。
优化手段见[响应式设计](../responsive-web.md)和
[性能优化](../../tech/web-performance.md)。

## 六、跨设备测试服务

没那么多真机？用云测平台（截图 + 远程真机）：

- **BrowserStack**：最全，收费；
- **LambdaTest**：类似，稍便宜；
- **腾讯 WeTest / 百度 MTC**：国内，有免费额度。

个人开发最现实的组合：**DevTools 模拟 + 自己手机 +
借同事的 iPhone/安卓各一台**。主流机型覆盖就行，
别追求全覆盖。

## 小结

调试阶梯：**DevTools 模拟（开发时随手验）→ 自己真机
（USB 调试）→ 借设备（iOS/安卓各一）→ 云测（上线前扫一遍）**。
移动端的坑九成在「软键盘、视口、弱网、低端机」这四个词上。
记住：**模拟器过的只是尺寸，真机过的才是体验。**
