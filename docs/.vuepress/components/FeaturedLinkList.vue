<script setup lang="ts">
import { computed } from 'vue'
import { featuredLinks } from '../featured-links'
import type { FeaturedLinkSite } from '../featured-links'

// 按 category 分组，保持数组原有顺序
const grouped = computed<[string, FeaturedLinkSite[]][]>(() => {
  const map = new Map<string, FeaturedLinkSite[]>()
  for (const site of featuredLinks) {
    const arr = map.get(site.category) ?? []
    arr.push(site)
    map.set(site.category, arr)
  }
  return Array.from(map.entries())
})
</script>

<template>
  <div class="fl-list">
    <div v-for="[cat, sites] in grouped" :key="cat" class="fl-group">
      <h3 class="fl-group__title">{{ cat }}</h3>
      <ul class="fl-group__items">
        <li
          v-for="s in sites"
          :key="s.url"
          class="fl-item"
          :class="{ 'fl-item--example': s.example }"
        >
          <a :href="s.url" target="_blank" rel="noopener">{{ s.name }}</a>
          <span v-if="s.example" class="fl-tag">示例</span>
          <p class="fl-item__desc">{{ s.desc }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.fl-list {
  display: grid;
  gap: 24px;
  margin-top: 12px;
}
.fl-group__title {
  font-size: 1.05rem;
  border-left: 3px solid var(--vp-c-brand-1, #c0392b);
  padding-left: 10px;
  margin: 0 0 10px;
}
.fl-group__items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.fl-item {
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 8px;
}
.fl-item a {
  font-weight: 600;
  color: var(--vp-c-brand-1, #c0392b);
}
.fl-item__desc {
  margin: 4px 0 0;
  color: var(--vp-c-text-2, #6b7280);
  font-size: 0.9rem;
}
.fl-item--example {
  opacity: 0.6;
}
.fl-tag {
  display: inline-block;
  margin-left: 8px;
  font-size: 0.7rem;
  background: var(--vp-c-bg-soft, #f0f0f0);
  border-radius: 4px;
  padding: 1px 6px;
  color: var(--vp-c-text-2, #6b7280);
}
</style>
