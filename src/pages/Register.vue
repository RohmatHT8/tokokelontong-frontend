<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="handleRegister" class="bg-white p-6 rounded-lg shadow w-full max-w-sm">
      <h1 class="text-green-500 font-bold text-3xl">Toko Kelontong</h1>
      <h2 class="text-lg font-semibold">Register</h2>

      <div class="relative">
        <div class="absolute h-2 w-10 bg-green-500 -top-1 rounded-md"></div>
        <hr class="border-gray-300 mb-4 mt-2" />
      </div>

      <FormInput
        label="Email"
        type="email"
        v-model="form.email"
        :error="errors.email"
      />
      <FormInput
        label="Password"
        type="password"
        v-model="form.password"
        :error="errors.password"
        class="mt-3"
      />
      <FormInput
        label="Firstname"
        v-model="form.firstname"
        :error="errors.firstname"
        class="mt-3"
      />
      <FormInput
        label="Lastname"
        v-model="form.lastname"
        :error="errors.lastname"
        class="mt-3"
      />

      <button type="submit" class="btn w-full mt-4">Daftar</button>

      <p class="text-sm mt-2 text-center">
        Sudah punya akun?
        <router-link to="/login" class="text-green-600">Login</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import FormInput from '@/components/FormInput.vue'
import axios from '@/services/api'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  firstname: '',
  lastname: ''
})

const errors = reactive<{
  email?: string
  password?: string
  firstname?: string
  lastname?: string
}>({})

const handleRegister = async () => {
  // Reset error state
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    await axios.post('/auth/signup', form)

    Swal.fire({
      icon: 'success',
      title: 'Pendaftaran berhasil',
      text: 'Silakan login dengan akun Anda',
    })

    router.push('/login')
  } catch (error: any) {
    if (error.response?.status === 400 && Array.isArray(error.response.data.message)) {
      const messages = error.response.data.message
      messages.forEach((msg: string) => {
        if (msg.toLowerCase().includes('email')) errors.email = msg
        if (msg.toLowerCase().includes('password')) errors.password = msg
        if (msg.toLowerCase().includes('firstname')) errors.firstname = msg
        if (msg.toLowerCase().includes('lastname')) errors.lastname = msg
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Daftar',
        text: 'Terjadi kesalahan saat mendaftar.',
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
