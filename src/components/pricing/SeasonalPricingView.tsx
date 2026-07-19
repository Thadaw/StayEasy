import { useState, useMemo } from 'react'
import SeasonTimeline from './SeasonTimeline'
import SeasonalPricingFilters from './SeasonalPricingFilters'
import SeasonalPricingDataTable from './SeasonalPricingDataTable'
import type { SeasonTimeline as SeasonTimelineType, SeasonalPricingEntry } from '../../types/pricing'

interface SeasonalPricingViewProps {
  timelineSeasons: SeasonTimelineType[]
  entries: SeasonalPricingEntry[]
}

export default function SeasonalPricingView({ timelineSeasons, entries }: SeasonalPricingViewProps) {
  const [search, setSearch] = useState('')
  const [roomType, setRoomType] = useState('')
  const [status, setStatus] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchSearch = !search || entry.seasonName.toLowerCase().includes(search.toLowerCase()) || entry.roomType.toLowerCase().includes(search.toLowerCase())
      const matchRoomType = !roomType || roomType === 'All' || entry.roomType === roomType
      const matchStatus = !status || status === 'All' || entry.status === status
      return matchSearch && matchRoomType && matchStatus
    })
  }, [entries, search, roomType, status])

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage)
  const paginatedEntries = filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div>
      <SeasonalPricingFilters
        search={search}
        onSearchChange={setSearch}
        roomType={roomType}
        onRoomTypeChange={setRoomType}
        status={status}
        onStatusChange={setStatus}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={() => {}}
      />

      <SeasonTimeline seasons={timelineSeasons} />

      <SeasonalPricingDataTable
        entries={paginatedEntries}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredEntries.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
