<script setup lang="ts">
defineProps<{
  productName: string
  productDesc: string
  productImgSrc: string
  productCategory: string
  productPrice: number
}>()
</script>

<template>
  <div>
    <img src="" alt="">
    <h4>{{ productName }}</h4>
    <div>
        <p>{{ productDesc }}</p>

    </div>
  </div>
</template>

<style scoped>

</style>
