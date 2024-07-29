import type { ProductWithInventory } from '~/types/models'

export const useProductStore = defineStore('product', () => {
  const productService = useProductService()
  const products = ref<ProductWithInventory[]>([])

  async function fetchProducts() {
    const result = await productService.fetchProductsWithInventory()
    if (result) {
      products.value = result
    }
  }

  return {
    products,
    fetchProducts,
  }
})
