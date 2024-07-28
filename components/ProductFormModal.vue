<script setup lang="ts">
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
const productId = ref<number | null>(null)

const schema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }).max(255, { message: 'O nome pode ter no máximo 255 caracteres' }),
  description: z.string().optional().nullable(),
  unit: z.string().max(50, { message: 'A unidade pode ter no máximo 50 caracteres' }).optional().nullable(),
  purchase_price: z.number().min(0, { message: 'O preço de compra deve ser um número positivo' }),
  sale_price: z.number().min(0, { message: 'O preço de venda deve ser um número positivo' }),
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    name: '',
    description: '',
    unit: '',
    purchase_price: 0,
    sale_price: 0,
  },
})

function openAddDialog() {
  isEdit.value = false
  resetForm()
  isOpen.value = true
}

function openEditDialog(id: number) {
  fetchProduct(id)
  isOpen.value = true
}

async function fetchProduct(id: number) {
  const { data, error } = await supabase
    .from('products')
    .select('name, description, unit, purchase_price, sale_price')
    .eq('product_id', id)
    .single()

  if (error) {
    toast({
      title: 'Erro ao carregar produto',
      description: `Ocorreu um erro: ${error.message}`,
    })
    return
  }

  productId.value = id
  resetForm({
    values: {
      name: data.name,
      description: data.description,
      unit: data.unit,
      purchase_price: data.purchase_price,
      sale_price: data.sale_price,
    },
  })
  isEdit.value = true
}

const onSubmit = handleSubmit(async (values) => {
  try {
    let error
    if (isEdit.value && productId.value !== null) {
      ({ error } = await supabase
        .from('products')
        .update({
          name: values.name,
          description: values.description,
          unit: values.unit,
          purchase_price: values.purchase_price,
          sale_price: values.sale_price,
        })
        .eq('product_id', productId.value))
    }
    else {
      ({ error } = await supabase
        .from('products')
        .insert([{
          name: values.name,
          description: values.description,
          unit: values.unit,
          purchase_price: values.purchase_price,
          sale_price: values.sale_price,
        }]))
    }

    if (error) {
      throw error
    }

    toast({
      title: isEdit.value ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!',
      description: `Produto ${values.name} foi ${isEdit.value ? 'atualizado' : 'cadastrado'} com sucesso.`,
    })
    isOpen.value = false
    emit('refresh')
  }
  catch (error) {
    toast({
      title: isEdit.value ? 'Erro ao atualizar produto' : 'Erro ao adicionar produto',
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
          {{ isEdit ? 'Editar Produto' : 'Adicionar Novo Produto' }}
        </DialogTitle>
        <DialogDescription>
          Preencha as informações abaixo para {{ isEdit ? 'atualizar' : 'cadastrar' }} o produto.
        </DialogDescription>
      </DialogHeader>

      <form :id="formId" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Nome do Produto</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Digite o nome do produto" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Digite uma descrição para o produto" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="unit">
          <FormItem>
            <FormLabel>Unidade de Medida</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Ex.: kg, l, unidade" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="purchase_price">
          <FormItem>
            <FormLabel>Preço de Compra</FormLabel>
            <FormControl>
              <!-- TODO: InputNumber -->
              <Input type="number" placeholder="Digite o preço de compra" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="sale_price">
          <FormItem>
            <FormLabel>Preço de Venda</FormLabel>
            <FormControl>
              <!-- TODO: InputNumber -->
              <Input type="number" placeholder="Digite o preço de venda" v-bind="componentField" />
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
