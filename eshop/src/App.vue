<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ProductCard from './components/ProductCard.vue';
import WelcomeItem from './components/WelcomeItem.vue';
import CartDrawer from './components/CartDrawer.vue';
import AddProductForm from './components/AddProductForm.vue';
import UpdateProductForm from './components/UpdateProductForm.vue';

interface Product {
  id: number
  name: string
  detail: string
  price: number
  img_src: string
  category1: string
  category2: string
}

const products = ref<Product[]>([]);
const isAddFormOpen = ref(false);
const isUpdateFormOpen = ref(false);
const selectedProductId = ref<number | null>(null);

async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3333/products')
    if (!response.ok) throw new Error('Failed to fetch products')
    const data = await response.json()
    products.value = data
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

function handleProductAdded() {
  fetchProducts()
  isAddFormOpen.value = false
}

function handleProductUpdated() {
  fetchProducts()
  isUpdateFormOpen.value = false
}

function handleProductDeleted() {
  fetchProducts()
}

function handleEditProduct(productId: number) {
  selectedProductId.value = productId
  isUpdateFormOpen.value = true
}

onMounted(() => {
  fetchProducts()
})

interface CartItem {
  id: number
  name: string
  price: number
  imgSrc: string
  quantity: number
}

const cart = ref<CartItem[]>([]);
const isCartOpen = ref(false);

const searchText = ref('');
const priceFrom = ref<number | null>(null);
const priceTo = ref<number | null>(null);
const selectedCategory1 = ref('');
const selectedCategory2 = ref('');

const categories1 = computed(() => [...new Set(products.value.map(item => item.category1))]);
const categories2 = computed(() => [...new Set(products.value.map(item => item.category2))]);

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    if (searchText.value) {
      const search = searchText.value.toLowerCase();
      const matchesText = product.name.toLowerCase().includes(search) ||
                          product.detail.toLowerCase().includes(search);
      if (!matchesText) return false;
    }
    if (priceFrom.value !== null && product.price < priceFrom.value) return false;
    if (priceTo.value !== null && product.price > priceTo.value) return false;
    if (selectedCategory1.value && product.category1 !== selectedCategory1.value) return false;
    if (selectedCategory2.value && product.category2 !== selectedCategory2.value) return false;
    return true;
  });
});

function clearFilters() {
  searchText.value = '';
  priceFrom.value = null;
  priceTo.value = null;
  selectedCategory1.value = '';
  selectedCategory2.value = '';
}

function cartItemCount() {
  let count = 0;
  for (const item of cart.value) {
    count += item.quantity;
  }
  return count;
}

function addToCart(productId: number) {
  const product = products.value.find(item => item.id === productId);
  if (!product) return;

  const existingItem = cart.value.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      imgSrc: product.img_src,
      quantity: 1
    });
  }
  
  isCartOpen.value = true;
}

function updateQuantity(productId: number, newQuantity: number) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const item = cart.value.find(item => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
  }
}

function removeFromCart(productId: number) {
  const index = cart.value.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart.value.splice(index, 1);
  }
}

function buyCart() {
  alert('Ďakujeme za nákup! Vaša objednávka bola prijatá.');
  cart.value = [];
  isCartOpen.value = false;
}
</script>

<template>
  <nav>
    <div class="wrapped navbar">
      <h2>RAM Store</h2>
      <div>
        <button class="cart-btn" @click="isCartOpen = true">
          🛒 Košík
          <span v-if="cartItemCount() > 0" class="cart-badge">{{ cartItemCount() }}</span>
        </button>
        <button class="cart-btn" @click="isAddFormOpen = true">
          Add product
        </button>
        <button class="cart-btn" @click="isUpdateFormOpen = true">
          Change product
        </button>
      </div>
    </div>
  </nav>

  <CartDrawer
    v-if="isCartOpen"
    :cart-items="cart"
    @close="isCartOpen = false"
    @update-quantity="updateQuantity"
    @remove-item="removeFromCart"
    @buy="buyCart"
  />

  <AddProductForm
    v-if="isAddFormOpen"
    @close="isAddFormOpen = false"
    @product-added="handleProductAdded"
  />

  <UpdateProductForm
    v-if="isUpdateFormOpen"
    :product-id="selectedProductId"
    @close="isUpdateFormOpen = false"
    @product-updated="handleProductUpdated"
  />

  <header class="wrapped">
    <div>
      <h1>Welcome to the greatest RAM store in Europe!</h1>
      <p>Even if the prices are high, we guarantee the best quality and promise not to sell to AI companies. Only occassionally.</p>
    </div>
    <img src="./assets/images/hero-image.png" alt="hero image" class="hero-image">
  </header>

  <div class="wrapped">
    <WelcomeItem />
  </div>

  <div class="wrapped">
    <div>
      <label>Hľadať: </label>
      <input type="text" v-model="searchText" placeholder="Názov produktu...">
    </div>
    <div>
      <label>Cena od: </label>
      <input type="number" v-model="priceFrom" placeholder="Min">
      <label> do: </label>
      <input type="number" v-model="priceTo" placeholder="Max">
    </div>
    <div>
      <label>Typ: </label>
      <select v-model="selectedCategory1">
        <option value="">All</option>
        <option v-for="cat in categories1" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <label> Capacity: </label>
      <select v-model="selectedCategory2">
        <option value="">All</option>
        <option v-for="cat in categories2" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    <button @click="clearFilters">Clear filters</button>
  </div>

  <main>
    <div class="products wrapped">
      <p v-if="filteredProducts.length === 0">No products found</p>
      <ProductCard
      v-for="product in filteredProducts"
      :key="product.id"
      :product-id="product.id"
      :product-name="product.name"
      :product-desc="product.detail"
      :product-img-src="product.img_src"
      :product-category1="product.category1"
      :product-category2="product.category2"
      :product-price="product.price"
      @add-to-cart="addToCart"
      @edit-product="handleEditProduct"
      @remove-product="handleProductDeleted"
    />
    </div>
  </main>

  <footer>
    <div class="wrapped">
      <p>&copy; 2025 RAM Store. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
template {
  color: #080808;
}
nav{
  display: flex;
  align-items: center;
  background-color: #120a3e;
  color: #dfdff0;
  margin-bottom: 0.75rem;
  padding: 1rem;
}
.navbar {
  width: 77.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cart-btn {
  position: relative;
  background-color: #dfdff0;
  color: #190d55;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}
.cart-badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: #7c1212;
  color: white;
  font-size: 0.75rem;
  padding: 0.15rem 0.4rem;
  border-radius: 1rem;
  font-weight: bold;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rem;
  line-height: 1.5;
  background-color: #190d55;
  border-radius: 2rem;
  color: #dfdff0;
  margin-bottom: 1rem;
}
header div {
  max-width: 35rem;
}
.products{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 4rem;
  gap: 1rem;
}
footer{
  background-color: #190d55;
  color: #dfdff0;
  text-align: center;
}
</style>
