import { Search, ChevronDown, Filter, Plus, Calendar } from 'lucide-react'

interface HousekeepingFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  floor: string
  onFloorChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  roomType: string
  onRoomTypeChange: (value: string) => void
  date: string
  onDateChange: (value: string) => void
  onAddTask: () => void
}

const selectStyle: React.CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '10px 36px 10px 14px',
  fontSize: 14,
  color: '#374151',
  fontWeight: 500,
  cursor: 'pointer',
  outline: 'none',
  backgroundImage: 'none',
  minWidth: 150,
}

const dropdownWrapperStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
}

const dropdownIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: 12,
  pointerEvents: 'none',
  color: '#9CA3AF',
}

export default function HousekeepingFilters({
  search,
  onSearchChange,
  floor,
  onFloorChange,
  status,
  onStatusChange,
  roomType,
  onRoomTypeChange,
  date,
  onDateChange,
  onAddTask,
}: HousekeepingFiltersProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          position: 'relative',
          flex: '1 1 260px',
          maxWidth: 360,
        }}
      >
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9CA3AF',
          }}
        />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by room number or type..."
          style={{
            width: '100%',
            padding: '10px 14px 10px 42px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            fontSize: 14,
            color: '#374151',
            outline: 'none',
            background: '#fff',
          }}
        />
      </div>

      <div style={dropdownWrapperStyle}>
        <select
          value={floor}
          onChange={e => onFloorChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Floors</option>
          <option value="1st Floor">1st Floor</option>
          <option value="2nd Floor">2nd Floor</option>
          <option value="3rd Floor">3rd Floor</option>
          <option value="4th Floor">4th Floor</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <div style={dropdownWrapperStyle}>
        <select
          value={status}
          onChange={e => onStatusChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Status</option>
          <option value="Clean">Clean</option>
          <option value="Dirty">Dirty</option>
          <option value="In Progress">In Progress</option>
          <option value="Out of Service">Out of Service</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <div style={dropdownWrapperStyle}>
        <select
          value={roomType}
          onChange={e => onRoomTypeChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Room Types</option>
          <option value="Deluxe Room">Deluxe Room</option>
          <option value="Suite Room">Suite Room</option>
          <option value="Standard Room">Standard Room</option>
          <option value="Family Room">Family Room</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <input
          type="date"
          value={date}
          onChange={e => onDateChange(e.target.value)}
          style={{
            padding: '10px 14px 10px 36px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            fontSize: 14,
            color: '#374151',
            outline: 'none',
            background: '#fff',
            minWidth: 160,
          }}
        />
        <Calendar
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            pointerEvents: 'none',
            color: '#9CA3AF',
          }}
        />
      </div>

      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          background: '#fff',
          fontSize: 14,
          fontWeight: 500,
          color: '#374151',
          cursor: 'pointer',
        }}
      >
        <Filter size={16} />
        More Filters
      </button>

      <button
        onClick={onAddTask}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 20px',
          border: 'none',
          borderRadius: 8,
          background: '#7C3AED',
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
          cursor: 'pointer',
          marginLeft: 'auto',
        }}
      >
        <Plus size={18} />
        Add Task
      </button>
    </div>
  )
}
