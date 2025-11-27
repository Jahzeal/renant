import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  email: string
  firstName: string
  screenName: string
  profileImage?: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  signUp: (email: string, firstName: string, screenName: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  updateProfile: (firstName: string, screenName: string, email: string) => void
  updatePassword: (currentPassword: string, newPassword: string) => void
  updateEmail: (newEmail: string, password: string) => void
  updateProfileImage: (profileImage: string) => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      signUp: async (email: string, firstName: string, screenName: string, password: string) => {
        set({ isLoading: true })
        try {
          const newUser: User = {
            id: Date.now().toString(),
            email,
            firstName,
            screenName,
            profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          }

          localStorage.setItem(`user_${email}`, JSON.stringify({ email, firstName, screenName, password }))

          set({ user: newUser })
        } finally {
          set({ isLoading: false })
        }
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const storedUser = localStorage.getItem(`user_${email}`)

          if (!storedUser) {
            throw new Error("User not found")
          }

          const userData = JSON.parse(storedUser)
          if (userData.password !== password) {
            throw new Error("Invalid password")
          }

          const user: User = {
            id: Date.now().toString(),
            email,
            firstName: userData.firstName,
            screenName: userData.screenName || email.split("@")[0],
            profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          }

          set({ user })
        } finally {
          set({ isLoading: false })
        }
      },

      signOut: () => {
        set({ user: null })
      },

      updateProfile: (firstName: string, screenName: string, email: string) => {
        set((state) => {
          if (state.user) {
            const updatedUser = { ...state.user, firstName, screenName, email }
            localStorage.setItem(
              `user_${email}`,
              JSON.stringify({
                email,
                firstName,
                screenName,
                password:
                  localStorage.getItem(`user_${state.user.email}`)?.split('"password":"')[1]?.split('"')[0] || "stored",
              }),
            )
            return { user: updatedUser }
          }
          return state
        })
      },

      updatePassword: (currentPassword: string, newPassword: string) => {
        set((state) => {
          if (state.user) {
            const storedUser = localStorage.getItem(`user_${state.user.email}`)
            if (storedUser) {
              const userData = JSON.parse(storedUser)
              if (userData.password === currentPassword) {
                localStorage.setItem(
                  `user_${state.user.email}`,
                  JSON.stringify({
                    ...userData,
                    password: newPassword,
                  }),
                )
                return state
              }
            }
          }
          return state
        })
      },

      updateEmail: (newEmail: string, password: string) => {
        set((state) => {
          if (state.user) {
            const storedUser = localStorage.getItem(`user_${state.user.email}`)
            if (storedUser) {
              const userData = JSON.parse(storedUser)
              if (userData.password === password) {
                localStorage.removeItem(`user_${state.user.email}`)
                localStorage.setItem(
                  `user_${newEmail}`,
                  JSON.stringify({
                    ...userData,
                    email: newEmail,
                  }),
                )
                const updatedUser = { ...state.user, email: newEmail }
                return { user: updatedUser }
              }
            }
          }
          return state
        })
      },

      updateProfileImage: (profileImage: string) => {
        set((state) => {
          if (state.user) {
            const storedUser = localStorage.getItem(`user_${state.user.email}`)
            if (storedUser) {
              const userData = JSON.parse(storedUser)
              localStorage.setItem(
                `user_${state.user.email}`,
                JSON.stringify({
                  ...userData,
                  profileImage,
                }),
              )
            }
            return { user: { ...state.user, profileImage } }
          }
          return state
        })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
