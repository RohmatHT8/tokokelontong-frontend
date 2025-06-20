<template>
  <div>
    <!-- Navbar -->
    <nav class="px-10 py-4 flex justify-between items-center relative">
      <div class="absolute top-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#22c55e"
            fill-opacity="1"
            d="M0,288L80,266.7C160,245,320,203,480,181.3C640,160,800,160,960,170.7C1120,181,1280,203,1360,213.3L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div class="space-x-4 z-10">
        <h1 class="font-semibold text-white text-2xl">Toko Kelontong</h1>
      </div>

      <div v-if="auth.token" class="z-10">
        <button
          @click="handleLogout"
          class="text-yellow-400 hover:underline font-medium"
        >
          Logout
        </button>
      </div>
      <div v-else class="z-10">
        <button
          @click="handleLogin"
          class="hover:underline bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-xl transition duration-200"
        >
          Login
        </button>
      </div>
    </nav>

    <!-- Search Bar -->
    <div class="mt-10 md:mt-40 flex justify-center">
      <input
        v-model="searchStore.search"
        type="text"
        placeholder="Cari produk..."
        class="w-96 p-2 border border-gray-300 rounded-xl mt-4 z-20"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useSearchPublic } from '@/stores/searchPublic'

const auth = useAuthStore()
const router = useRouter()
const searchStore = useSearchPublic()

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

const handleLogin = () => {
  router.push('/login')
}
</script>
