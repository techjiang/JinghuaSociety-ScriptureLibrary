<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

interface UpdateItem {
  title: string
  path: string
  url: string
  date: string
  category: string
  type: string
  description: string
}

const items = ref<UpdateItem[]>([])
const loading = ref(true)
const error = ref('')
const active = ref('全部')

const filters = ['全部', '文库', '精华', '教程', '技术', '资源', '日常']

const filtered = computed(() => {
  if (active.value === '全部') return items.value
  if (active.value === '文库') return items.value.filter((i) => i.type === '文库')
  return items.value.filter((i) => i.category === active.value)
})

// 按日期分组，保持倒序
const grouped = computed<[string, UpdateItem[]][]>(() => {
  const map = new Map<string, UpdateItem[]>()
  for (const item of filtered.value) {
    const arr = map.get(item.date) ?? []
    arr.push(item)
    map.set(item.date, arr)
  }
  return Array.from(map.entries())
})

onMounted(async () => {
  try {
    const res = await fetch('/updates.json', { cache: 'no-cache' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    items.value = await res.json()
  } catch {
    error.value = '动态数据加载失败，请稍后刷新重试。'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="up-feed">
    <div class="up-feed__filters">
      <button
        v-for="f in filters"
        :key="f"
        class="up-chip"
        :class="{ 'up-chip--active': active === f }"
        @click="active = f"
      >
        {{ f }}
      </button>
    </div>

    <p v-if="loading" class="up-feed__state">正在加载动态…</p>
    <p v-else-if="error" class="up-feed__state up-feed__state--err">{{ error }}</p>
    <p v-else-if="!filtered.length" class="up-feed__state">这个分类暂时还没有内容。</p>

    <div v-else class="up-timeline">
      <section v-for="[date, list] in grouped" :key="date" class="up-day">
        <h3 class="up-day__date">
          <span class="up-day__dot" />
          {{ date }}
        </h3>
        <ul class="up-day__list">
          <li v-for="item in list" :key="item.path" class="up-item">
            <a class="up-item__title" :href="item.url">{{ item.title }}</a>
            <span class="up-item__cat">{{ item.category }}</span>
            <p v-if="item.description" class="up-item__desc">{{ item.description }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.up-feed {
  margin-top: 8px;
}
.up-feed__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}
.up-chip {
  padding: 4px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 999px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-2, #3a3a3a);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s ease;
}
.up-chip:hover {
  border-color: var(--vp-c-brand-1, #c0392b);
  color: var(--vp-c-brand-1, #c0392b);
}
.up-chip--active {
  background: var(--vp-c-brand-1, #c0392b);
  border-color: var(--vp-c-brand-1, #c0392b);
  color: #fff;
}
.up-feed__state {
  color: var(--vp-c-text-2, #6b7280);
  padding: 20px 0;
}
.up-feed__state--err {
  color: var(--vp-c-danger-1, #c0392b);
}
.up-day {
  margin-bottom: 22px;
}
.up-day__date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  margin: 0 0 10px;
  color: var(--vp-c-text-1, #213547);
}
.up-day__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1, #c0392b);
}
.up-day__list {
  list-style: none;
  margin: 0;
  padding: 0 0 0 16px;
  border-left: 2px solid var(--vp-c-divider, #e2e2e3);
  display: grid;
  gap: 10px;
}
.up-item {
  padding: 8px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  background: var(--vp-c-bg-soft, #f9f9fa);
}
.up-item__title {
  font-weight: 600;
  color: var(--vp-c-brand-1, #c0392b);
  text-decoration: none;
}
.up-item__title:hover {
  text-decoration: underline;
}
.up-item__cat {
  display: inline-block;
  margin-left: 8px;
  font-size: 0.72rem;
  padding: 1px 8px;
  border-radius: 4px;
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  color: var(--vp-c-text-2, #6b7280);
}
.up-item__desc {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2, #6b7280);
}
</style>
