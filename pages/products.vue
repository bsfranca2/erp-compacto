<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { ProductFormModal } from '@/types/component-ref'
import { toast } from '@/components/ui/toast'

const productFormModal = ref<ProductFormModal | null>(null)
const products = ref<Array<{ product_id: number, name: string, description: string | null, unit: string, purchase_price: number, sale_price: number }>>([])

const supabase = useSupabaseClient()

function openAddDialog() {
  productFormModal.value?.openAddDialog()
}

function openEditDialog(id: number) {
  productFormModal.value?.openEditDialog(id)
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('product_id, name, description, unit, purchase_price, sale_price')

  if (error) {
    toast({
      title: 'Erro ao carregar produtos',
      description: `Ocorreu um erro ao carregar a lista de produtos: ${error.message}`,
    })
  }
  else {
    products.value = data.map(product => ({
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      unit: product.unit,
      purchase_price: product.purchase_price,
      sale_price: product.sale_price,
    }))
  }
}

onMounted(fetchProducts)
</script>

<template>
  <div class="page-content">
    <div class="flex justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          Produtos
        </h3>
        <p class="text-sm text-gray-600">
          Gerenciamento de informações de produtos e controle de estoque
        </p>
      </div>
      <div>
        <Button variant="outline" @click="openAddDialog">
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
          <TableHead class="text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="product in products" :key="product.product_id">
          <TableCell>{{ product.product_id }}</TableCell>
          <TableCell>{{ product.name }}</TableCell>
          <TableCell>{{ product.description || 'N/A' }}</TableCell>
          <TableCell>{{ product.unit || 'N/A' }}</TableCell>
          <TableCell>{{ product.purchase_price | currency }}</TableCell>
          <TableCell>{{ product.sale_price | currency }}</TableCell>
          <TableCell class="text-right">
            <Button variant="outline" size="sm" @click="openEditDialog(product.product_id)">
              Editar
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <ProductFormModal ref="productFormModal" @refresh="fetchProducts" />
</template>
