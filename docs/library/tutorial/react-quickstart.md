---
title: React 快速上手
createTime: 2026-10-22
permalink: /library/tutorial/react-quickstart/
description: JSX、组件、useState/useEffect 与一个待办应用，半天入门 React
---

# React 快速上手

React 和 Vue 是国内前端框架的两极。Vue 像「渐进增强的框架」，
React 更像「用 JS 写 UI 的库」——心智模型不一样。
这篇给会 JS 的人：半天上手，能写项目。

## 一、心智模型：UI = f(state)

React 的核心思想一句话：**界面是数据的函数**。
数据（state）变了，React 自动重新渲染界面。

```jsx
// Vue 思维：模板里写 v-if，数据驱动 DOM
// React 思维：直接用 JS 写 if，整个函数重新跑
function Welcome(props) {
  return <h1>你好，{props.name}</h1>
}
```

这个区别带来一切：JSX 里能写任意 JS（`map`、`filter`、
三元运算符），没有「指令」这套东西。

## 二、JSX：HTML 写在 JS 里

```jsx
const element = <h1 className="title">你好</h1>
```

注意三点：

1. **class 要写 `className`**（JS 里 class 是关键字）；
2. **只能返回一个根元素**（用 `<>...</>` 空标签包多个）；
3. **`{}` 里写 JS 表达式**：

```jsx
const name = '张三'
const items = ['A', 'B']

function App() {
  return (
    <div className="app">
      <h1>你好，{name}</h1>
      <p>1 + 1 = {1 + 1}</p>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>       {/* key 必须有，帮 React 认节点 */}
        ))}
      </ul>
      {name === '张三' && <p>是张三！</p>}   {/* && 做条件渲染 */}
    </div>
  )
}
```

## 三、useState：让组件「记事」

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)   // [当前值, 设置函数]

  return (
    <button onClick={() => setCount(count + 1)}>
      点了 {count} 次
    </button>
  )
}
```

- `useState(初始值)` 返回一个配对：当前值 + 改它的函数；
- **改状态必须用 set 函数**，`count++` 直接改没用（React 不知道）；
- 值可以是任意类型：数字、字符串、对象、数组。

**对象/数组的更新要新建，别改旧的**：

```jsx
// ❌ 直接改（React 可能不重新渲染）
user.name = '李四'
setUser(user)

// ✅ 新建对象
setUser({ ...user, name: '李四' })

// ✅ 数组新增
setList([...list, newItem])
setList(list.filter(item => item.id !== id))   // 删除
```

这条「不可变数据」规则是 React 的命根子，开始不习惯，
两周后就成了本能。

## 四、useEffect：处理「副作用」

副作用 = 数据请求、定时器、操作 DOM 这些「渲染之外的事」。

```jsx
import { useEffect, useState } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 组件挂载后、userId 变化后，重新请求
    fetch(`/api/user/${userId}`)
      .then(r => r.json())
      .then(setUser)
  }, [userId])              // 依赖数组：里面变了才重新跑

  if (!user) return <p>加载中…</p>
  return <p>{user.name}</p>
}
```

依赖数组三种写法：

- `[]`：只在挂载时跑一次（初始请求）；
- `[userId]`：userId 变了再跑（重新请求）；
- 不写：每次渲染后都跑（小心死循环！）。

**清理副作用**（定时器、订阅）：

```jsx
useEffect(() => {
  const timer = setInterval(tick, 1000)
  return () => clearInterval(timer)    // 组件卸载时清理
}, [])
```

## 五、组件通信：props 传递

```jsx
// 子组件收数据
function UserCard({ name, age, onFollow }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <button onClick={() => onFollow(name)}>关注</button>
    </div>
  )
}

// 父组件传数据 + 传回调
function App() {
  const users = [{ name: '张三', age: 25 }]
  return (
    <>
      {users.map(u => (
        <UserCard key={u.name} {...u} onFollow={(name) => console.log('关注', name)} />
      ))}
    </>
  )
}
```

和 Vue 一样：**props 向下，回调向上**。跨组件共享用 Context，
全局状态用 Zustand/Redux —— 但先别上，`useState` 提一层
能解决八成。

## 六、实战：Todo 列表

```jsx
import { useState } from 'react'

function Todo() {
  const [input, setInput] = useState('')
  const [todos, setTodos] = useState([])

  function add() {
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: Date.now(), text, done: false }])
    setInput('')
  }

  function toggle(id) {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function remove(id) {
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={add}>添加</button>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <span
              onClick={() => toggle(t.id)}
              style={{ textDecoration: t.done ? 'line-through' : 'none' }}
            >
              {t.text}
            </span>
            <button onClick={() => remove(t.id)}>删</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

和 [Vue 版](../vue3-quickstart.md)对比着看：同样的功能，
Vue 用模板 + 指令，React 用 JS + 函数。没有优劣，
**选团队顺手的**。

## 七、工程化起步

```bash
npm create vite@latest my-app -- --template react
cd my-app && npm install && npm run dev
```

常用扩展：React Router（路由）、TanStack Query（请求）、
Zustand（状态）、Ant Design/MUI（组件库）。

## 八、新手五个坑

1. **直接改 state**：`todos.push(...)` 然后不调 set —— 白改；
2. **useEffect 依赖数组漏写**：用了 props/state 但没写进依赖，
   「数据不更新」玄学 bug；
3. **key 用 index**：列表重排时错乱。用稳定 ID；
4. **条件渲染返回 undefined**：`if (x) return` 后面没 else，
   React 0.19 前会报错。返回 `null`；
5. **在渲染里发请求**：副作用放 useEffect，别放函数体里
   （每次渲染都发，直接炸）。

## 小结

React 核心：**JSX 写 UI、useState 记数据、useEffect 管副作用、
props 传参、不可变更新**。心智模型就一句「UI = f(state)」。
把 Todo 敲一遍，比看十篇教程管用。想深入，
官网 react.dev 的新文档是业界模范，值得通读。
