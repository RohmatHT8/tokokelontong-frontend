<template>
  <div class="max-w-full mx-auto p-6 bg-white rounded-xl shadow-md">
    <h1 class="text-2xl font-bold mb-4 text-green-600">
      {{ isEdit ? 'Edit' : 'Tambah' }} Kategori
    </h1>

    <form @submit.prevent="handleSubmit">
      <FormInput
        label="Nama Kategori"
        v-model="form.name"
        :error="errors.name"
      />

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 mt-4"
      >
        {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/api'
import Swal from 'sweetalert2'
import FormInput from '@/components/FormInput.vue'

const props = defineProps<{
  isEdit?: boolean
}>()

const route = useRoute()
const router = useRouter()

const form = reactive({
  name: ''
})

const errors = reactive<{ name?: string }>({})
const isLoading = ref(false)

const fetchCategory = async () => {
  try {
    const { id } = route.params
    const res = await axios.get(`/category/${id}`)
    form.name = res.data.name
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal memuat data',
      text: 'Kategori tidak ditemukan',
    })
    router.push('/admin/category')
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  errors.name = undefined

  try {
    const { id } = route.params

    if (props.isEdit && id) {
      await axios.put(`/category/${id}`, form)
      Swal.fire('Berhasil', 'Kategori berhasil diperbarui', 'success')
    } else {
      await axios.post('/category', form)
      Swal.fire('Berhasil', 'Kategori berhasil ditambahkan', 'success')
    }

    router.push('/admin/category')
  } catch (error: any) {
    const messages = error.response?.data?.message

    if (error.response?.status === 400 && Array.isArray(messages)) {
      messages.forEach((msg: string) => {
        if (msg.toLowerCase().includes('name')) {
          errors.name = msg
        }
      })
    } else {
      Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (props.isEdit) {
    fetchCategory()
  }
})
</script>
