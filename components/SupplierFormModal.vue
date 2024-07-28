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

const supabase = useSupabaseClient()
const formId = useId()
const isOpen = ref(false)
const isEdit = ref(false)
const supplierId = ref<number | null>(null)

const schema = z.object({
  name: z.string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
    .max(50, { message: 'O nome pode ter no máximo 50 caracteres' }),
  contactInfo: z.string().optional().nullable(), // Usando camelCase para a variável
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    name: '',
    contactInfo: '',
  },
})

function openAddDialog() {
  isEdit.value = false
  resetForm()
  isOpen.value = true
}

function openEditDialog(id: number) {
  fetchSupplier(id)
  isOpen.value = true
}

async function fetchSupplier(id: number) {
  const { data, error } = await supabase
    .from('suppliers')
    .select('name, contact_info') // Usando a notação do banco de dados
    .eq('supplier_id', id)
    .single()

  if (error) {
    toast({
      title: 'Erro ao carregar fornecedor',
      description: `Ocorreu um erro: ${error.message}`,
    })
    return
  }

  supplierId.value = id
  resetForm({ values: { name: data.name, contactInfo: data.contact_info || '' } }) // Converte para camelCase
  isEdit.value = true
}

const onSubmit = handleSubmit(async (values) => {
  try {
    let error
    if (isEdit.value && supplierId.value !== null) {
      ({ error } = await supabase
        .from('suppliers')
        .update({ name: values.name, contact_info: values.contactInfo }) // Enviando como contact_info para o banco
        .eq('supplier_id', supplierId.value))
    }
    else {
      ({ error } = await supabase
        .from('suppliers')
        .insert([{ name: values.name, contact_info: values.contactInfo }])) // Enviando como contact_info para o banco
    }

    if (error) {
      throw error
    }

    toast({
      title: isEdit.value ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor adicionado com sucesso!',
      description: `Fornecedor ${values.name} foi ${isEdit.value ? 'atualizado' : 'cadastrado'} com sucesso.`,
    })
    isOpen.value = false
    emit('refresh')
  }
  catch (error) {
    toast({
      title: isEdit.value ? 'Erro ao atualizar fornecedor' : 'Erro ao adicionar fornecedor',
      description: `Ocorreu um erro: ${(error as Error).message}`,
    })
  }
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

      <form :id="formId" class="space-y-4" @submit="onSubmit">
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
        <Button variant="outline" class="w-full" @click="isOpen = false">
          Cancelar
        </Button>
        <Button type="submit" class="w-full" :form="formId">
          Salvar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
