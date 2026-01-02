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
  <div class="product-card">
    <img :src="productImgSrc" alt="">
    <h4>{{ productName }}</h4>
    <div>
        <div>{{ productCategory }}</div>
        <p>{{ productDesc }}</p>
        <div>
          <span>{{ productPrice }}</span>
          <button>Add to Cart</button>
        </div>
    </div>
  </div>
</template>

<style scoped>
h4 {
  color: #191919
}

.porduct-card {
  border-radius: 33%
}
</style>
