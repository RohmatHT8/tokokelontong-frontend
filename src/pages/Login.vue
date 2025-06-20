<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="handleLogin" class="bg-white p-6 rounded-lg shadow w-full max-w-sm">
      <h1 class="text-green-500 font-bold text-3xl">Toko Kelontong</h1>
      <h2 class="text-lg font-semibold">Login</h2>

      <div class="relative">
        <div class="absolute h-2 w-10 bg-green-500 -top-1 rounded-md"></div>
        <hr class="border-gray-300 mb-4 mt-2" />
      </div>

      <FormInput
        label="Email"
        type="email"
        v-model="email"
        :error="errors.email"
      />
      <FormInput
        label="Password"
        type="password"
        v-model="password"
        :error="errors.password"
        class="mt-3"
      />

      <button type="submit" class="btn w-full mt-4">Login</button>

      <p class="text-sm mt-2 text-center">
        Belum punya akun?
        <router-link to="/register" class="text-green-600">Daftar</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import FormInput from '@/components/FormInput.vue'

const email = ref('')
const password = ref('')
const errors = reactive<{ email?: string; password?: string }>({})
const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  errors.email = undefined
  errors.password = undefined

  try {
    const success = await auth.login({ email: email.value, password: password.value })

    if (success) {
      router.push('/admin')
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Login',
        text: 'Credential salah, silakan coba lagi.',
        confirmButtonText: 'OK',
      })
    }
  } catch (error: any) {
    if (
      error.response?.status === 400 &&
      Array.isArray(error.response?.data?.message)
    ) {
      const messages: string[] = error.response.data.message
      messages.forEach((msg) => {
        if (msg.toLowerCase().includes('email')) errors.email = msg
        if (msg.toLowerCase().includes('password')) errors.password = msg
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Gagal melakukan login.',
      })
    }
  }
}

</script>

<style scoped>
.btn {
  @apply bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700;
}
</style>
