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

const productService = useProductService()
const formId = useId()
const isOpen = ref(false)
const isEdit = ref(false)
const productId = ref<number | null>(null)
const isFetching = ref(false)
const isSubmitting = ref(false)

const schema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }).max(255, { message: 'O nome pode ter no máximo 255 caracteres' }),
  description: z.string().nullable(),
  unit: z.string().max(50, { message: 'A unidade pode ter no máximo 50 caracteres' }).nullable(),
  purchasePrice: z.number().min(0, { message: 'O preço de compra deve ser um número positivo' }),
  salePrice: z.number().min(0, { message: 'O preço de venda deve ser um número positivo' }),
})

const initialValues = {
  name: '',
  description: '',
  unit: '',
  purchasePrice: 0,
  salePrice: 0,
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
  isOpen.value = true
  fetchProduct(id).finally(() => {
    isFetching.value = false
  })
}

async function fetchProduct(id: number) {
  const data = await productService.fetchProductById(id)
  if (!data) {
    return
  }

  productId.value = id
  resetForm({ values: data })
  isEdit.value = true
}

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  let ok = true
  if (isEdit.value && productId.value !== null) {
    ok = await productService.updateProduct({ id: productId.value, ...values })
  }
  else {
    const productCreated = await productService.createProduct(values)
    ok = !!productCreated
  }

  isSubmitting.value = false
  if (!ok) {
    return
  }

  toast({
    title: isEdit.value ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!',
    description: `Produto ${values.name} foi ${isEdit.value ? 'atualizado' : 'cadastrado'} com sucesso.`,
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
          {{ isEdit ? 'Editar Produto' : 'Adicionar Novo Produto' }}
        </DialogTitle>
        <DialogDescription>
          Preencha as informações abaixo para {{ isEdit ? 'atualizar' : 'cadastrar' }} o produto.
        </DialogDescription>
      </DialogHeader>

      <span v-if="isFetching">Carregando...</span>
      <form v-else :id="formId" class="space-y-4" @submit="onSubmit">
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

        <FormField v-slot="{ componentField }" name="purchasePrice">
          <FormItem>
            <FormLabel>Preço de Compra</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder="Digite o preço de compra" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="salePrice">
          <FormItem>
            <FormLabel>Preço de Venda</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder="Digite o preço de venda" v-bind="componentField" />
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
