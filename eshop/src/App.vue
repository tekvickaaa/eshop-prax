<script setup lang="ts">
import ProductCard from './components/ProductCard.vue';
import WelcomeItem from './components/WelcomeItem.vue';
</script>

<template>
  <nav>
    <h2>RAM Store</h2>
    <div>
      <a href="/cart">Cart</a>
    </div>
  </nav>

  <header class="wrapped">
    <div>
      <h1>Welcome to the greatest RAM store in Europe!</h1>
      <p>Even if the prices are high, we guarantee the best quality and promise not to sell to AI companies. Only occassionally.</p>
    </div>
    <img src="./assets/images/hero-image.png" alt="hero image" class="hero-image">
  </header>

  <WelcomeItem class="wrapped"/>

  <main>
    <ProductCard 
      productName="Sample Product" 
      productDesc="This is a sample product description." 
      productImgSrc="https://upload.wikimedia.org/wikipedia/commons/d/db/Swissbit_2GB_PC2-5300U-555.jpg" 
      productCategory1="Sample Category" 
      productCategory2="4 GB"
      :productPrice="29.99"
    />
  </main>
</template>

<style scoped>
template {
  color: #080808;
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
</style>
