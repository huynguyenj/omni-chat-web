import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthType = {
  accessToken: string | null
  role: string | null
  accountId: string | null
  staffId: string | null
  staffName: string | null
  avatarUrl: string | null
  setAccessToken: (accessToken: string, accountId: string, staffId: string, role: string, staffName: string, avatarUrl: string | null) => void
  removeAuthInfo: () => void
}

export const useAuthStore = create<AuthType>()(
  persist(
    (set) => ({
      accessToken: null,
      accountId: null,
      role: null,
      staffId: null,
      avatarUrl: null,
      staffName: null,
      setAccessToken: (accessToken: string, accountId: string, staffId: string, role: string, staffName: string, avatarUrl: string | null) => set({ accessToken: accessToken, accountId: accountId, staffId: staffId, role: role, avatarUrl: avatarUrl, staffName: staffName }),
      removeAuthInfo: () => set((state) => ({ ...state, accessToken: null, accountId: null, role: null, staffId: null }))
    }),
    { name: 'omni-chat-auth-info' }
  )
)