import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  email: string
  firstName: string
  profileImage?: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  signUp: (email: string, firstName: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      signUp: async (email: string, firstName: string, password: string) => {
        set({ isLoading: true })
        try {
          // Simulate API call - in production, this would call your backend
          const newUser: User = {
            id: Date.now().toString(),
            email,
            firstName,
            profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          }

          // Store user data in localStorage (in production, use secure token storage)
          localStorage.setItem(`user_${email}`, JSON.stringify({ email, firstName, password }))

          set({ user: newUser })
        } finally {
          set({ isLoading: false })
        }
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // Simulate API call - retrieve user from localStorage
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
    }),
    {
      name: "auth-storage",
    },
  ),
)
