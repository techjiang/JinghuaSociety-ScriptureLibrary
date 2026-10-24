<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { featuredLinks } from '../featured-links'

/**
 * 跳转前停留秒数。
 * 想改停留时长，改这个数字即可（例如 3 秒或 10 秒）。
 */
const DELAY_SECONDS = 6

const target = ref<{ name: string; url: string } | null>(null)
const empty = ref(false)
/** 是否已完成挑选（SSR 与首次渲染都保持中性态，避免 hydration 不匹配与首屏闪错内容） */
const ready = ref(false)
const left = ref(DELAY_SECONDS)
const progress = ref(0)
let timer: number | undefined

const pickOne = () => {
  // 候选池只保留「真实且非自身」的成员：
  // 永远排除示例占位，也永远排除「本站自身」，
  // 避免访客在站点 A 点“精链”后又被跳回 A 的死循环。
  // 当环里还没有其它成员时返回 null，由上层进入“招募首批成员”状态。
  const pool = featuredLinks.filter((s) => !s.example && !s.self)
  if (!pool.length) {
    empty.value = true
    return null
  }
  const pick = pool[Math.floor(Math.random() * pool.length)]
  return { name: pick.name, url: pick.url }
}

const jump = () => {
  if (timer) window.clearInterval(timer)
  if (target.value) window.location.href = target.value.url
}

const startCountdown = () => {
  timer = window.setInterval(() => {
    left.value -= 1
    progress.value = ((DELAY_SECONDS - left.value) / DELAY_SECONDS) * 100
    if (left.value <= 0) {
      if (timer) window.clearInterval(timer)
      jump()
    }
  }, 1000)
}

// 重新随机一个（不离开本站）
const reroll = () => {
  const pick = pickOne()
  if (!pick) return
  target.value = pick
  left.value = DELAY_SECONDS
  progress.value = 0
  if (timer) window.clearInterval(timer)
  startCountdown()
}

onMounted(() => {
  // /go 是中转跳转页，不应被搜索引擎收录（避免把中转页当成正文页索引）。
  // 主题默认已输出 robots=index,follow，这里直接覆盖为 noindex。
  const m = document.querySelector('meta[name="robots"]')
  if (m) {
    m.content = 'noindex, nofollow'
  } else {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
  }

  const pick = pickOne()
  if (!pick) {
    empty.value = true
  } else {
    target.value = pick
    startCountdown()
  }
  ready.value = true
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <div class="fl-go">
    <div class="fl-go__badge">精链 · FeaturedLink</div>

    <!-- 挑选中：SSR 与首帧一致，避免 hydration 警告与闪错 -->
    <template v-if="!ready">
      <h1 class="fl-go__name">正在为你挑选站点…</h1>
      <p class="fl-go__lead">稍等一秒，马上出发。</p>
    </template>

    <template v-else-if="empty">
      <h1 class="fl-go__name">「精链」正在招募首批成员</h1>
      <p class="fl-go__lead">
        想让你的站点也加入这个环？去看
        <a href="/featured-link/">怎么加入精链</a>。
      </p>
    </template>

    <template v-else-if="target">
      <p class="fl-go__lead">正在前往</p>
      <h1 class="fl-go__name">{{ target.name }}</h1>
      <a class="fl-go__url" :href="target.url" @click.prevent="jump">{{ target.url }}</a>

      <div
        class="fl-go__meter"
        role="progressbar"
        :aria-valuenow="left"
        aria-valuemin="0"
        :aria-valuemax="DELAY_SECONDS"
      >
        <div class="fl-go__meter-bar" :style="{ width: progress + '%' }" />
      </div>

      <p class="fl-go__count">
        <span class="fl-go__count-num">{{ left }}</span> 秒后自动跳转
      </p>

      <div class="fl-go__actions">
        <button type="button" class="fl-btn fl-btn--brand" @click="jump">立即前往</button>
        <button type="button" class="fl-btn fl-btn--alt" @click="reroll">换一个站点</button>
      </div>

      <p class="fl-go__hint">
        没反应？<a :href="target.url">点此手动前往</a>。
        「精链」之间靠彼此的回链串成一个环——想加入，看
        <a href="/featured-link/">加入精链</a>。
      </p>
    </template>

    <noscript>
      <p class="fl-go__hint">
        你的浏览器禁用了 JavaScript，无法自动跳转。请前往
        <a href="/featured-link/">精链成员页</a> 手动挑选站点。
      </p>
    </noscript>
  </div>
</template>

<style scoped>
.fl-go {
  /* 全屏固定覆盖层：脱离文档流，相对视口定位，
     彻底无视主题在宽屏下“文档+右侧大纲”的 flex/grid 布局，
     保证在任何窗口宽度下都严格居中。 */
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--vp-c-bg, #fff);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  padding: 0 20px;
  box-sizing: border-box;
}
.fl-go__badge {
  display: inline-block;
  padding: 6px 16px;
  border: 1px dashed var(--vp-c-brand-1, #c0392b);
  border-radius: 999px;
  color: var(--vp-c-brand-1, #c0392b);
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.fl-go__lead {
  margin: 0;
  color: var(--vp-c-text-2, #6b7280);
  font-size: 0.95rem;
}
.fl-go__name {
  margin: 0;
  font-size: 2rem;
  line-height: 1.3;
}
.fl-go__url {
  color: var(--vp-c-text-2, #6b7280);
  font-size: 0.85rem;
  word-break: break-all;
  text-decoration: none;
  border-bottom: 1px dotted currentcolor;
}
.fl-go__url:hover {
  color: var(--vp-c-brand-1, #c0392b);
}
.fl-go__meter {
  width: min(360px, 80vw);
  height: 6px;
  margin: 14px 0 4px;
  border-radius: 999px;
  background: var(--vp-c-divider, #e2e2e3);
  overflow: hidden;
}
.fl-go__meter-bar {
  height: 100%;
  border-radius: 999px;
  background: var(--vp-c-brand-1, #c0392b);
  transition: width 1s linear;
}
.fl-go__count {
  margin: 0;
  color: var(--vp-c-text-2, #6b7280);
  font-size: 0.9rem;
}
.fl-go__count-num {
  display: inline-block;
  min-width: 1.2em;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--vp-c-brand-1, #c0392b);
}
.fl-go__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}
.fl-btn {
  padding: 9px 20px;
  border: 0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
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
  background: transparent;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  color: var(--vp-c-text-1, #213547);
}
.fl-btn--alt:hover {
  border-color: var(--vp-c-brand-1, #c0392b);
  color: var(--vp-c-brand-1, #c0392b);
}
.fl-go__hint {
  margin: 14px 0 0;
  font-size: 0.82rem;
  color: var(--vp-c-text-2, #6b7280);
  max-width: 34em;
}
.fl-go a {
  color: var(--vp-c-brand-1, #c0392b);
  font-weight: 600;
}
</style>
