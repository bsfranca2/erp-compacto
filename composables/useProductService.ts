import type { NewProductData, Product, ProductWithInventory, UpdateProductData } from '~/types/models'
import { toast } from '~/components/ui/toast'

function toProduct(data: any): Product {
  return {
    id: data.product_id,
    name: data.name,
    description: data.description,
    unit: data.unit,
    purchasePrice: data.purchase_price,
    salePrice: data.sale_price,
  }
}

function toProductWithInventory(data: any): ProductWithInventory {
  return {
    ...toProduct(data),
    inventory: data.inventory[0].quantity,
  }
}

function toProductModel(product: Product | NewProductData | UpdateProductData) {
  const model = {
    name: product.name,
    description: product.description,
    unit: product.unit,
    purchase_price: product.purchasePrice,
    sale_price: product.salePrice,
  }

  if ('id' in product) {
    return { ...model, product_id: product.id }
  }

  return model
}

export function useProductService() {
  const supabase = useSupabaseClient()

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('product_id, name, description, unit, purchase_price, sale_price')

    if (error) {
      toast({
        title: 'Erro ao carregar produtos',
        description: `Ocorreu um erro ao carregar os produtos: ${error.message}`,
      })
    }
    else {
      return data.map(toProduct)
    }
  }

  async function fetchProductsWithInventory() {
    const { data, error } = await supabase
      .from('products')
      .select('product_id, name, description, unit, purchase_price, sale_price, inventory(quantity)')

    if (error) {
      toast({
        title: 'Erro ao carregar produtos',
        description: `Ocorreu um erro ao carregar os produtos: ${error.message}`,
      })
    }
    else {
      return data.map(toProductWithInventory)
    }
  }

  async function fetchProductById(id: string | number) {
    const { data, error } = await supabase
      .from('products')
      .select('name, description, unit, purchase_price, sale_price')
      .eq('product_id', id)
      .single()

    if (error) {
      toast({
        title: 'Erro ao carregar produto',
        description: `Ocorreu um erro ao carregar o produto: ${error.message}`,
      })
    }
    else {
      return toProduct(data)
    }
  }

  async function createProduct(data: NewProductData) {
    const { data: product, error } = await supabase
      .from('products')
      .insert(toProductModel(data))
      .select()

    if (error) {
      toast({
        title: 'Erro ao criar produto',
        description: `Ocorreu um erro ao criar o produto: ${error.message}`,
      })
    }
    else {
      return toProduct(Array.isArray(product) ? product[0] : product)
    }
  }

  async function updateProduct(data: UpdateProductData) {
    const { error } = await supabase
      .from('products')
      .update(toProductModel(data))
      .eq('product_id', data.id)

    if (error) {
      toast({
        title: 'Erro ao atualizar produto',
        description: `Ocorreu um erro ao atualizar o produto: ${error.message}`,
      })
      return false
    }
    else {
      return true
    }
  }

  return {
    fetchProducts,
    fetchProductsWithInventory,
    fetchProductById,
    createProduct,
    updateProduct,
  }
}
