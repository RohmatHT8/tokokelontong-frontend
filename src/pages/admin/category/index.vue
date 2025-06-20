<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
</script>

<template>
  <DataTable
    name="Category"
    fetchUrl="/category"
    :columns="[
      { key: 'name', label: 'Nama Kategori' }
    ]"
  />
</template>
