import { create } from 'zustand'

export interface StaffFiltersState {
  search: string
  departmentFilter: string
  roleFilter: string
  statusFilter: string
  currentPage: number
  itemsPerPage: number
  setSearch: (value: string) => void
  setDepartmentFilter: (value: string) => void
  setRoleFilter: (value: string) => void
  setStatusFilter: (value: string) => void
  setCurrentPage: (value: number) => void
  setItemsPerPage: (value: number) => void
  resetFilters: () => void
}

export const useStaffStore = create<StaffFiltersState>((set) => ({
  search: '',
  departmentFilter: '',
  roleFilter: '',
  statusFilter: '',
  currentPage: 1,
  itemsPerPage: 10,
  setSearch: (search) => set({ search }),
  setDepartmentFilter: (departmentFilter) => set({ departmentFilter }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
  resetFilters: () => set({ search: '', departmentFilter: '', roleFilter: '', statusFilter: '', currentPage: 1 }),
}))
