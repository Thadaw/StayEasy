import { Search, ChevronDown, Filter, Plus } from 'lucide-react'

interface PropertyFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  city: string
  onCityChange: (value: string) => void
  propertyType: string
  onPropertyTypeChange: (value: string) => void
  onAddProperty: () => void
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
  minWidth: 160,
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

export default function PropertyFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  city,
  onCityChange,
  propertyType,
  onPropertyTypeChange,
  onAddProperty,
}: PropertyFiltersProps) {
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
          flex: '1 1 280px',
          maxWidth: 400,
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
          placeholder="Search by property name or location..."
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
          value={status}
          onChange={e => onStatusChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <div style={dropdownWrapperStyle}>
        <select
          value={city}
          onChange={e => onCityChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Cities</option>
          <option value="Kathmandu">Kathmandu</option>
          <option value="Pokhara">Pokhara</option>
          <option value="Chitwan">Chitwan</option>
          <option value="Lalitpur">Lalitpur</option>
          <option value="Bardia">Bardia</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <div style={dropdownWrapperStyle}>
        <select
          value={propertyType}
          onChange={e => onPropertyTypeChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Property Types</option>
          <option value="Hotel">Hotel</option>
          <option value="Resort">Resort</option>
          <option value="Lodge">Lodge</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
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
        onClick={onAddProperty}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 20px',
          border: 'none',
          borderRadius: 8,
          background: 'var(--primary)',
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
          cursor: 'pointer',
          marginLeft: 'auto',
        }}
      >
        <Plus size={18} />
        Add Property
      </button>
    </div>
  )
}
