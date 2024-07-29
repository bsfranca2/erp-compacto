<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { PurchaseSheet } from '@/types/component-ref'
import { toast } from '@/components/ui/toast'

const purchaseSheet = ref<PurchaseSheet | null>(null)
const purchases = ref<Array<{
  purchase_id: number
  purchase_date: string
  supplier_name: string
  total: number
  installments: number
}>>([])

const supabase = useSupabaseClient()

function openAddDialog() {
  purchaseSheet.value?.openSheet(null)
}

function openEditDialog(id: number) {
  purchaseSheet.value?.openSheet(id)
}

async function fetchPurchases() {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      purchase_id,
      purchase_date,
      suppliers(name),
      total,
      payments(installment_number)
    `)

  if (error) {
    toast({
      title: 'Erro ao carregar compras',
      description: `Ocorreu um erro ao carregar a lista de compras: ${error.message}`,
    })
  }
  else {
    purchases.value = data.map(purchase => ({
      purchase_id: purchase.purchase_id,
      purchase_date: purchase.purchase_date,
      supplier_name: purchase.suppliers.name,
      total: purchase.total,
      installments: purchase.payments.length ? purchase.payments[0].installment_number : 0,
    }))
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

onMounted(fetchPurchases)
</script>

<template>
  <div class="mt-8">
    <div class="flex justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          Compras
        </h3>
        <p class="text-sm text-gray-600">
          Visualizar e Gerenciar Todas as Compras
        </p>
      </div>
      <div>
        <Button @click="openAddDialog">
          <i class="i-fluent-add-24-regular h-5 w-5 mr-1.5" />Adicionar Compra
        </Button>
      </div>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[50px]">
            ID
          </TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Fornecedor</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Parcelas</TableHead>
          <TableHead class="text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="purchase in purchases" :key="purchase.purchase_id">
          <TableCell>{{ purchase.purchase_id }}</TableCell>
          <TableCell>{{ new Date(purchase.purchase_date).toLocaleDateString('pt-BR') }}</TableCell>
          <TableCell>{{ purchase.supplier_name }}</TableCell>
          <TableCell>{{ formatCurrency(purchase.total) }}</TableCell>
          <TableCell>{{ purchase.installments || 0 }}</TableCell>
          <TableCell class="text-right">
            <Button variant="outline" size="sm" disabled @click="openEditDialog(purchase.purchase_id)">
              Editar
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <PurchaseSheet ref="purchaseSheet" @refresh="fetchPurchases" />
</template>
