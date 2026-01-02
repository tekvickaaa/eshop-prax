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
    <div class="product-bottom">
      <h4>{{ productName }}</h4>
      <span class="product-category">{{ productCategory }}</span>
      <p>{{ productDesc }}</p>
      <div class="product-cart">
        <span class="price">{{ productPrice }}</span>
        <button>Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h4 {
  color: #080808;
  font-weight: bold;
}

.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 15rem;
  height: 20rem;
  background-color: #f0f0f5;
  color: #080808;
  border-radius: 3rem;
  padding: 1rem;
}

img {
  width: 100%;
  height: auto;
  border-radius: 2rem;
}

.product-category {
  font-size: 0.6rem;
  color: #190d55;
  border: 0.0652rem solid #190d55;
  border-radius: 0.125rem;
  padding: 0.125rem 0.25rem;
}

.product-cart {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: bold;
}
</style>
