import { useState, useMemo } from 'react'

interface UsePaginationProps {
  totalItems: number
  itemsPerPage: number
  initialPage?: number
}

interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  startIndex: number
  endIndex: number
}

export function usePagination({ totalItems, itemsPerPage, initialPage = 1 }: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / itemsPerPage)), [totalItems, itemsPerPage])

  const setPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const nextPage = () => setPage(currentPage + 1)
  const prevPage = () => setPage(currentPage - 1)

  // 0-indexed for use with Array.slice(start, end + 1). endIndex is clamped
  // to prevent overflow on the last page where the remainder is less than itemsPerPage.
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1)

  return {
    currentPage,
    totalPages,
    setPage,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
  }
}
