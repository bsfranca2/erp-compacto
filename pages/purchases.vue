<script lang="ts" setup>
const items = [
  {
    label: 'Compras',
    route: '/purchases/list',
  },
  {
    label: 'Fornecedores',
    route: '/purchases/suppliers',
  },
]

await navigateTo('/purchases/list')
</script>

<template>
  <div class="page-content">
    <h2 class="text-2xl font-semibold mb-6">
      Compras
    </h2>
    <NavigationTabs :items="items" />
    <NuxtPage />
  </div>
</template>
