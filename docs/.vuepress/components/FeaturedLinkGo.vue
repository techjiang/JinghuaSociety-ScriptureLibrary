<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { featuredLinks } from '../featured-links'

const target = ref<{ name: string; url: string } | null>(null)
const empty = ref(false)

onMounted(() => {
  // 优先从「真实成员」里随机；没有真实成员时才退而求其次用全部（含示例）
  const real = featuredLinks.filter((s) => !s.example)
  const pool = real.length ? real : featuredLinks

  if (!pool.length) {
    empty.value = true
    return
  }

  const pick = pool[Math.floor(Math.random() * pool.length)]
  target.value = { name: pick.name, url: pick.url }

  // 稍作停顿让用户看到提示，再跳转（避免「一闪而过」）
  window.setTimeout(() => {
    window.location.href = pick.url
  }, 1200)
})
</script>

<template>
  <div class="fl-go">
    <div class="fl-go__badge">精链 · FeaturedLink</div>

    <template v-if="!empty">
      <h1>正在为你跳转……</h1>
      <p class="fl-go__sub">你即将前往一个「精链」精选成员站点。</p>
      <a v-if="target" class="fl-go__link" :href="target.url">
        若未自动跳转，点此前往「{{ target.name }}」→
      </a>
    </template>

    <template v-else>
      <h1>「精链」正在招募首批成员</h1>
      <p class="fl-go__sub">
        想让你的站点也加入这个环？
        <a href="/featured-link/">看看怎么加入精链 →</a>
      </p>
    </template>
  </div>
</template>

<style scoped>
.fl-go {
  min-height: 62vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 14px;
  padding: 40px 20px;
}
.fl-go__badge {
  display: inline-block;
  padding: 6px 16px;
  border: 1px dashed var(--vp-c-brand-1, #c0392b);
  border-radius: 999px;
  color: var(--vp-c-brand-1, #c0392b);
  font-weight: 600;
  letter-spacing: 0.5px;
}
.fl-go h1 {
  margin: 0;
  font-size: 1.6rem;
}
.fl-go__sub {
  margin: 0;
  color: var(--vp-c-text-2, #6b7280);
}
.fl-go__link,
.fl-go a {
  color: var(--vp-c-brand-1, #c0392b);
  font-weight: 600;
}
</style>
