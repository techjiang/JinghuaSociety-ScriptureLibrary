---
title: 前端发请求：fetch 与 axios
createTime: 2026-10-22
permalink: /library/tutorial/api-fetch/
description: 原生 fetch 的坑、axios 的优势与封装一个顺手的数据请求层
---

<CategoryTag name="教程" link="/library/tutorial/" />

前端要跟后端要数据，绕不开 HTTP 请求。浏览器自带 `fetch`，
社区还有 `axios`。用哪个？坑在哪？怎么封装？
这篇按实际开发顺序讲。

## 一、fetch：原生，但有点糙

```js
// GET 请求
const res = await fetch('/api/users')
const data = await res.json()

// POST JSON
const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: '张三' })
})
```

能用，但有五个坑（按踩 frequency 排序）：

**坑一：4xx/5xx 不 reject**。`fetch('/api/404')` 不会抛错，
`res.ok` 才是 false。**必须手动查**：

```js
const res = await fetch('/api/users')
if (!res.ok) {
  throw new Error(`HTTP ${res.status}`)
}
```

**坑二：默认不带 Cookie**。要加 `credentials: 'include'`：

```js
fetch('/api/me', { credentials: 'include' })
```

**坑三：没有超时**。请求挂起能挂到天荒地老。要自己包
`AbortController`：

```js
const controller = new AbortController()
setTimeout(() => controller.abort(), 10000)   // 10 秒掐断

fetch('/api/slow', { signal: controller.signal })
```

**坑四：没有请求/响应拦截器**。统一加 token、统一处理错误，
得自己包一层。

**坑五：老浏览器不支持**。要 IE 兼容的项目直接出局
（2026 年了应该没有了吧）。

## 二、axios：开箱即用

```bash
npm install axios
```

```js
import axios from 'axios'

// GET，返回的 data 已经是解析好的 JSON
const { data } = await axios.get('/api/users')

// POST
const { data: newUser } = await axios.post('/api/users', { name: '张三' })

// 带参数
const { data } = await axios.get('/api/users', {
  params: { page: 1, size: 20 }        // 自动拼 ?page=1&size=20
})
```

axios 把 fetch 的坑全填了：

| 能力 | axios |
| --- | --- |
| 4xx/5xx 自动 reject | ✅ |
| 自动转 JSON | ✅ |
| 超时 | `timeout: 10000` 配置项 |
| 拦截器 | ✅ 请求/响应都能拦 |
| 取消请求 | `AbortController`（v1 起支持） |
| 浏览器/Node 通用 | ✅ |

**结论：新项目直接 axios**，除非你执着于零依赖。

## 三、封装：别在每个页面里裸调

实际项目里，把 axios 包一层，统一处理重复逻辑：

```ts
// utils/request.ts
import axios, { type AxiosInstance } from 'axios'
import { ElMessage } from 'element-plus'   // 你的 UI 库提示组件

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000
})

// 请求拦截：加 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截：统一处理错误
request.interceptors.response.use(
  (res) => res.data,           // 成功：只取 data，调用方少写一层
  (err) => {
    const msg = err.response?.data?.message || err.message
    // 401 跳登录（按业务来）
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      location.href = '/login'
    }
    ElMessage.error(msg)
    return Promise.reject(err)
  }
)

export default request
```

用起来就干净了：

```ts
import request from '@/utils/request'

// 页面里只管业务
const users = await request.get('/users')
const newUser = await request.post('/users', { name: '张三' })
```

封装的四件套：**baseURL 集中管、token 拦截器自动加、
错误统一提示、成功只返回 data**。这四样不做，
每个页面都要写一遍，早晚精神分裂。

## 四、TypeScript 加持

```ts
interface User {
  id: number
  name: string
}

// 泛型指定返回类型，调用方直接拿到 User[]
const users = await request.get<User[]>('/users')
const user = await request.post<User>('/users', { name: '张三' })
```

配合 [TypeScript 入门](../ts-basics.md) 看，类型让接口调用
「看签名就知道返回什么」，联调效率翻倍。

## 五、实战：一个搜索列表

```vue
<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const keyword = ref('')
const list = ref([])
const loading = ref(false)

async function search() {
  loading.value = true
  try {
    list.value = await request.get('/articles', {
      params: { keyword: keyword.value }
    })
  } finally {
    loading.value = false      // finally 保证 loading 一定关
  }
}

onMounted(search)              // 进页面先查一次
</script>

<template>
  <input v-model="keyword" @keyup.enter="search">
  <button @click="search" :disabled="loading">
    {{ loading ? '搜着…' : '搜索' }}
  </button>
  <ul>
    <li v-for="item in list" :key="item.id">{{ item.title }}</li>
  </ul>
</template>
```

三个细节：**loading 状态防重复提交**、**finally 复位 loading**、
**回车触发搜索**。这些是「顺手」和「难用」的分界线。

## 六、安全红线

- **token 存哪**：优先 HttpOnly Cookie；必须 localStorage 时，
  把 XSS 防御做扎实（见 [Web 安全](../web-security.md)）；
- **别信前端传来的数据**：前端校验是体验，后端校验是安全。
  绕过前端 JS 直接发请求的成本是零；
- **敏感接口加频率限制**：短信、登录，防刷。

## 小结

请求层三板斧：**axios（或 fetch 封装）+ 拦截器（token/错误）+
TS 泛型（返回类型）**。页面里只管调、不管杂务。
封装半小时，受惠整个项目生命周期 —— 这半小时是全项目
ROI 最高的半小时之一。
