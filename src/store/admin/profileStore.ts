import { create } from 'zustand'

interface ProfileState {
  activeTab: string
  showCurrentPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
  showAvatarMenu: boolean
  isEditing: boolean
  setActiveTab: (activeTab: string) => void
  toggleCurrentPassword: () => void
  toggleNewPassword: () => void
  toggleConfirmPassword: () => void
  setShowAvatarMenu: (showAvatarMenu: boolean) => void
  setIsEditing: (isEditing: boolean) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  activeTab: 'profile',
  showCurrentPassword: false,
  showNewPassword: false,
  showConfirmPassword: false,
  showAvatarMenu: false,
  isEditing: false,
  setActiveTab: (activeTab) => set({ activeTab }),
  toggleCurrentPassword: () => set((state) => ({ showCurrentPassword: !state.showCurrentPassword })),
  toggleNewPassword: () => set((state) => ({ showNewPassword: !state.showNewPassword })),
  toggleConfirmPassword: () => set((state) => ({ showConfirmPassword: !state.showConfirmPassword })),
  setShowAvatarMenu: (showAvatarMenu) => set({ showAvatarMenu }),
  setIsEditing: (isEditing) => set({ isEditing }),
}))
