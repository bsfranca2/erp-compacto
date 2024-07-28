export interface SupplierFormModal {
  openAddDialog: () => void
  openEditDialog: (id: number) => void
}

export interface ProductFormModal {
  openAddDialog: () => void
  openEditDialog: (id: number) => void
}

export interface MovementSheet {
  openSheet: (id: number) => void
}
