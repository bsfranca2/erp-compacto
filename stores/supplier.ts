import type { Supplier } from '~/types/models'

export const useSupplierStore = defineStore('supplier', () => {
  const supplierService = useSupplierService()
  const suppliers = ref<Supplier[]>([])

  async function fetchSuppliers() {
    const result = await supplierService.fetchSuppliers()
    if (result) {
      suppliers.value = result
    }
  }

  return {
    suppliers,
    fetchSuppliers,
  }
})
