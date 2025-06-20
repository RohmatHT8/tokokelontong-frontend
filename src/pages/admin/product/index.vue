<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
</script>

<template>
  <DataTable
    name="Product"
    fetchUrl="/product"
    :columns="[
      { key: 'name', label: 'Nama Produk' },
      { key: 'price', label: 'Harga' },
      { key: 'categoryName', label: 'Kategori' },
      { key: 'sku', label: 'SKU' },
      { key: 'weight', label: 'Berat (gram)' },
      { key: 'width', label: 'Lebar (cm)' },
      { key: 'length', label: 'Panjang (cm)' },
      { key: 'height', label: 'Tinggi (cm)' }
    ]"
  />
</template>