<script setup lang="ts">
defineProps<{
  cartItems: Array<{
    id: number
    name: string
    price: number
    imgSrc: string
    quantity: number
  }>
}>();

const emit = defineEmits(['close', 'update-quantity', 'remove-item', 'buy']);

function getTotal(items: Array<{ price: number; quantity: number }>) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total.toFixed(2);
}
</script>

<template>
  <div class="cart-overlay" @click="emit('close')"></div>
  <div class="cart-drawer">
    <div class="cart-header">
      <h3>Košík</h3>
      <button class="close-btn" @click="emit('close')">✕</button>
    </div>

    <div class="cart-content">
      <div v-if="cartItems.length === 0" class="cart-empty">
        Košík je prázdny
      </div>

      <div v-else>
        <div class="cart-item" v-for="item in cartItems" :key="item.id">
          <img :src="item.imgSrc" alt="" class="cart-item-img">
          <div class="cart-item-info">
            <p class="cart-item-name">{{ item.name }}</p>
            <p class="cart-item-price">{{ item.price }} €</p>
          </div>
          <div class="cart-item-controls">
            <button @click="emit('update-quantity', item.id, item.quantity - 1)">−</button>
            <span>{{ item.quantity }}</span>
            <button @click="emit('update-quantity', item.id, item.quantity + 1)">+</button>
          </div>
          <button class="remove-btn" @click="emit('remove-item', item.id)">✕</button>
        </div>
      </div>
    </div>

    <div class="cart-footer" v-if="cartItems.length > 0">
      <div class="cart-total">
        <span>Spolu:</span>
        <span class="total-price">{{ getTotal(cartItems) }} €</span>
      </div>
      <button class="buy-btn" @click="emit('buy')">Kúpiť</button>
    </div>
  </div>
</template>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  z-index: 100;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 24rem;
  height: 100%;
  background-color: #f0f0f5;
  z-index: 101;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #190d55;
  color: #dfdff0;
}

.cart-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #dfdff0;
  font-size: 1.2rem;
  cursor: pointer;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-empty {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #dfdff0;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.cart-item-img {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 0.25rem;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-name {
  font-size: 0.75rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item-price {
  font-size: 0.8rem;
  font-weight: bold;
  margin: 0;
  color: #190d55;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-item-controls button {
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background-color: #190d55;
  color: white;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.cart-item-controls span {
  min-width: 1.5rem;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #990000;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
}

.cart-footer {
  padding: 1rem;
  background-color: #dfdff0;
  border-top: 1px solid #ccc;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.total-price {
  font-weight: bold;
  font-size: 1.2rem;
}

.buy-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #190d55;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.buy-btn:hover {
  background-color: #120a3e;
}
</style>
