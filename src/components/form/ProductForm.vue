<template>
    <div class="max-w-full mx-auto p-6 bg-white rounded-xl shadow-md">
        <h1 class="text-2xl font-bold mb-4 text-green-600">
            {{ isEdit ? "Edit" : "Tambah" }} Produk
        </h1>

        <form @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="SKU" v-model="form.sku" :error="errors.sku" />
                <FormInput
                    label="Nama Produk"
                    v-model="form.name"
                    :error="errors.name"
                />

                <FormInput
                    label="Harga"
                    type="number"
                    v-model.number="form.price"
                    :error="errors.price"
                />
                <FormInput
                    label="Link Gambar"
                    v-model="form.image"
                    :error="errors.image"
                />

                <FormInput
                    label="Berat (gram)"
                    type="number"
                    v-model.number="form.weight"
                    :error="errors.weight"
                />
                <FormInput
                    label="Panjang (cm)"
                    type="number"
                    v-model.number="form.length"
                    :error="errors.length"
                />
                <FormInput
                    label="Lebar (cm)"
                    type="number"
                    v-model.number="form.width"
                    :error="errors.width"
                />
                <FormInput
                    label="Tinggi (cm)"
                    type="number"
                    v-model.number="form.height"
                    :error="errors.height"
                />

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Deskripsi</label
                    >
                    <textarea
                        v-model="form.description"
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows="3"
                    />
                    <p
                        v-if="errors.description"
                        class="text-red-500 text-sm mt-1"
                    >
                        {{ errors.description }}
                    </p>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Kategori</label
                    >
                    <select
                        v-model="form.CategoryId"
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="" disabled>Pilih kategori</option>
                        <option
                            v-for="cat in categories"
                            :key="cat.id"
                            :value="cat.id"
                        >
                            {{ cat.name }}
                        </option>
                    </select>
                    <p
                        v-if="errors.CategoryId"
                        class="text-red-500 text-sm mt-1"
                    >
                        {{ errors.CategoryId }}
                    </p>
                </div>
            </div>

            <button
                type="submit"
                :disabled="isLoading"
                class="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
            >
                {{ isLoading ? "Menyimpan..." : "Simpan" }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from "vue";
import axios from "@/services/api";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

import FormInput from "@/components/FormInput.vue";

interface Category {
    id: number;
    name: string;
}

const form = reactive({
    sku: "",
    name: "",
    description: "",
    weight: 0,
    width: 0,
    length: 0,
    height: 0,
    image: "",
    price: 0,
    CategoryId: null as number | null,
});

const categories = ref<Category[]>([]);
const errors = reactive<Record<string, string>>({});
const isLoading = ref(false);

const route = useRoute();
const router = useRouter();
const isEdit = ref(false);
const productId = ref<number | null>(null);

const fetchCategories = async () => {
    try {
        const res = await axios.get("/category", {
            params: { page: 1, limit: 100, search: "" },
        });
        categories.value = res.data.data || [];
    } catch {
        Swal.fire({ icon: "error", title: "Gagal memuat kategori" });
    }
};

const fetchProduct = async (id: number) => {
    try {
        const res = await axios.get(`/product/${id}`);
        Object.assign(form, res.data);
    } catch {
        Swal.fire({ icon: "error", title: "Gagal memuat produk" });
    }
};

const handleSubmit = async () => {
    isLoading.value = true;
    Object.keys(errors).forEach((k) => delete errors[k]);

    try {
        if (isEdit.value && productId.value) {
            const { id, ...payload } = form;
            await axios.put(`/product/${productId.value}`, payload);
        } else {
            await axios.post("/product", form);
        }

        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Produk disimpan",
        });
        router.push("/admin/product");
    } catch (error: any) {
        if (
            error.response?.status === 400
        ) {
            if(
            Array.isArray(error.response.data.message)
            ) {
                error.response.data.message.forEach((msg: string) => {
                    if (msg.toLowerCase().includes("sku")) errors.sku = msg;
                    if (msg.toLowerCase().includes("name")) errors.name = msg;
                    if (msg.toLowerCase().includes("description"))
                        errors.description = msg;
                    if (msg.toLowerCase().includes("weight")) errors.weight = msg;
                    if (msg.toLowerCase().includes("width")) errors.width = msg;
                    if (msg.toLowerCase().includes("length")) errors.length = msg;
                    if (msg.toLowerCase().includes("height")) errors.height = msg;
                    if (msg.toLowerCase().includes("image")) errors.image = msg;
                    if (msg.toLowerCase().includes("price")) errors.price = msg;
                    if (msg.toLowerCase().includes("categoryid"))
                        errors.CategoryId = msg;
                });
            } else {
                errors.sku = error.response.data.message;
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat menyimpan produk",
            });
        }
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    await fetchCategories();

    const idParam = route.params.id;
    if (idParam) {
        isEdit.value = true;
        productId.value = Number(idParam);
        await fetchProduct(productId.value);
    }
});
</script>
