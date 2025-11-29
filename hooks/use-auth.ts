import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- INTERFACES ---

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

// 💡 DTO Interface for sending data to NestJS (MUST match backend PascalCase names)
export interface ProfileUpdateDto {
  email?: string;
  Firstname?: string; // Matches NestJS DTO and Prisma schema
  Lastname?: string;  // Matches NestJS DTO and Prisma schema
  password?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: Omit<User, 'id' | 'profileImage'> & { password: string }) => Promise<void>;
  signOut: () => void;
  // 💡 NEW: Update action signature
  updateProfileData: (data: ProfileUpdateDto) => Promise<void>;
}

// Helper function to create a base User object from API data
const createUserObject = (data: any, email: string): User => ({
  id: data.id || data.userId || 'unknown-id',
  email: email,
  // NOTE: Your API response needs to return Firstname/Lastname to populate this accurately
  // Here we assume data.firstName/data.lastName might come from a normalized API response
  firstName: data.firstName || data.Firstname || 'User', 
  lastName: data.lastName || data.Lastname || '',
  profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
});


export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      // --- SIGN IN (Login) ---
      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Sign in failed");
          }

          const data = await res.json();
          
          localStorage.setItem("access_token", data.access_token);
          
          // Set user state in Zustand store
          set({ user: createUserObject(data, email) }); 
          
        } catch (err: any) {
          set({ error: err.message || "An error occurred during sign in." });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // --- SIGN UP (Register) ---
      signUp: async (data: any) => { 
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Signup failed");
          }

          const result = await res.json();
          
          localStorage.setItem("access_token", result.access_token);
          
          set({ user: createUserObject(result, data.email) });
          
          return result;
        } catch (err: any) {
          set({ error: err.message || "An error occurred during sign up." });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },


      // --- UPDATE PROFILE DATA ---
      updateProfileData: async (data: ProfileUpdateDto) => {
        set({ isLoading: true, error: null });
        
        const token = localStorage.getItem("access_token");
        if (!token) {
          set({ error: "Authentication required to update profile." });
          throw new Error("Missing access token");
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-me`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 
            },
            body: JSON.stringify(data), 
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Profile update failed");
          }

          const updatedUser = await res.json();
          
          // 💡 CRUCIAL: Merge the updated fields into the existing user state
          set((state) => ({ 
              user: {
                ...state.user!, 
                ...updatedUser, 
              },
          }));
          
        } catch (err: any) {
          set({ error: err.message || "Failed to update profile." });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // --- SIGN OUT ---
      signOut: () => {
        set({ user: null, error: null });
        localStorage.removeItem("access_token");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, error: state.error }),
    },
  ),
);