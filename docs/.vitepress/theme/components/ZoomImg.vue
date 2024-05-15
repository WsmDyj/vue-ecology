<script setup>
import { withBase } from 'vitepress'
import { onMounted, ref, computed } from 'vue'
import mediumZoom from 'medium-zoom'

const props = defineProps({
  src: String
})

const imgRef = ref(null)
const imgSrc = computed(() => {
  if (window.location.href.indexOf('vercel.app') !== -1) {
    return 'https://raw.githubusercontent.com/WsmDyj/vue-ecology/main/docs/' + props.src.replaceAll('../', '')
  } else {
    return props.src
  }
})
onMounted(() => {
  mediumZoom(imgRef.value,  { background: 'var(--vp-c-bg)' });
})
</script>

<template>
  <img ref="imgRef" :src="withBase(imgSrc)">
</template>

<style>
.medium-zoom-overlay {
  z-index: 20;
}
.medium-zoom-image {
  z-index: 21;
}
</style>