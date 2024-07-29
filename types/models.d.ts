export interface Supplier {
  id: number
  name: string
  contactInfo: string | null
}
export type NewSupplierData = Omit<Supplier, 'id'>
export type UpdateSupplierData = Supplier

export interface Product {
  id: number
  name: string
  description: string | null
  unit: string | null
  purchasePrice: number
  salePrice: number
}
export type NewProductData = Omit<Product, 'id'>
export type UpdateProductData = Product
export interface ProductWithInventory extends Product {
  inventory: number
}
