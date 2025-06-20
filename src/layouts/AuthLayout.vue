<template>
    <div class="flex h-screen bg-gray-100 overflow-hidden">
        <!-- Sidebar -->
        <aside
            :class="[
                'bg-white w-64 shadow-md fixed z-30 inset-y-0 left-0 transform md:translate-x-0 transition-transform duration-200 ease-in-out',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            ]"
        >
            <div
                class="p-4 font-bold text-green-600 text-xl border-b flex items-center gap-2"
            >
                <LayoutDashboard class="w-5 h-5" />
                Admin Panel
            </div>

            <nav class="p-4 space-y-3">
                <router-link
                    to="/admin"
                    class="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
                >
                    <LayoutDashboard class="w-5 h-5" />
                    Dashboard
                </router-link>

                <router-link
                    to="/admin/category"
                    class="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
                >
                    <Folder class="w-5 h-5" />
                    Categories
                </router-link>
                
                <router-link
                    to="/admin/product"
                    class="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
                >
                    <Package class="w-5 h-5" />
                    Products
                </router-link>
            </nav>
        </aside>

        <!-- Overlay Mobile -->
        <div
            v-if="sidebarOpen"
            class="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
            @click="sidebarOpen = false"
        ></div>

        <!-- Content -->
        <div class="flex-1 flex flex-col md:pl-64">
            <!-- Header -->
            <header
                class="bg-white shadow-md px-4 py-3 flex justify-between items-center"
            >
                <button
                    class="md:hidden text-gray-600"
                    @click="sidebarOpen = !sidebarOpen"
                >
                    <Menu class="h-6 w-6" />
                </button>

                <div
                    class="font-semibold text-gray-700 flex items-center gap-2"
                >
                    <LayoutDashboard class="w-5 h-5 text-green-600" />
                    Dashboard Admin
                </div>

                <button
                    class="text-sm text-red-500 hover:underline flex items-center gap-1"
                    @click="logout"
                >
                    <LogOut class="w-4 h-4" />
                    Logout
                </button>
            </header>

            <main class="flex-1 overflow-y-auto p-6">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
    Menu,
    LogOut,
    LayoutDashboard,
    Package,
    Folder,
} from "lucide-vue-next";

const sidebarOpen = ref(false);
const router = useRouter();

const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
};
</script>
