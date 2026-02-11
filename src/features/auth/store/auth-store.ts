import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthType = {
  accessToken: string | null
  role: string | null
  accountId: string | null
  staffId: string | null
  setAccessToken: (accessToken: string, accountId: string, staffId: string, role: string) => void
  removeAuthInfo: () => void
}

export const useAuthStore = create<AuthType>()(
  persist(
    (set) => ({
      accessToken: null,
      accountId: null,
      role: null,
      staffId: null,
      setAccessToken: (accessToken: string, accountId: string, staffId: string, role: string) => set({ accessToken: accessToken, accountId: accountId, staffId: staffId, role: role }),
      removeAuthInfo: () => set((state) => ({ ...state, accessToken: null, accountId: null, role: null, staffId: null }))
    }),
    { name: 'omni-chat-auth-info' }
  )
)