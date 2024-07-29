<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'

useHead({
  title: 'ERPCompacto',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>
