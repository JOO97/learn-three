<template>
  <div class="home"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import MyThree from '@/utils/three'
onMounted(() => {
  init()
})
let three = ref(null)
const init = () => {
  three.value = new MyThree('.home')
  console.log(three.value)
}
</script>
