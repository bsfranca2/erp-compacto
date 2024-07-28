<script setup lang="ts">
const supabase = useSupabaseClient()

const router = useRouter()

const menu = [
  {
    label: 'Resumo Diário',
    icon: 'i-fluent-home-24-regular',
    href: '/',
  },
  {
    label: 'Compras',
    icon: 'i-fluent-cart-24-regular',
    href: '/purchases',
  },
  {
    label: 'Estoque',
    icon: 'i-fluent-box-24-regular',
    href: '/inventory',
  },
  {
    label: 'Vendas',
    icon: 'i-fluent-arrow-trending-lines-24-regular',
    href: '/sales',
  },
  {
    label: 'Financeiro',
    icon: 'i-fluent-receipt-money-24-regular',
    href: '/financial',
  },
  {
    label: 'Relatórios',
    icon: 'i-fluent-chart-multiple-24-regular',
    href: '/reports',
  },
  {
    label: 'Configurações',
    icon: 'i-fluent-settings-24-regular',
    href: '/settings',
  },
]

async function logout() {
  await supabase.auth.signOut()
  await router.push('/login')
}
</script>

<template>
  <aside class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <div class="flex grow flex-col gap-y-6 overflow-y-auto px-6">
      <div class="mt-8 flex shrink-0">
        <!-- <img src="/logo.webp" class="h-8 w-auto"> -->
        <h1 class="text-black text-2xl font-bold tracking-tight">
          ERPCompacto
        </h1>
      </div>
      <nav>
        <ul class="flex flex-1 flex-col">
          <li>
            <ul class="-mx-2 space-y-1">
              <li v-for="item in menu" :key="item.href">
                <NuxtLink :to="item.href" class="menu-item" active-class="menu-item--current">
                  <i class="menu-item__icon" :class="item.icon" aria-hidden="true" />
                  {{ item.label }}
                  <i v-if="item.href === '/'" class="i-lucide-external-link ml-auto h-6 w-6 text-gray-500" aria-hidden="true" />
                </NuxtLink>
              </li>
              <li>
                <button type="button" class="menu-item w-full" @click="logout">
                  <i class="menu-item__icon i-fluent-sign-out-24-regular" aria-hidden="true" />
                  Sair
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
  <main class="pt-3 lg:pl-72 h-full">
    <div class="bg-white rounded-tl-lg border-l border-t border-gray-200 h-full">
      <slot />
    </div>
  </main>
</template>

<style>
body {
  @apply text-primary-25;
}
body {
  @apply text-md;
}
html, body, #__nuxt {
  @apply bg-gray-25;
}
html, body, #__nuxt {
  @apply h-full w-full;
}

.menu-item {
  @apply flex gap-x-3 rounded-md px-3 py-2 text-md font-semibold transition-colors;
}
.menu-item:not(.menu-item--current) {
  @apply text-gray-700 hover:bg-gray-50 hover:text-gray-800;
}
.menu-item--current {
  @apply bg-primary-50 text-primary-700;
}
.menu-item__icon {
  @apply h-6 w-6 text-gray-500;
}
.menu-item--current .menu-item__icon {
  @apply text-primary-800;
}

.page-content {
  @apply px-4 pt-8 sm:px-6 lg:px-8;
}
</style>
