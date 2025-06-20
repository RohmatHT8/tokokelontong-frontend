<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md border mt-6">
    <!-- Loading -->
    <div v-if="isLoading" class="text-center text-green-600 animate-pulse">
      Memuat data produk...
    </div>

    <!-- Gagal -->
    <div v-else-if="!product" class="text-center text-red-500">
      Produk tidak ditemukan.
    </div>

    <!-- Detail Produk -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <img
        :src="product.image"
        alt="Product Image"
        class="w-full h-64 object-cover rounded-xl shadow-sm"
      />

      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          {{ product.name }}
        </h1>
        <p class="text-gray-600 mb-4">
          {{ product.description }}
        </p>

        <div class="mb-2">
          <span class="text-sm text-gray-500">SKU:</span>
          <span class="font-medium text-gray-800">{{ product.sku }}</span>
        </div>

        <div class="mb-2">
          <span class="text-sm text-gray-500">Kategori:</span>
          <span class="font-medium text-gray-800">
            {{ category?.name || 'Tidak diketahui' }}
          </span>
        </div>

        <div class="mb-2">
          <span class="text-sm text-gray-500">Berat:</span>
          <span class="font-medium text-gray-800">{{ product.weight }} gram</span>
        </div>

        <div class="mb-4">
          <span class="text-sm text-gray-500">Dimensi:</span>
          <span class="font-medium text-gray-800">
            {{ product.width }} x {{ product.length }} x {{ product.height }} cm
          </span>
        </div>

        <div class="text-2xl font-bold text-green-600 mb-6">
          {{ formatRupiah(product.price) }}
        </div>

        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
          @click="goBack"
        >
          Kembali Ke Beranda
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/api'
import Swal from 'sweetalert2'

interface Product {
  id: number
  sku: string
  name: string
  description: string
  weight: number
  width: number
  length: number
  height: number
  image: string
  price: number
  CategoryId: number
}

interface Category {
  id: number
  name: string
}

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const product = ref<Product | null>(null)
const category = ref<Category | null>(null)
const isLoading = ref(true)

const goBack = () => {
  router.push('/')
}

const formatRupiah = (value: number) => {
  return `Rp ${value.toLocaleString('id-ID')}`
}

onMounted(async () => {
  try {
    isLoading.value = true

    const productRes = await axios.get(`/product/${id}`)
    product.value = productRes.data

    if (product.value) {
      const categoryRes = await axios.get(`/category/${product.value.CategoryId}`)
      category.value = categoryRes.data
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal memuat detail',
      text: 'Produk atau kategori tidak ditemukan.'
    })
  } finally {
    isLoading.value = false
  }
})
</script>
