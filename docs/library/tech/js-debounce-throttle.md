---
title: 防抖与节流：高频事件的两把闸
createTime: 2026-10-22
permalink: /library/tech/debounce-throttle/
description: 输入搜索、滚动监听、按钮连点，两个模式的手写与选场景
---

# 防抖与节流：高频事件的两把闸

`input`、`scroll`、`resize`、`mousemove` 这些事件一秒能触发几十次。
每次都发请求/算布局，页面直接卡死。**防抖和节流就是控制频率的两把闸**，
面试常考，实战天天用。

## 一、防抖（Debounce）：停了才干活

**定义：事件触发后等 n 毫秒，期间再触发就重新计时。**

```js
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)                    // 每次触发，清掉上一个计时器
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```

场景：**搜索框输入联想**。用户打「vuepress」七个字母，
不会每打一个就搜一次，而是打完停顿 300ms 才搜。

```js
const search = debounce((keyword) => {
  console.log('搜:', keyword)
}, 300)

input.addEventListener('input', (e) => search(e.target.value))
// 连续快速输入 → 只在停下 300ms 后执行一次
```

## 二、节流（Throttle）：固定频率干活

**定义：不管触发多频繁，每 n 毫秒最多执行一次。**

```js
function throttle(fn, interval = 300) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= interval) {          // 距上次够久了才放行
      last = now
      fn.apply(this, args)
    }
  }
}
```

场景：**滚动监听**。滚动条哗哗滚，监听器每 300ms 才查一次位置
（算「是否滚到底部」）。

```js
const onScroll = throttle(() => {
  console.log('当前滚动位置:', window.scrollY)
}, 300)

window.addEventListener('scroll', onScroll)
```

## 三、区别：一张时间轴

```text
事件触发：  x x x x x x x x x x x x x x x x
            └─ 快速连续触发

防抖（500ms）：
执行：                        ↓               ↓
效果：疯狂触发中不执行，停下 500ms 后执行一次

节流（500ms）：
执行：            ↓           ↓           ↓
效果：每 500ms 保证执行一次，触发再密也不加快
```

**记忆法**：

- **防抖 = 电梯门**：有人进就重新等，没人进了才关门；
- **节流 = 红绿灯**：时间没到，车堵成队也得等。

## 四、选型：什么场景用什么

| 场景 | 用啥 | 理由 |
| --- | --- | --- |
| 搜索联想 | **防抖** | 要的是「最终输入」，中间态没用 |
| 表单校验（输入中） | 防抖 | 同上 |
| 窗口 resize | 防抖或节流 | 防抖（停手才算完）或节流（过程要响应） |
| 滚动加载更多 | **节流** | 滚动过程就要判断「到底没」 |
| 按钮连点 | 节流（或禁用） | 防重复提交，见下文 |
| 滚动动画/视差 | 节流 | 每帧级用 rAF 更好 |
| 鼠标移动画拖拽 | 节流 | 高频但不必全响应 |

**分不清就问自己**：中间过程要不要响应？

- 不要 → 防抖；
- 要 → 节流。

## 五、进阶：立即执行版本

有时希望「第一次就响应，之后才防抖/节流」：

```js
// 防抖-立即执行（leading）
function debounce(fn, delay = 300, immediate = false) {
  let timer = null
  return function (...args) {
    if (immediate && !timer) {          // 没有在等的计时器 → 立即执行
      fn.apply(this, args)
    }
    clearTimeout(timer)
    timer = setTimeout(() => { timer = null }, delay)   // delay 后清空标记
  }
}

// 节流-首尾都执行（leading + trailing）
function throttle(fn, interval = 300) {
  let last = 0, timer = null
  return function (...args) {
    const now = Date.now()
    if (now - last >= interval) {
      clearTimeout(timer)
      timer = null
      last = now
      fn.apply(this, args)
    } else if (!timer) {
      // 尾巴上补一次（最后一次触发不丢）
      timer = setTimeout(() => {
        last = Date.now()
        timer = null
        fn.apply(this, args)
      }, interval - (now - last))
    }
  }
}
```

按钮场景经典组合：**立即执行 + 期间锁定**：

```js
function onceClick(fn, lock = 2000) {
  let locked = false
  return function (...args) {
    if (locked) return
    locked = true
    fn.apply(this, args)
    setTimeout(() => { locked = false }, lock)
  }
}
```

（配合按钮 `disabled` + 文案「提交中…」双保险，
详见[表单验证实战](../form-validation.md)。）

## 六、库与框架自带

不想手写：

- **lodash**：`_.debounce(fn, 300)`、`_.throttle(fn, 300)` ——
  功能全（leading/trailing/maxWait），老牌稳；
- **VueUse**：`useDebounceFn`、`useThrottleFn` —— Vue 项目首选，
  自动清理（组件卸载取消未执行的）；
- **自己写**：二十行，零依赖，还能应对面试。

**注意 lodash 的取消**：`const fn = _.debounce(...); fn.cancel()` ——
组件卸载时调，防止「组件没了回调还跑」的 bug。

## 七、一个完整例子：搜索页

```js
import { useDebounceFn } from '@vueuse/core'

const keyword = ref('')
const results = ref([])

// 输入停 500ms 才搜（防抖）
const doSearch = useDebounceFn(async () => {
  if (!keyword.value) {
    results.value = []
    return
  }
  results.value = await request.get('/api/search', {
    params: { q: keyword.value }
  })
}, 500)

watch(keyword, doSearch)

// 滚动到底部加载更多（节流）
const loadMore = useThrottleFn(async () => {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
    // 加载下一页…
  }
}, 500)

window.addEventListener('scroll', loadMore)
```

搜索用防抖（等最终输入）、滚动用节流（过程要响应）——
两个工具在同一页面各司其职。

## 小结

防抖和节流就两句话：**防抖是「别急，等你停」，
节流是「慢点，按节奏来」**。手写各二十行，场景对照表在第四节。
遇到「输入卡/滚动卡/按钮狂发」，先想该上哪把闸 —— 
这两个模式，是前端性能优化的第一道防线。
