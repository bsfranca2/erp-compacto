<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'Entrar',
})

const supabase = useSupabaseClient()
const router = useRouter()

const loading = ref(false)

const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(0),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword(values)
    if (error)
      throw error
    router.push('/')
  }
  catch (error) {
    alert(error.error_description || error.message)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- <img class="mx-auto h-24 w-auto" src="/img/logo.png" alt="Logo"> -->
      <h2 class="mt-6 text-center text-display-sm font-bold leading-9 tracking-tight text-gray-900">
        Acesse sua conta
      </h2>
      <p class="mt-3 text-center text-md text-gray-600">
        Bem-vindo de volta!
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="flex justify-end w-full">
          <Button type="submit">
            Entrar
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
