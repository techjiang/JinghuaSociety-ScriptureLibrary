---
title: Vue 3 快速上手
createTime: 2026-10-22
permalink: /library/tutorial/vue3-quickstart/
description: 半天学会 Vue 3 核心：模板语法、响应式、组件与 Composition API
---

<CategoryTag name="教程" link="/library/tutorial/" />

Vue 是国内最流行的前端框架之一。官网文档很好，但信息量大。
这篇是「最小可用路径」：半天学会核心，能写项目，
细节再回文档补。

## 一、五分钟第一个页面

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">{{ message }}</div>
  <script>
    const { createApp, ref } = Vue
    createApp({
      setup() {
        const message = ref('你好，Vue 3')
        return { message }
      }
    }).mount('#app')
  </script>
</body>
</html>
```

页面显示「你好，Vue 3」。三个核心概念全在这了：
**模板（`{{ }}`）、响应式数据（`ref`）、组件（`createApp`）**。

## 二、模板语法：数据怎么显示

```html
<template>
  <!-- 插值：显示数据 -->
  <h1>{{ title }}</h1>
  <p>作者：{{ author.name }}（{{ author.age }} 岁）</p>

  <!-- 属性绑定：v-bind 简写 : -->
  <a :href="url" :class="{ active: isActive }">链接</a>
  <img :src="imgUrl" :alt="altText">

  <!-- 事件绑定：v-on 简写 @ -->
  <button @click="count++">点了 {{ count }} 次</button>
  <input @input="onInput">

  <!-- 条件渲染 -->
  <p v-if="count > 5">点挺多啊</p>
  <p v-else-if="count > 0">继续</p>
  <p v-else>还没点</p>

  <!-- 列表渲染 -->
  <ul>
    <li v-for="(item, index) in list" :key="item.id">
      {{ index + 1 }}. {{ item.name }}
    </li>
  </ul>
</template>
```

五个指令（`v-` 开头）覆盖日常：**v-bind / v-on / v-if /
v-for / v-model**（表单双向绑定）：

```html
<input v-model="keyword" placeholder="搜索">
<p>你在搜：{{ keyword }}</p>
```

`v-model` 是语法糖：值绑定 + input 事件。表单开发效率翻倍。

## 三、响应式：数据变了，页面自动更新

Composition API（`<script setup>`，现代写法）：

```vue
<script setup>
import { ref, reactive, computed, watch } from 'vue'

// ref：基本类型响应式（访问要 .value）
const count = ref(0)
const keyword = ref('')
console.log(count.value)   // 读
count.value++              // 写

// reactive：对象响应式（直接访问属性）
const user = reactive({ name: '张三', age: 25 })
console.log(user.name)
user.age = 26

// computed：派生值，自动缓存
const double = computed(() => count.value * 2)

// watch：监听变化，做副作用
watch(keyword, (newVal, oldVal) => {
  console.log(`搜索词从 ${oldVal} 变成 ${newVal}`)
  // 这里发请求
})

function add() { count.value++ }
</script>

<template>
  <button @click="add">{{ count }}（双倍 {{ double }}）</button>
</template>
```

**ref vs reactive**：简单值用 ref，对象用 reactive。
不确定？`ref` 包一切也能用（`ref({a:1})` 访问时 `.value.a`，
模板里 Vue 自动展开）。本站 Plume 主题内部就是这么干的。

## 四、组件：拆分与通信

### 定义子组件

```vue
<!-- UserCard.vue -->
<script setup>
// 接收父组件传来的数据
defineProps({
  name: { type: String, required: true },
  age: { type: Number, default: 0 }
})
// 向外抛事件
const emit = defineEmits(['follow'])
</script>

<template>
  <div class="card">
    <h3>{{ name }}</h3>
    <p>{{ age }} 岁</p>
    <button @click="emit('follow', name)">关注</button>
  </div>
</template>
```

### 父组件使用

```vue
<script setup>
import { ref } from 'vue'
import UserCard from './UserCard.vue'

const users = ref([
  { name: '张三', age: 25 },
  { name: '李四', age: 30 }
])

function onFollow(name) {
  console.log('关注了', name)
}
</script>

<template>
  <UserCard
    v-for="u in users"
    :key="u.name"
    :name="u.name"
    :age="u.age"
    @follow="onFollow"
  />
</template>
```

组件通信就两条主线：**props 向下传数据，
events 向上传消息**。复杂的用 provide/inject 或 Pinia（状态管理），
但八成场景这两条够。

## 五、真实小项目：Todo 列表

```vue
<script setup>
import { ref, computed } from 'vue'

const input = ref('')
const todos = ref([
  { id: 1, text: '学 Vue', done: true },
  { id: 2, text: '写 Todo', done: false }
])

const remaining = computed(() => todos.value.filter(t => !t.done).length)

function add() {
  const text = input.value.trim()
  if (!text) return
  todos.value.push({ id: Date.now(), text, done: false })
  input.value = ''
}

function remove(id) {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<template>
  <input v-model="input" @keyup.enter="add" placeholder="加点啥">
  <button @click="add">添加</button>
  <p v-if="remaining">还剩 {{ remaining }} 件</p>
  <p v-else>全干完了，歇会儿</p>
  <ul>
    <li v-for="t in todos" :key="t.id">
      <input type="checkbox" v-model="t.done">
      <span :class="{ done: t.done }">{{ t.text }}</span>
      <button @click="remove(t.id)">删</button>
    </li>
  </ul>
</template>

<style scoped>
.done { text-decoration: line-through; color: #999; }
</style>
```

跑起来能加、能删、能勾选、能统计 —— 一个 Todo 把
ref/computed/v-for/v-model/事件/样式全用上了。**把这个敲一遍，
Vue 就入门了。**

## 六、工程化：脚手架与路由

```bash
npm create vite@latest my-app -- --template vue
cd my-app && npm install && npm run dev
```

常用扩展：

- **Vue Router**：多页面/SPA 路由（`/about`、`/user/:id`）；
- **Pinia**：全局状态管理（跨组件共享数据）；
- **Element Plus / Naive UI**：组件库（后台系统提速）。

学习顺序：本文核心 → 脚手架项目 → Router → Pinia → 组件库。
**别一上来就装全家桶** —— 先理解「数据驱动」这个心智模型。

## 七、Vue 2 用户迁移注意

Vue 3 最大的变化：**Composition API（setup）+ 多根节点 +
Teleport/Fragment**。Vue 2 的 Options API 还能用（兼容），
但新代码推荐 setup。其他（模板语法、指令）基本没变。

## 小结

Vue 3 核心：**模板插值 + ref/reactive 响应式 + props/events 通信 +
v-for/v-if/v-model 五指令**。半天能上手，一周能写业务。
官网文档（cn.vuejs.org）是最好的进阶资料 ——
把本文当目录，文档当字典，配合 Todo 练习，足矣。
