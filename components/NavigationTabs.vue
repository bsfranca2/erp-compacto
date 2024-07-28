<script lang="ts" setup>
import { cn } from '~/lib/utils'

interface NavigationItem {
  label: string
  route: string
}

defineProps<{
  items: NavigationItem[]
}>()
</script>

<template>
  <div class="border-b border-gray-200">
    <nav class="flex gap-x-3">
      <template v-for="item in items" :key="item.route">
        <NuxtLink
          :to="item.route"
          :class="cn(
            'font-semibold pb-3 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-primary-700 focus:outline-none focus:text-primary-700 disabled:opacity-50 disabled:pointer-events-none',
            { 'border-primary-600 text-primary-700': $route.path.includes(item.route) },
          )"
        >
          {{ item.label }}
        </NuxtLink>
      </template>
    </nav>
  </div>
</template>
