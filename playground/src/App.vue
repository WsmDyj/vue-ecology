<template>
  <h1>hello vite</h1>
  <h2>
    <span>count is {{count}}*2={{double}}</span>
    <button @click="count++">戳我</button>
  </h2>
</template>
<script>
import { ref, computed, defineComponent, onMounted } from 'vue'
import { isFunction } from 'lodash-es'
export default defineComponent({
  setup(){
    const count = ref(6)
    function add(){
      count.value++
    }
    const double = computed(()=>count.value*2)
    onMounted(() => {
      console.log(isFunction(double.value))
    })
    return {
      count,
      add,
      double
    }
  }
})
</script>
<style>
h1 {
  color:red;
}
</style>