<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { FieldArray, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toDate } from 'radix-vue/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from '@/components/ui/toast'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const isOpen = ref(false)
const purchaseId = ref<number | null>(null)
const suppliers = ref<Array<{ supplier_id: number, name: string }>>([])
const products = ref<Array<{ product_id: number, name: string, purchase_price: string }>>([])
const pending = ref(false)

const supabase = useSupabaseClient()

const df = new DateFormatter('pt-BR', {
  dateStyle: 'long',
})

const schema = z.object({
  purchaseDate: z.string().transform((dateString) => {
    const calendarDate = parseDate(dateString)
    return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day)
  }),
  supplierId: z.coerce.number().int().min(1, 'Selecione um fornecedor válido'),
  purchaseItems: z.array(z.object({
    productId: z.coerce.number().int().min(1, 'ID do produto inválido'),
    quantity: z.coerce.number().int().min(1, 'A quantidade deve ser pelo menos 1'),
    unitPrice: z.coerce.number().min(0, 'O preço unitário deve ser maior ou igual a 0'),
  })).min(1, 'Adicione pelo menos um item à compra'),
  installments: z.number().int().min(1, 'O número de parcelas deve ser pelo menos 1'),
})

const { handleSubmit, resetForm, values, setFieldValue } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    purchaseDate: formatDateToYYYYMMDD(new Date()),
    supplierId: undefined,
    purchaseItems: [],
    installments: 1,
  },
})

const placeholder = ref()

const value = computed({
  get: () => values.purchaseDate ? parseDate(values.purchaseDate) : undefined,
  set: val => val,
})

function formatDateToYYYYMMDD(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('product_id, name, purchase_price')

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
      purchase_price: product.purchase_price,
    }))
  }
}

function openSheet(id: number | null) {
  purchaseId.value = id
  if (id) {
    fetchPurchase(id)
  }
  else {
    resetForm()
  }
  isOpen.value = true
}

async function fetchSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('supplier_id, name')

  if (error) {
    toast({
      title: 'Erro ao carregar fornecedores',
      description: `Ocorreu um erro ao carregar os fornecedores: ${error.message}`,
    })
  }
  else {
    suppliers.value = data
  }
}

async function fetchPurchase(id: number) {
  const { data, error } = await supabase
    .from('purchases')
    .select('purchase_date, supplier_id, total')
    .eq('purchase_id', id)
    .single()

  if (error) {
    toast({
      title: 'Erro ao carregar compra',
      description: `Ocorreu um erro ao carregar a compra: ${error.message}`,
    })
  }
  else {
    resetForm({
      purchaseDate: data.purchase_date,
      supplierId: data.supplier_id,
      total: data.total,
    })
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    pending.value = true
    let error
    let purchaseIdValue

    // Calcular o total da compra com base nos itens
    const calculatedTotal = values.purchaseItems.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice)
    }, 0)

    if (purchaseId.value) {
      // Atualizar a compra existente
      ({ error } = await supabase
        .from('purchases')
        .update({
          purchase_date: values.purchaseDate,
          supplier_id: values.supplierId,
          total: calculatedTotal, // Usa o total calculado
        })
        .eq('purchase_id', purchaseId.value))
      purchaseIdValue = purchaseId.value
    }
    else {
      // Criar uma nova compra
      const { data, error: insertError } = await supabase
        .from('purchases')
        .insert([{
          purchase_date: values.purchaseDate,
          supplier_id: values.supplierId,
          total: calculatedTotal, // Usa o total calculado
        }])
        .select('purchase_id')
      if (insertError)
        throw insertError
      purchaseIdValue = data[0].purchase_id
    }

    if (error)
      throw error

    // Inserir itens da compra
    for (const item of values.purchaseItems) {
      await supabase.from('purchase_items').insert({
        purchase_id: purchaseIdValue,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })
    }

    // Inserir pagamento
    await supabase.from('payments').insert({
      purchase_id: purchaseIdValue,
      payment_date: new Date(), // Ajuste para a data de pagamento real, se disponível
      amount_paid: 0, // Usa o total calculado
      installment_number: values.installments, // Número de parcelas
    })

    toast({
      title: 'Compra registrada com sucesso!',
      description: 'Os detalhes da compra foram salvos.',
    })
    isOpen.value = false
    resetForm()
  }
  catch (error) {
    toast({
      title: 'Erro ao registrar compra',
      description: `Ocorreu um erro: ${error.message}`,
    })
  }
  finally {
    pending.value = false
    emit('refresh')
  }
})

