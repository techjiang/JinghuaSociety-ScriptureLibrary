<script setup lang="ts">
withDefaults(defineProps<{ name: string; link?: string }>(), { link: '' })
</script>

<template>
  <a v-if="link" class="vp-cat-tag" :href="link">
    <span class="vp-cat-tag__dot" />
    <span class="vp-cat-tag__text">{{ name }}</span>
  </a>
  <span v-else class="vp-cat-tag">
    <span class="vp-cat-tag__dot" />
    <span class="vp-cat-tag__text">{{ name }}</span>
  </span>
</template>

<style scoped>
.vp-cat-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 12px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  color: var(--vp-c-text-1, #213547);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 14px;
}
a.vp-cat-tag:hover {
  border-color: var(--vp-c-brand-1, #c0392b);
  color: var(--vp-c-brand-1, #c0392b);
}
.vp-cat-tag__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1, #c0392b);
}
</style>
