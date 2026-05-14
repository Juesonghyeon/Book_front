import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const useAuthStore = create(
  persist(
    immer((set) => ({
      accessToken: null,
      tokenType: null,
      userId: null,
      name: null,
      point: 0,

      setAuth: (authData) =>
        set((state) => {
          state.accessToken = authData.accessToken
          state.tokenType = authData.tokenType
          state.userId = authData.userId
          state.name = authData.name
          state.point = authData.point ?? 0
        }),

      clearAuth: () =>
        set((state) => {
          state.accessToken = null
          state.tokenType = null
          state.userId = null
          state.name = null
          state.point = 0
        }),
    })),
    { name: 'auth-storage' }
  )
)

export default useAuthStore