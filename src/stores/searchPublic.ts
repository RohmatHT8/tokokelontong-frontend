// src/stores/searchPublic.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchPublic = defineStore('searchPublic', () => {
  const search = ref('')

  return { search }
})
