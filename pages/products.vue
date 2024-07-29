<script lang="ts" setup>
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { MovementSheet, ProductFormModal } from '@/types/component-ref'

const productFormModal = ref<ProductFormModal | null>(null)
const movementSheet = ref<MovementSheet | null>(null)

const productStore = useProductStore()

function openAddDialog() {
  productFormModal.value?.openAddDialog()
}

function openEditDialog(id: number) {
  productFormModal.value?.openEditDialog(id)
}

function openMovementSheet(id: number) {
  movementSheet.value?.openSheet(id)
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

onMounted(productStore.fetchProducts)
</script>

<template>
  <div class="page-content">
    <div class="flex justify-between mb-8">
      <div>
        <h2 class="text-2xl font-semibold mb-1">
          Produtos
        </h2>
        <p class="text-md text-gray-600">
          Gerenciamento de informações de produtos e controle de estoque
        </p>
      </div>
      <div>
        <Button @click="openAddDialog">
          <i class="i-fluent-add-24-regular h-5 w-5 mr-1.5" />Adicionar Produto
        </Button>
      </div>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[50px]">
            ID
          </TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Preço de Compra</TableHead>
          <TableHead>Preço de Venda</TableHead>
          <TableHead>Estoque</TableHead>
          <TableHead class="text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="product in productStore.products" :key="product.id">
          <TableCell>{{ product.id }}</TableCell>
          <TableCell>{{ product.name }}</TableCell>
          <TableCell>{{ product.description || 'N/A' }}</TableCell>
          <TableCell>{{ product.unit || 'N/A' }}</TableCell>
          <TableCell>{{ formatCurrency(product.purchasePrice) }}</TableCell>
          <TableCell>{{ formatCurrency(product.salePrice) }}</TableCell>
          <TableCell>{{ product.inventory }}</TableCell>
          <TableCell class="text-right">
            <Button variant="outline" size="sm" @click="openMovementSheet(product.id)">
              Ver Movimentações
            </Button>
            <Button variant="outline" size="sm" @click="openEditDialog(product.id)">
              Editar
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <ProductFormModal ref="productFormModal" @refresh="productStore.fetchProducts" />
  <MovementSheet ref="movementSheet" @refresh="productStore.fetchProducts" />
</template>
