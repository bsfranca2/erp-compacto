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
import { toast } from '@/components/ui/toast'

const supplierFormModal = ref<SupplierFormModal | null>(null)
const suppliers = ref<Array<{ id: number, name: string, contactInfo: string | null }>>([])

const supabase = useSupabaseClient()

function openAddDialog() {
  supplierFormModal.value?.openAddDialog()
}

function openEditDialog(id: number) {
  supplierFormModal.value?.openEditDialog(id)
}

async function fetchSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('supplier_id, name, contact_info')

  if (error) {
    toast({
      title: 'Erro ao carregar fornecedores',
      description: `Ocorreu um erro ao carregar a lista de fornecedores: ${error.message}`,
    })
  }
  else {
    suppliers.value = data.map(supplier => ({
      id: supplier.supplier_id,
      name: supplier.name,
      contactInfo: supplier.contact_info,
    }))
  }
}

onMounted(fetchSuppliers)
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
        <Button variant="outline" @click="openAddDialog">
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
        <TableRow v-for="supplier in suppliers" :key="supplier.id">
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
  <SupplierFormModal ref="supplierFormModal" @refresh="fetchSuppliers" />
</template>
