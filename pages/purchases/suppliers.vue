<script lang="ts" setup>
import type { SupplierFormModal } from '~/types/component-ref'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const supplierStore = useSupplierStore()
const supplierFormModal = ref<SupplierFormModal | null>(null)

function openAddDialog() {
  supplierFormModal.value?.openAddDialog()
}

function openEditDialog(id: number) {
  supplierFormModal.value?.openEditDialog(id)
}
</script>

<template>
  <div class="mt-8">
    <div class="flex justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          Fornecedores
        </h3>
        <p class="text-sm text-gray-600">
          Cadastro e Manutenção de Fornecedores
        </p>
      </div>
      <div>
        <Button @click="openAddDialog">
          <i class="i-fluent-add-24-regular h-5 w-5 mr-1.5" />Adicionar Fornecedor
        </Button>
      </div>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">
            #
          </TableHead>
          <TableHead>Nome do Fornecedor</TableHead>
          <TableHead>Informação de Contato</TableHead>
          <TableHead class="text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="supplier in supplierStore.suppliers" :key="supplier.id">
          <TableCell class="font-medium">
            {{ supplier.id }}
          </TableCell>
          <TableCell>{{ supplier.name }}</TableCell>
          <TableCell>{{ supplier.contactInfo }}</TableCell>
          <TableCell class="text-right">
            <Button variant="outline" size="sm" @click="openEditDialog(supplier.id)">
              Editar
            </Button>
            <!-- TODO: Adicione um botão para exclusão aqui, se necessário -->
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <SupplierFormModal ref="supplierFormModal" @refresh="supplierStore.fetchSuppliers" />
</template>
