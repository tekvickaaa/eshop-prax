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

const emit = defineEmits(['add-to-cart', 'remove-product', 'edit-product']);

function handleAddToCart() {
  emit('add-to-cart', props.productId);
}

function handleEditProduct() {
  emit('edit-product', props.productId);
}

async function handleRemoveProduct() {
  try {
    await fetch(`http://localhost:3333/products/${props.productId}`, {
      method: 'DELETE'
    });
    emit('remove-product', props.productId);
  } catch (error) {
    console.error('Failed to remove product:', error);
  }
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
      <div class="product-actions">
        <span class="price">{{ productPrice }} €</span>
        <div class="button-group">
          <button @click="handleEditProduct()" class="edit-btn">Edit</button>
          <button @click="handleRemoveProduct()" class="remove-btn">Remove</button>
          <button @click="handleAddToCart()" class="add-btn">Add to Cart</button>
        </div>
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
  height: 28rem;
  background-color: #dfdff0;
  color: #080808;
  border-radius: 2rem;
  padding: 1rem;
}

.product-card button {
  font-size: 0.85rem;
  background-color: #190d55;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.product-card button:hover {
  opacity: 0.8;
}

.product-card .edit-btn {
  background-color: #4a5568;
}

.product-card .remove-btn {
  background-color: #c53030;
}

.product-card .add-btn {
  background-color: #190d55;
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

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.price {
  font-size: 1.4rem;
  font-weight: bold;
  color: #190d55;
}

p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
