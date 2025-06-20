<template>
    <div class="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden border">
        <img
            class="w-full h-48 object-cover"
            :src=data.image
            alt="Product Image"
        />

        <div class="p-4">
            <div class="text-sm text-gray-500">{{ data.sku }}</div>
            <h2 class="text-lg font-semibold text-gray-900">{{ data.name }}</h2>
            <div class="text-lg font-bold text-green-600 mb-2">Rp. {{ data.price.toLocaleString('id-ID') }}</div>
            <button
                class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
                @click="goToDetail(data.id)"
            >
                Lihat Detail
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

defineProps<{
  data: {
    id: number;
    name: string;
    sku: string;
    price: number;
    image: string;
  };
}>()

const router = useRouter();
const goToDetail = (id: number) => {
    router.push("/product/" + id);
};
</script>
