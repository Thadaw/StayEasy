import { create } from 'zustand'
import { SEED_APPROVALS, type ApprovalRequest } from '../components/manager/staff/demoApprovals'

interface ApprovalsState {
  requests: ApprovalRequest[]
  decide: (id: string) => void
  reset: () => void
}

export const useApprovalsStore = create<ApprovalsState>((set) => ({
  requests: SEED_APPROVALS,
  decide: (id) => set((s) => ({ requests: s.requests.filter((r) => r.id !== id) })),
  reset: () => set({ requests: SEED_APPROVALS }),
}))

export function selectPendingCount(state: ApprovalsState) {
  return state.requests.length
}
