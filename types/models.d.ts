export interface Supplier {
  id: number
  name: string
  contactInfo: string | null
}
export type NewSupplierData = Omit<Supplier, 'id'>
export type UpdateSupplierData = Supplier