onMounted(() => {
  fetchSuppliers()
  fetchProducts()
})

defineExpose({ openSheet })
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetContent class="flex flex-col h-full sm:max-w-none w-[400px] sm:w-[540px] overflow-auto">
      <SheetHeader>
        <SheetTitle>
          <h3 class="text-xl font-semibold">
            {{ purchaseId ? 'Editar Compra' : 'Adicionar Nova Compra' }}
          </h3>
        </SheetTitle>
        <SheetDescription>
          {{ purchaseId ? 'Atualize os detalhes da compra selecionada.' : 'Preencha os detalhes abaixo para registrar uma nova compra.' }}
        </SheetDescription>
      </SheetHeader>

      <form class="space-y-3 mt-4" @submit="onSubmit">
        <FormField name="purchaseDate">
          <FormItem class="flex flex-col">
            <FormLabel>Data da Compra</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <FormControl>
                  <Button
                    variant="outline" :class="cn(
                      'w-[240px] ps-3 text-start font-normal',
                      !value && 'text-muted-foreground',
                    )"
                  >
                    <span>{{ value ? df.format(toDate(value)) : "Pick a date" }}</span>
                    <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                  </Button>
                  <input hidden>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar
                  v-model:placeholder="placeholder"
                  v-model="value"
                  calendar-label="Date of birth"
                  initial-focus
                  :min-value="new CalendarDate(1900, 1, 1)"
                  :max-value="today(getLocalTimeZone())"
                  @update:model-value="(v) => {
                    if (v) {
                      setFieldValue('purchaseDate', v.toString())
                    }
                    else {
                      setFieldValue('purchaseDate', undefined)
                    }
                  }"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="supplierId">
          <FormItem>
            <FormLabel>Fornecedor</FormLabel>

            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="supplier in suppliers" :key="supplier.supplier_id" :value="supplier.supplier_id.toString()">
                    {{ supplier.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="purchaseItems">
          <FieldArray v-slot="{ fields, push, remove }" name="purchaseItems">
            <div v-for="(field, index) in fields" :key="field.key">
              <FormItem>
                <FormLabel>Item {{ index + 1 }}</FormLabel>
                <FormControl>
                  <FormField v-slot="{ componentField }" :name="`purchaseItems[${index}].productId`">
                    <FormItem>
                      <FormLabel>Produto</FormLabel>

                      <Select v-bind="componentField">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um produto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="product in products" :key="product.product_id" :value="product.product_id.toString()">
                              {{ product.name }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" :name="`purchaseItems[${index}].quantity`">
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Digite a quantidade" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" :name="`purchaseItems[${index}].unitPrice`">
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o valor unitário" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </FormControl>
                <Button @click.prevent="remove(index)">
                  Remover
                </Button>
              </FormItem>
            </div>
            <Button @click.prevent="push({ productId: undefined, quantity: 1, unitPrice: 0 })">
              Adicionar Item
            </Button>
          </FieldArray>
          <FormMessage />
        </FormField>

        <hr>

        <FormField v-slot="{ componentField }" name="installments">
          <FormItem>
            <FormLabel>Parcelas</FormLabel>
            <FormControl>
              <Input type="number" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-between items-center w-full">
          <div class="font-semibold">
            Total: R$ {{ values.purchaseItems?.reduce((total, item) => total + (item.quantity * item.unitPrice), 0).toFixed(2) }}
          </div>
          <Button type="submit" class="mt-3" :disabled="pending">
            <i v-show="pending" class="i-fluent-spinner-ios-20-regular w-4 h-4 mr-2 animate-spin" />
            {{ purchaseId ? 'Salvar Alterações' : 'Registrar Compra' }}
          </Button>
        </div>
      </form>
    </SheetContent>
  </Sheet>
</template>
