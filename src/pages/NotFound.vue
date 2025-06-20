<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
        <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-800">404</h1>
        <p class="mt-4 text-xl text-gray-600">Halaman tidak ditemukan</p>
        <button
            @click="$router.push('/product')"
            class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Kembali ke Beranda
        </button>
        </div>
    </div> 
</template>