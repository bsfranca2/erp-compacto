import type { NewSupplierData, Supplier, UpdateSupplierData } from '~/types/models'
import { toast } from '~/components/ui/toast'

function toSupplier(data: any): Supplier {
  return {
    id: data.supplier_id,
    name: data.name,
    contactInfo: data.contact_info,
  }
}

function toSupplierModel(supplier: Supplier | NewSupplierData | UpdateSupplierData) {
  const model = {
    name: supplier.name,
    contact_info: supplier.contactInfo,
  }

  if ('id' in supplier) {
    return { ...model, supplier_id: supplier.id }
  }

  return model
}

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
      return data.map(toSupplier)
    }
  }

  async function fetchSupplierById(id: string | number) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('supplier_id, name, contact_info')
      .eq('supplier_id', id)
      .single()

    if (error) {
      toast({
        title: 'Erro ao carregar fornecedor',
        description: `Ocorreu um erro ao carregar o fornecedor: ${error.message}`,
      })
    }
    else {
      return toSupplier(data)
    }
  }

  async function createSupplier(supplier: NewSupplierData) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert(toSupplierModel(supplier))
      .select()

    if (error) {
      toast({
        title: 'Erro ao criar fornecedor',
        description: `Ocorreu um erro ao criar o fornecedor: ${error.message}`,
      })
    }
    else {
      return toSupplier(Array.isArray(data) ? data[0] : data)
    }
  }

  async function updateSupplier(supplier: UpdateSupplierData) {
    const { error } = await supabase
      .from('suppliers')
      .update(toSupplierModel(supplier))
      .eq('supplier_id', supplier.id)

    if (error) {
      toast({
        title: 'Erro ao atualizar fornecedor',
        description: `Ocorreu um erro ao atualizar o fornecedor: ${error.message}`,
      })
      return false
    }
    else {
      return true
    }
  }

  return {
    fetchSuppliers,
    fetchSupplierById,
    createSupplier,
    updateSupplier,
  }
}
