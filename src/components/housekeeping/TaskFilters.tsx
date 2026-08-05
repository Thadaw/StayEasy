import { Search, ChevronDown, Plus } from 'lucide-react'

interface TaskFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  priority: string
  onPriorityChange: (value: string) => void
  room: string
  onRoomChange: (value: string) => void
  onCreateTask: () => void
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
  minWidth: 140,
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

export default function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  room,
  onRoomChange,
  onCreateTask,
}: TaskFiltersProps) {
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
          maxWidth: 320,
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
          placeholder="Search tasks..."
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
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <div style={dropdownWrapperStyle}>
        <select
          value={priority}
          onChange={e => onPriorityChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <div style={dropdownWrapperStyle}>
        <select
          value={room}
          onChange={e => onRoomChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">Room</option>
          <option value="Room 101">Room 101</option>
          <option value="Room 102">Room 102</option>
          <option value="Room 201">Room 201</option>
          <option value="Room 205">Room 205</option>
          <option value="Room 305">Room 305</option>
          <option value="Room 108">Room 108</option>
          <option value="Room 402">Room 402</option>
          <option value="Room 401">Room 401</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <button
        onClick={onCreateTask}
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
        Create Task
      </button>
    </div>
  )
}
