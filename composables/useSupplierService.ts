import type { Supplier } from '~/types/models'
import { toast } from '~/components/ui/toast'

export function useSupplierService() {
  const supabase = useSupabaseClient()

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
      return data.map(supplier => ({
        id: supplier.supplier_id,
        name: supplier.name,
        contactInfo: supplier.contact_info,
      }) as Supplier)
    }
  }

  return {
    fetchSuppliers,
  }
}
