<template>
  <h1>hello vite</h1>
  <h2>
    <span>count is {{count}}*2={{double}}</span>
    <button @click="add">戳我</button>
  </h2>
</template>
<script>
// import { ref, computed, defineComponent, onMounted } from 'vue'
import { debounce } from 'lodash-es'
export default defineComponent({
  setup(){
    const count = ref(6)
    function add(){
      count.value++
    }
    const double = computed(()=> count.value*2)
    return {
      count,
      add: debounce(add, 300),
      double,
    }
  }
})
</script>
<style>
h1 {
  color:red;
}
</style>