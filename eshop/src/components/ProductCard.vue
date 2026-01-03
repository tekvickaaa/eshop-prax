<script setup lang="ts">
const props = defineProps<{
  productId: number
  productName: string
  productDesc: string
  productImgSrc: string
  productCategory1: string
  productCategory2: string
  productPrice: number
}>();

const emit = defineEmits(['add-to-cart']);

function handleAddToCart() {
  emit('add-to-cart', props.productId);
}
</script>

<template>
  <div class="product-card" :key="productId">
    <img :src="productImgSrc" alt="">
    <div class="product-bottom">
      <h4>{{ productName }}</h4>
      <span class="product-category">{{ productCategory1 }}</span>
      <span class="product-category">{{ productCategory2 }}</span>
      <p>{{ productDesc }}</p>
      <div class="product-cart">
        <span class="price">{{ productPrice }} €</span>
        <button @click="handleAddToCart()">Add to Cart</button>
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
  width: 18rem;
  height: 24rem;
  background-color: #dfdff0;
  color: #080808;
  border-radius: 2rem;
  padding: 1rem;
}

.product-card button {
  font-size: 1.1rem;
  background-color: #190d55;
  color: white;
  border: none;
  border-radius: 0.8rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.product-card img {
  width: 100%;
  height: auto;
  border-radius: 1.5rem;
}

.product-category {
  font-size: 0.6rem;
  color: #190d55;
  border: 0.0652rem solid #190d55;
  border-radius: 0.125rem;
  padding: 0.125rem 0.25rem;
  margin-right: 0.25rem;
}

.product-cart {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.2rem;
  font-weight: bold;
}

p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
