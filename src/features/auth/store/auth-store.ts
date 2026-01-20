import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthType = {
  accessToken: string | null
  setAccessToken: (token: string) => void
  removeAuthInfo: () => void
}

export const useAuthStore = create<AuthType>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      removeAuthInfo: () => set((state) => ({ ...state, accessToken: null }))
    }),
    { name: 'omni-chat-auth-info' }
  )
)