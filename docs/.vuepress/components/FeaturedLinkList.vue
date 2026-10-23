<script setup lang="ts">
import { computed, ref } from 'vue'
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

// 图片加载失败时回退为首字显示
const brokenIcons = ref<Set<string>>(new Set())
const onImgError = (url: string) => {
  brokenIcons.value.add(url)
}
const showImg = (s: FeaturedLinkSite) => !!s.icon && !brokenIcons.value.has(s.icon)
</script>

<template>
  <div class="fl-list">
    <div v-for="[cat, sites] in grouped" :key="cat" class="fl-group">
      <h3 class="fl-group__title">
        {{ cat }}
        <span class="fl-group__count">{{ sites.length }}</span>
      </h3>

      <div class="fl-grid">
        <a
          v-for="s in sites"
          :key="s.url"
          class="fl-tile"
          :class="{ 'fl-tile--example': s.example }"
          :href="s.url"
          target="_blank"
          rel="noopener"
          :title="`${s.name} — ${s.desc}`"
        >
          <span class="fl-tile__box">
            <img
              v-if="showImg(s)"
              :src="s.icon"
              :alt="s.name"
              loading="lazy"
              @error="onImgError(s.icon!)"
            />
            <span v-else class="fl-tile__char">{{ s.name.charAt(0) }}</span>
          </span>
          <span class="fl-tile__name">{{ s.name }}</span>
          <span v-if="s.example" class="fl-tile__tag">示例</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fl-list {
  display: grid;
  gap: 26px;
  margin-top: 10px;
}
.fl-group__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  margin: 0 0 14px;
  color: var(--vp-c-text-1, #213547);
}
.fl-group__count {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  color: var(--vp-c-text-2, #6b7280);
}

/* ---------- 成员瓷砖：小正方形网格 ---------- */
.fl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  gap: 20px 16px;
}
.fl-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.fl-tile__box {
  width: 76px;
  height: 76px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}
.fl-tile:hover .fl-tile__box {
  transform: translateY(-5px);
  border-color: var(--vp-c-brand-1, #c0392b);
  box-shadow: 0 12px 26px -10px rgb(0 0 0 / 25%);
}
.fl-tile__box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.fl-tile__char {
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  color: var(--vp-c-brand-1, #c0392b);
}
.fl-tile__name {
  max-width: 100%;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  color: var(--vp-c-text-1, #213547);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fl-tile:hover .fl-tile__name {
  color: var(--vp-c-brand-1, #c0392b);
}
.fl-tile__tag {
  position: absolute;
  top: -8px;
  right: 0;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  color: var(--vp-c-text-2, #6b7280);
}
.fl-tile--example {
  opacity: 0.78;
}
.fl-tile--example .fl-tile__box {
  border-style: dashed;
}
</style>
