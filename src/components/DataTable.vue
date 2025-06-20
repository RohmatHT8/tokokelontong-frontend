<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Daftar {{ name }}</h1>

        <div class="flex flex-col md:flex-row justify-between mb-4 gap-2">
            <input
                v-model="search"
                type="text"
                placeholder="Cari..."
                @input="fetchData"
                class="border rounded px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                @click="handleAdd"
            >
                + Tambah Data
            </button>
        </div>

        <!-- Loading -->
        <div
            v-if="isLoading"
            class="text-green-600 text-center font-semibold py-10"
        >
            Memuat data...
        </div>

        <!-- Tabel -->
        <div v-else class="overflow-auto rounded-lg shadow border">
            <table class="min-w-full text-left text-sm">
                <thead class="bg-green-100 text-green-700 uppercase text-xs">
                    <tr>
                        <th class="px-6 py-3">#</th>
                        <th
                            v-for="col in columns"
                            :key="col.key"
                            class="px-6 py-3"
                        >
                            {{ col.label }}
                        </th>
                        <th class="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in items"
                        :key="item.id"
                        class="border-t hover:bg-gray-50"
                    >
                        <td class="px-6 py-3">
                            {{ (currentPage - 1) * perPage + index + 1 }}
                        </td>
                        <td
                            v-for="col in columns"
                            :key="col.key"
                            class="px-6 py-3"
                        >
                            {{ item[col.key] }}
                        </td>
                        <td class="px-6 py-3 text-right space-x-2">
                            <button
                                class="text-blue-500 hover:underline text-sm"
                                @click="handleEdit(item.id)"
                            >
                                Edit
                            </button>
                            <button
                                class="text-red-500 hover:underline text-sm"
                                @click="handleDelete(item.id)"
                            >
                                Hapus
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Footer -->
        <div
            v-if="!isLoading"
            class="flex flex-col md:flex-row justify-between items-center mt-4 text-sm gap-3"
        >
            <div>
                Menampilkan <strong>{{ items.length }}</strong> dari total
                <strong>{{ total }}</strong> {{ name.toLowerCase() }}
            </div>

            <div class="flex items-center gap-2">
                <select
                    v-model.number="perPage"
                    @change="changePerPage"
                    class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option :value="5">5 / halaman</option>
                    <option :value="10">10 / halaman</option>
                    <option :value="20">20 / halaman</option>
                </select>

                <div class="space-x-2">
                    <button
                        @click="prevPage"
                        :disabled="currentPage === 1"
                        class="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        @click="nextPage"
                        :disabled="currentPage === lastPage"
                        class="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "@/services/api";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const props = defineProps<{
    name: string;
    fetchUrl: string;
    columns: { key: string; label: string }[];
}>();

const items = ref<any[]>([]);
const currentPage = ref(1);
const perPage = ref(5);
const total = ref(0);
const lastPage = ref(1);
const search = ref("");
const isLoading = ref(false);
const router = useRouter();

const fetchData = async () => {
    isLoading.value = true;
    try {
        const res = await axios.get(props.fetchUrl, {
            params: {
                page: currentPage.value,
                limit: perPage.value,
                search: search.value,
            },
        });

        items.value = res.data.data;
        total.value = res.data.total;
        lastPage.value = res.data.lastPage;
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: `Gagal mengambil data ${props.name.toLowerCase()}`,
            text: "Terjadi kesalahan saat memuat data.",
        });
    } finally {
        isLoading.value = false;
    }
};

const nextPage = () => {
    if (currentPage.value < lastPage.value) {
        currentPage.value++;
        fetchData();
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchData();
    }
};

const changePerPage = () => {
    currentPage.value = 1;
    fetchData();
};

const handleAdd = () => {
    router.push(`/admin${props.fetchUrl}/create`);
};

const handleEdit = (id: number) => {
    router.push(`/admin${props.fetchUrl}/edit/${id}`);
};

const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
        title: "Yakin ingin menghapus?",
        text: `Data ${props.name.toLowerCase()} akan dihapus permanen.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
        try {
            await axios.delete(`${props.fetchUrl}/${id}`);
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: `${props.name} berhasil dihapus.`,
            });
            currentPage.value = 1;
            fetchData();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal menghapus",
                text: "Terjadi kesalahan saat menghapus data.",
            });
        }
    }
};

onMounted(fetchData);
</script>
