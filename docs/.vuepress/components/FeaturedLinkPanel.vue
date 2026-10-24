<script setup lang="ts">
import { computed } from 'vue'
import { featuredLinks } from '../featured-links'

const realCount = computed(() => featuredLinks.filter((s) => !s.example).length)
const exampleCount = computed(() => featuredLinks.length - realCount.value)
</script>

<template>
  <div class="fl-panel">
    <div class="fl-panel__stat">
      <span class="fl-panel__num">{{ realCount }}</span>
      <span class="fl-panel__label">位正式成员</span>
      <span v-if="exampleCount > 0" class="fl-panel__hint">
        （另有 {{ exampleCount }} 个示例占位，提交 PR 后替换）
      </span>
    </div>
    <div class="fl-panel__actions">
      <a class="fl-btn fl-btn--brand" href="/go/">🎲 随机前往一个成员站点</a>
      <a class="fl-btn fl-btn--alt" href="/featured-link/">➕ 加入精链</a>
    </div>
  </div>
</template>

<style scoped>
.fl-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  margin: 16px 0 28px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 12px;
  background: var(--vp-c-bg-soft, #f9f9fa);
}
.fl-panel__stat {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.fl-panel__num {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1;
  color: var(--vp-c-brand-1, #c0392b);
}
.fl-panel__label {
  font-weight: 600;
  color: var(--vp-c-text-1, #213547);
}
.fl-panel__hint {
  font-size: 0.8rem;
  color: var(--vp-c-text-2, #6b7280);
}
.fl-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.fl-btn {
  display: inline-block;
  padding: 9px 18px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.18s ease;
}
.fl-btn--brand {
  background: var(--vp-c-brand-1, #c0392b);
  color: #fff;
}
.fl-btn--brand:hover {
  filter: brightness(1.08);
}
.fl-btn--alt {
  border: 1px solid var(--vp-c-brand-1, #c0392b);
  color: var(--vp-c-brand-1, #c0392b);
}
.fl-btn--alt:hover {
  background: var(--vp-c-brand-1, #c0392b);
  color: #fff;
}
</style>
