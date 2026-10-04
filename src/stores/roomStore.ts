import { create } from 'zustand'
import type { RoomRow } from '../components/manager/rooms/demoRooms'

interface RoomStoreState {
  edits: Record<string, Partial<RoomRow>>
  added: RoomRow[]
  deleted: string[]
  save: (id: string, patch: Partial<RoomRow>) => void
  add: (room: RoomRow) => void
  remove: (id: string) => void
  reset: () => void
}

export const useRoomStore = create<RoomStoreState>((set) => ({
  edits: {},
  added: [],
  deleted: [],
  save: (id, patch) =>
    set((s) => ({ edits: { ...s.edits, [id]: { ...(s.edits[id] ?? {}), ...patch } } })),
  add: (room) => set((s) => ({ added: [room, ...s.added] })),
  remove: (id) =>
    set((s) =>
      s.added.some((r) => r.id === id)
        ? { added: s.added.filter((r) => r.id !== id) }
        : { deleted: [...s.deleted, id] },
    ),
  reset: () => set({ edits: {}, added: [], deleted: [] }),
}))

export function applyRoomEdit(room: RoomRow, edit?: Partial<RoomRow>): RoomRow {
  if (!edit) return room
  return { ...room, ...edit, id: room.id }
}

export function mergeRooms(source: RoomRow[], edits: Record<string, Partial<RoomRow>>, added: RoomRow[], deleted: string[]): RoomRow[] {
  const kept = source
    .filter((r) => !deleted.includes(r.id))
    .map((r) => applyRoomEdit(r, edits[r.id]))
  const mergedAdded = added.map((r) => applyRoomEdit(r, edits[r.id]))
  return [...kept, ...mergedAdded]
}
