---
title: DOM 操作与事件委托入门
createTime: 2026-10-22
permalink: /library/tutorial/js-dom/
description: 查元素、改内容、绑事件、事件委托——原生 JS 操作页面的基本功
---

# DOM 操作与事件委托入门

框架好用，但 DOM 是底。读 jQuery 时代的老代码、
调试前端问题、写油猴脚本 —— 都得会原生 DOM 操作。
而且它真不难，一篇够用。

## 一、查元素：先找到，再操作

```js
document.getElementById('app')              // ID 查，返回一个
document.querySelector('.card')             // CSS 选择器查，返回第一个
document.querySelectorAll('.card')          // 查全部，返回 NodeList

// 链式查询
document.querySelector('.list').querySelectorAll('li')

// 在某个元素内部查
const list = document.querySelector('.list')
list.querySelector('.active')               // 只在 list 里找
```

`querySelectorAll` 返回的是 NodeList，能用 `forEach`，
但**没有数组的 map/filter**。要用的先转：

```js
const items = [...document.querySelectorAll('li')]   // 展开成真数组
const texts = items.map((li) => li.textContent)
```

**缓存查询结果**：同一个元素查多次，先存变量。DOM 查询有成本，
循环里反复 `querySelector` 是新手常见性能坑。

## 二、改内容：三种「写」的区别

```js
el.textContent = '新文字'      // 纯文本，HTML 标签会被转义（安全）
el.innerHTML = '<b>加粗</b>'   // 解析 HTML（XSS 风险！）
el.innerText = '新文字'         // 考虑 CSS 显示效果（隐藏的不算）
```

日常 90% 用 `textContent`。**`innerHTML` 只能用于可信内容** ——
用户输入、接口返回直接拼进去，就是 XSS 漏洞
（详见 [Web 安全入门](../web-security.md)）。

改属性、样式、类：

```js
el.id = 'new-id'
el.setAttribute('data-status', 'active')   // 自定义属性
el.getAttribute('href')

el.style.color = 'red'                     // 行内样式
el.style.cssText = 'color: red; font-size: 14px'

el.classList.add('active')                  // 类操作四兄弟
el.classList.remove('hidden')
el.classList.toggle('open')                 // 没有就加，有就删
el.classList.contains('active')             // 查
```

**样式尽量用 class 操作**，别一行行改 `style.*` ——
CSS 文件管样式，JS 只管状态，职责分明。

## 三、增删元素

```js
// 创建
const li = document.createElement('li')
li.textContent = '新条目'
li.className = 'item'

// 插入
list.appendChild(li)                    // 加到末尾
list.insertBefore(li, list.firstChild)   // 加到开头
refEl.before(newEl)                      // 现代 API：前/后插入
refEl.after(newEl)
refEl.append(newEl)                      // append 比 appendChild 灵活（可传多个/字符串）

// 删除
li.remove()                              // 自杀（删自己）
list.removeChild(li)                     // 父删子
```

**批量插入用 DocumentFragment**（文档碎片）：先建好一堆节点，
一次性挂上去，只触发一次重排：

```js
const frag = document.createDocumentFragment()
for (const item of items) {
  const li = document.createElement('li')
  li.textContent = item
  frag.appendChild(li)
}
list.appendChild(frag)   // 一次性插入
```

## 四、事件绑定

```js
btn.addEventListener('click', function (e) {
  console.log('点了', e.target)
})

// 解绑（同一个函数引用）
function handler() {}
btn.addEventListener('click', handler)
btn.removeEventListener('click', handler)
```

常用事件：`click`、`input`（输入实时）、`change`（失焦后值变了）、
`submit`（表单提交）、`keydown`（键盘）。

事件对象 `e` 常用：

```js
e.target           // 谁触发的（点的是哪个元素）
e.currentTarget    // 绑定事件的元素（== this）
e.preventDefault() // 阻止默认行为（链接跳转、表单提交）
e.stopPropagation() // 阻止冒泡
```

## 五、事件委托：一百个按钮绑一次

场景：一个 100 条的列表，每条有个删除按钮。
绑 100 个监听器？浪费。**事件委托**：只在父元素绑一个，
靠 `e.target` 判断点的谁。

```js
// HTML: <ul id="list"><li data-id="1">…<button class="del">删</button></li>…</ul>

document.getElementById('list').addEventListener('click', (e) => {
  // 点的必须是 .del 按钮（可能在按钮内部还有 span，用 closest 向上找）
  const btn = e.target.closest('.del')
  if (!btn) return                    // 点别的不管

  const li = btn.closest('li')        // 找到所在条目
  const id = li.dataset.id            // 拿 data-id

  console.log('要删', id)
  li.remove()
})
```

三个好处：

1. **新加的条目自动有事件**（不用重新绑）—— 动态列表的刚需；
2. **一个监听器代替一百个**，内存友好；
3. 逻辑集中一处，好维护。

原理：事件冒泡 —— 子元素的事件会「冒」到父元素，
父元素的监听器能收到（配合 `e.target` 判断来源）。

## 六、实战：一个迷你 Todo

把上面的东西串起来。完整可跑：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>迷你 Todo</title>
  <style>
    .done { text-decoration: line-through; color: #999; }
  </style>
</head>
<body>
  <input id="input" placeholder="要做点啥">
  <button id="add">添加</button>
  <ul id="list"></ul>

  <script>
    const input = document.getElementById('input')
    const list = document.getElementById('list')

    // 添加
    document.getElementById('add').addEventListener('click', () => {
      const text = input.value.trim()
      if (!text) return                      // 空的不加
      const li = document.createElement('li')
      li.innerHTML = '<span></span> <button class="del">删</button>'
      li.querySelector('span').textContent = text   // 用户输入用 textContent
      list.appendChild(li)
      input.value = ''                        // 清空输入框
      input.focus()
    })

    // 回车也能添加
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('add').click()
    })

    // 事件委托：点条目切换完成，点按钮删除
    list.addEventListener('click', (e) => {
      if (e.target.classList.contains('del')) {
        e.target.closest('li').remove()
      } else if (e.target.tagName === 'SPAN') {
        e.target.closest('li').classList.toggle('done')
      }
    })
  </script>
</body>
</html>
```

存成 html 双击打开就能玩。这个迷你应用用到了：
查询、创建、插入、事件、委托、class 操作 —— DOM 的核心全在里面。

## 七、和框架的关系

Vue/React 把上面这些封装了（数据驱动、虚拟 DOM），
但底层还是这些 API。什么时候还需要原生 DOM：

- 调试框架代码（`$0` 在 Console 里拿到的就是真 DOM 节点）；
- 写浏览器脚本、爬虫、油猴；
- 读老项目/jQuery 代码；
- 性能敏感的场景（避免框架开销）。

## 小结

DOM 三板斧：**querySelector 查、textContent/classList 改、
addEventListener + closest 委托**。再记一个 `createElement`
造节点。五十行代码以内的小交互，原生 JS 比引框架快得多。
把上面的 Todo 敲一遍（别复制，手敲），DOM 就入门了。
