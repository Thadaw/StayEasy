import { useState, useRef, useCallback } from 'react'
import { useAuth } from '../../../context/AuthContext'

export function useUserProfile() {
  const { user } = useAuth()

  const firstName = user?.firstName || ''
  const lastName = user?.lastName || ''
  const initials = (firstName[0] || '') + (lastName[0] || '')
  const displayInitials = initials.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  const photoKey = user?.id ? `photo_${user.id}` : 'photo_guest'
  const [photoUrl, setPhotoUrl] = useState<string>(() => localStorage.getItem(photoKey) || '')
  const [showPhotoMenu, setShowPhotoMenu] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const data = reader.result as string
      localStorage.setItem(photoKey, data)
      setPhotoUrl(data)
      setShowPhotoMenu(false)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [photoKey])

  const removePhoto = useCallback(() => {
    localStorage.removeItem(photoKey)
    setPhotoUrl('')
    setShowPhotoMenu(false)
  }, [photoKey])

  return {
    firstName,
    lastName,
    displayInitials,
    photoUrl,
    setPhotoUrl,
    showPhotoMenu,
    setShowPhotoMenu,
    handlePhotoSelected,
    removePhoto,
    fileInputRef,
    cameraInputRef,
  }
}
