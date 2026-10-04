import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import ManagerLayout from '../../components/manager/ManagerLayout'
import ManagerGuestStats from '../../components/manager/guests/ManagerGuestStats'
import ManagerGuestFilters from '../../components/manager/guests/ManagerGuestFilters'
import ManagerGuestTable from '../../components/manager/guests/ManagerGuestTable'
import AddGuestModal, { type NewGuestInput } from '../../components/manager/guests/AddGuestModal'
import type { GuestAction } from '../../components/manager/guests/GuestActionsMenu'
import { DEMO_GUESTS, type GuestRow } from '../../components/manager/guests/demoGuests'

const AVATAR_COLORS = ['#2e86ab', '#1a3c5e', '#27ae60', '#f39c12', '#8e44ad', '#e74c3c', '#16a085']

export default function ManagerGuestsPage() {
  const [guests, setGuests] = useState<GuestRow[]>(DEMO_GUESTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Guest Types')
  const [nationalityFilter, setNationalityFilter] = useState('All Nationalities')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredGuests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return guests.filter((guest) => {
      const matchSearch =
        !query ||
        guest.name.toLowerCase().includes(query) ||
        guest.email.toLowerCase().includes(query) ||
        guest.phone.toLowerCase().includes(query) ||
        guest.guestCode.toLowerCase().includes(query)

      const matchType = typeFilter === 'All Guest Types' || guest.type === typeFilter
      const matchNationality =
        nationalityFilter === 'All Nationalities' || guest.nationality === nationalityFilter
      const matchStatus = statusFilter === 'All Status' || guest.status === statusFilter

      return matchSearch && matchType && matchNationality && matchStatus
    })
  }, [guests, searchQuery, typeFilter, nationalityFilter, statusFilter])

  const handleAddGuest = (values: NewGuestInput) => {
    const nextCode = Math.max(...guests.map((g) => guestCodeNumber(g.guestCode)), 1030) + 1

    const newGuest: GuestRow = {
      id: `g-${Date.now()}`,
      guestCode: `G-${nextCode}`,
      name: values.name,
      avatarColor: AVATAR_COLORS[guests.length % AVATAR_COLORS.length],
      phone: values.phone,
      email: values.email,
      stayPrimary: 'No stays yet',
      staySecondary: 'New guest',
      staying: false,
      totalStays: 0,
      type: values.guestType,
      loyaltyTier: 'Bronze',
      loyaltyPoints: 0,
      status: 'Active',
      rating: 0,
      nationality: values.nationality,
    }

    setGuests((prev) => [newGuest, ...prev])
    setShowAddModal(false)
    toast.success(`${values.name} added successfully`)
  }

  const handleAction = (guest: GuestRow, action: GuestAction) => {
    if (action === 'profile') toast(`${guest.name} · guest profile coming soon`)
    else if (action === 'stayHistory') toast(`Stay history for ${guest.name} coming soon`)
    else toast(`Bookings for ${guest.name} coming soon`)
  }

  return (
    <ManagerLayout
      title="Guest Management"
      subtitle="Manage guest profiles and stay history."
      searchPlaceholder="Search guests, email, phone..."
    >
      <ManagerGuestStats />

      <ManagerGuestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        nationalityFilter={nationalityFilter}
        onNationalityChange={setNationalityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onAddGuest={() => setShowAddModal(true)}
      />

      <ManagerGuestTable guests={filteredGuests} onAction={handleAction} />

      {showAddModal && (
        <AddGuestModal onClose={() => setShowAddModal(false)} onSave={handleAddGuest} />
      )}
    </ManagerLayout>
  )
}

function guestCodeNumber(code: string) {
  return Number(code.replace(/^G-/, ''))
}
