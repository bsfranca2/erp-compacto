<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const supplierService = useSupplierService()
const formId = useId()
const isOpen = ref(false)
const isEdit = ref(false)
const supplierId = ref<number | null>(null)
const isFetching = ref(false)
const isSubmitting = ref(false)

const schema = z.object({
  name: z.string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
    .max(50, { message: 'O nome pode ter no máximo 50 caracteres' }),
  contactInfo: z.string().nullable(),
})

const initialValues = {
  name: '',
  contactInfo: '',
}

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues,
})

function openAddDialog() {
  isEdit.value = false
  resetForm({ values: initialValues })
  isOpen.value = true
}

function openEditDialog(id: number) {
  isFetching.value = true
  fetchSupplier(id).finally(() => {
    isFetching.value = false
  })
  isOpen.value = true
}

async function fetchSupplier(id: number) {
  const data = await supplierService.fetchSupplierById(id)
  if (!data) {
    return
  }

  supplierId.value = id
  resetForm({ values: data })
  isEdit.value = true
}

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  let ok = true
  if (isEdit.value && supplierId.value !== null) {
    ok = await supplierService.updateSupplier({ id: supplierId.value, ...values })
  }
  else {
    const supplierCreated = await supplierService.createSupplier(values)
    ok = !!supplierCreated
  }

  isSubmitting.value = false
  if (!ok) {
    return
  }

  toast({
    title: isEdit.value ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor adicionado com sucesso!',
    description: `Fornecedor ${values.name} foi ${isEdit.value ? 'atualizado' : 'cadastrado'} com sucesso.`,
  })
  isOpen.value = false
  emit('refresh')
})

defineExpose({ openAddDialog, openEditDialog })
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader class="gap-y-1">
        <DialogTitle>
          {{ isEdit ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor' }}
        </DialogTitle>
        <DialogDescription>
          Preencha as informações abaixo para {{ isEdit ? 'atualizar' : 'cadastrar' }} o fornecedor.
        </DialogDescription>
      </DialogHeader>

      <span v-if="isFetching">Carregando...</span>
      <form v-else :id="formId" class="space-y-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Nome do Fornecedor</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Digite o nome do fornecedor" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="contactInfo">
          <FormItem>
            <FormLabel>Informações de Contato</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Digite as informações de contato" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>

      <DialogFooter>
        <Button variant="outline" class="w-full" :disabled="isSubmitting" @click="isOpen = false">
          Cancelar
        </Button>
        <Button type="submit" class="w-full" :form="formId" :disabled="isSubmitting">
          <i v-show="isSubmitting" class="i-fluent-spinner-ios-20-regular w-4 h-4 mr-2 animate-spin" />
          Salvar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
