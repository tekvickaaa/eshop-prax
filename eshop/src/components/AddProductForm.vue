<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['close', 'product-added'])

const formData = ref({
  name: '',
  detail: '',
  price: '',
  category1: '',
  category2: '',
  img_src: ''
})

const selectedImage = ref<File | null>(null)
const imagePreview = ref<string>('')
const isSubmitting = ref(false)
const errorMessage = ref('')

function handleImageSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    selectedImage.value = file
    
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function submitProduct() {
  errorMessage.value = ''
  
  if (!formData.value.name || !formData.value.price) {
    errorMessage.value = 'Name and price are required'
    return
  }
  
  isSubmitting.value = true
  
  try {
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.value.name)
    formDataToSend.append('detail', formData.value.detail)
    formDataToSend.append('price', formData.value.price)
    formDataToSend.append('category1', formData.value.category1)
    formDataToSend.append('category2', formData.value.category2)
    
    if (selectedImage.value) {
      formDataToSend.append('image', selectedImage.value)
    } else if (formData.value.img_src) {
      formDataToSend.append('img_src', formData.value.img_src)
    }
    
    const response = await fetch('http://localhost:3333/products', {
      method: 'POST',
      body: formDataToSend
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add product')
    }
    
    const result = await response.json()
    console.log('Product added:', result)
    
    emit('product-added')
    resetForm()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'
    console.error('Error adding product:', error)
  } finally {
    isSubmitting.value = false
  }
}


function resetForm() {
  formData.value = {
    name: '',
    detail: '',
    price: '',
    category1: '',
    category2: '',
    img_src: ''
  }
  selectedImage.value = null
  imagePreview.value = ''
  errorMessage.value = ''
}

function closeForm() {
  resetForm()
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="closeForm">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Add New Product</h2>
        <button class="close-btn" @click="closeForm">×</button>
      </div>
      
      <form @submit.prevent="submitProduct" class="product-form">
        <div class="form-group">
          <label for="name">Product Name *</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            placeholder="Kingston Fury Beast..."
            required
          >
        </div>
        
        <div class="form-group">
          <label for="detail">Description</label>
          <textarea 
            id="detail" 
            v-model="formData.detail" 
            placeholder="Product details..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="price">Price (€) *</label>
          <input 
            type="number" 
            id="price" 
            v-model="formData.price" 
            placeholder="67.67"
            step="0.01"
            min="0"
            required
          >
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="category1">Category 1</label>
            <input 
              type="text" 
              id="category1" 
              v-model="formData.category1" 
              placeholder="DDR4, DDR5..."
            >
          </div>
          
          <div class="form-group">
            <label for="category2">Category 2</label>
            <input 
              type="text" 
              id="category2" 
              v-model="formData.category2" 
              placeholder="16 GB, 2x8 GB..."
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="image">Upload Image</label>
          <input 
            type="file" 
            id="image" 
            accept="image/*"
            @change="handleImageSelect"
          >
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="Preview">
            <button type="button" @click="selectedImage = null; imagePreview = ''" class="remove-preview">
              Remove
            </button>
          </div>
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div class="form-actions">
          <button type="button" @click="closeForm" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Adding...' : 'Add Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  color: #190d55;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
}

.close-btn:hover {
  color: #190d55;
}

.product-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #190d55;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.image-preview {
  margin-top: 1rem;
  position: relative;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
}

.remove-preview {
  display: block;
  margin-top: 0.5rem;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.remove-preview:hover {
  background-color: #c82333;
}

.error-message {
  background-color: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #190d55;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #120a3e;
}

.btn-primary:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}
</style>
