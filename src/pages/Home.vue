<template>
    <div v-if="categories.length" class="mt-5 px-10 md:px-40">
        <div class="flex flex-wrap gap-2 mb-4">
            <button
                @click="filterByCategory(null)"
                :class="[
                    'px-3 py-1 rounded-full border transition',
                    selectedCategoryId === null
                        ? 'bg-green-500 text-white'
                        : 'border-green-500 text-green-600 hover:bg-green-100',
                ]"
            >
                Semua
            </button>

            <button
                v-for="cat in categories"
                :key="cat.id"
                @click="filterByCategory(cat.id)"
                :class="[
                    'px-3 py-1 rounded-full border transition',
                    selectedCategoryId === cat.id
                        ? 'bg-green-500 text-white'
                        : 'border-green-500 text-green-600 hover:bg-green-100',
                ]"
            >
                {{ cat.name }}
            </button>
        </div>
    </div>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="text-green-600 font-semibold animate-pulse text-lg">
            Loading produk...
        </div>
    </div>

    <div
        v-else-if="products.length === 0"
        class="text-center text-gray-500 mt-10"
    >
        Tidak ada product yang ditemukan.
    </div>

    <div
        v-else
        class="mt-5 px-10 md:px-40 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
        <Card v-for="product in products" :key="product.id" :data="product" />
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import axios from "@/services/api";
import Card from "@/components/Card.vue";
import { useSearchPublic } from "@/stores/searchPublic";

interface Product {
    id: number;
    sku: string;
    name: string;
    description: string;
    weight: number;
    width: number;
    length: number;
    height: number;
    image: string;
    price: number;
    CategoryId: number;
}

interface Category {
    id: number;
    name: string;
}

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const isLoading = ref(true);

const page = ref(1);
const limit = ref(12);

const searchStore = useSearchPublic();
const selectedCategoryId = ref<number | null>(null);

const filterByCategory = (categoryId: number | null) => {
    selectedCategoryId.value = categoryId;
    page.value = 1;

    fetchData();
};

const fetchData = async () => {
    try {
        isLoading.value = true;

        const [productRes, categoryRes] = await Promise.all([
            axios.get("/product", {
                params: {
                    page: page.value,
                    limit: limit.value,
                    search: searchStore.search,
                    category: selectedCategoryId.value,
                },
            }),
            axios.get("/category", {
                params: {
                    page: page.value,
                    limit: 100,
                    search: "",
                },
            }),
        ]);

        products.value = productRes.data.data || productRes.data;
        categories.value = categoryRes.data.data || categoryRes.data;
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Gagal memuat data",
            text: "Terjadi kesalahan saat mengambil data produk atau kategori.",
        });
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchData);

watch(
    () => searchStore.search,
    () => {
        page.value = 1;
        fetchData();
    }
);
</script>
