<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormControl, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { toast } from '@/components/ui/toast'

const isOpen = ref(false)
const productId = ref<number | null>(null)
const productName = ref<string>('')
const movements = ref<Array<{ movementId: number, quantity: number, movementType: string, justification: string, movementDate: string }>>([])

const supabase = useSupabaseClient()

const schema = z.object({
  quantity: z.number().min(1, 'Quantidade deve ser positiva'),
  movementType: z.enum(['entry', 'exit']),
  justification: z.string().optional(),
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    quantity: 1,
    movementType: 'entry',
    justification: '',
  },
})

function openSheet(id: number) {
  productId.value = id
  fetchProductAndMovements(id)
  isOpen.value = true
}

async function fetchProductAndMovements(id: number) {
  try {
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('name')
      .eq('product_id', id)
      .single()

    if (productError)
      throw productError
    productName.value = productData.name

    const { data: movementsData, error: movementsError } = await supabase
      .from('inventory_movements')
      .select('movement_id, quantity, movement_type, justification, movement_date')
      .eq('product_id', id)
      .order('movement_date', { ascending: false })

    if (movementsError)
      throw movementsError

    movements.value = movementsData.map(movement => ({
      movementId: movement.movement_id,
      quantity: movement.quantity,
      movementType: movement.movement_type,
      justification: movement.justification,
      movementDate: movement.movement_date,
    }))
  }
  catch (error) {
    toast({
      title: 'Erro ao carregar dados',
      description: `Ocorreu um erro ao carregar os dados: ${error.message}`,
    })
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const { error } = await supabase
      .from('inventory_movements')
      .insert([{
        product_id: productId.value,
        quantity: values.movementType === 'entry' ? values.quantity : -values.quantity,
        movement_type: values.movementType,
        justification: values.justification,
      }])

    if (error) {
      throw error
    }

    toast({
      title: 'Movimentação registrada com sucesso!',
      description: 'A movimentação foi adicionada ao estoque.',
    })
    resetForm()
    fetchProductAndMovements(productId.value!)
  }
  catch (error) {
    toast({
      title: 'Erro ao registrar movimentação',
      description: `Ocorreu um erro: ${(error as Error).message}`,
    })
  }
})

defineExpose({ openSheet })
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetContent class="flex flex-col h-full sm:max-w-none w-[400px] sm:w-[540px]">
      <SheetHeader>
        <h3 class="text-xl font-semibold truncate">
          {{ ['Movimentações de Estoque', productName].join(' - ') }}
        </h3>
      </SheetHeader>

      <div>
        <table class="mt-4 w-full">
          <thead>
            <tr>
              <th class="text-left">
                Data
              </th>
              <th class="text-left">
                Tipo
              </th>
              <th class="text-left">
                Quantidade
              </th>
              <th class="text-left">
                Justificativa
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in movements" :key="movement.movementId">
              <td>{{ new Date(movement.movementDate).toLocaleString('pt-br') }}</td>
              <td>{{ movement.movementType === 'entry' ? 'Entrada' : 'Saída' }}</td>
              <td> {{ movement.quantity }}</td>
              <td class="truncate">
                {{ movement.justification || 'N/A' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <form class="mt-auto space-y-3" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="quantity">
          <FormItem>
            <FormLabel>Quantidade</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" type="radio" name="movementType">
          <FormItem class="space-y-3">
            <FormLabel>Tipo de Movimentação</FormLabel>

            <FormControl>
              <RadioGroup
                class="flex flex-col space-y-1"
                v-bind="componentField"
              >
                <FormItem class="flex items-center space-y-0 gap-x-3">
                  <FormControl>
                    <RadioGroupItem value="entry" />
                  </FormControl>
                  <FormLabel class="font-normal">
                    Entrada
                  </FormLabel>
                </FormItem>
                <FormItem class="flex items-center space-y-0 gap-x-3">
                  <FormControl>
                    <RadioGroupItem value="exit" />
                  </FormControl>
                  <FormLabel class="font-normal">
                    Saída
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="justification">
          <FormItem>
            <FormLabel>Justificativa</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Opcional" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-end w-full">
          <Button type="submit" class="mt-3">
            Registrar Movimentação
          </Button>
        </div>
      </form>
    </SheetContent>
  </Sheet>
</template>
