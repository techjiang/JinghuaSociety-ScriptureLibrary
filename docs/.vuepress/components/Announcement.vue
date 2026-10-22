<template>
  <div v-if="visible" class="jh-ann" role="alert">
    <span class="jh-ann-icon">📢</span>
    <span class="jh-ann-text">
      藏经阁全新升级：新增「日常」分类与「名人堂」，欢迎来
      <a :href="joinLink">投稿</a>，一起把技术讲成人话。
    </span>
    <button class="jh-ann-close" type="button" aria-label="关闭公告" @click="dismiss">
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const visible = ref(false)
const base = import.meta.env.BASE_URL || '/'
const joinLink = base + 'join/'

function dismiss() {
  visible.value = false
  try {
    localStorage.setItem('jh-ann-dismissed', '1')
  } catch (e) {
    /* localStorage 不可用时直接关闭即可 */
  }
}

onMounted(() => {
  try {
    if (!localStorage.getItem('jh-ann-dismissed')) visible.value = true
  } catch (e) {
    visible.value = true
  }
})
</script>

<style scoped>
.jh-ann {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: #c0392b;
  color: #fff;
  font-size: 0.9rem;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.18);
}

.jh-ann-icon {
  flex: none;
}

.jh-ann-text {
  flex: 1 1 auto;
  line-height: 1.4;
}

.jh-ann-text a {
  color: #fff;
  text-decoration: underline;
  font-weight: 600;
}

.jh-ann-close {
  flex: none;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
}

.jh-ann-close:hover {
  background: rgba(255, 255, 255, 0.32);
}
</style>
