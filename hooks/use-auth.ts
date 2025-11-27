import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Interfaces from your Zustand store ---
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string; // Added lastName since your API hook included it
  profileImage?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null; // Added error handling to the store
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: Omit<User, 'id' | 'profileImage'> & { password: string }) => Promise<void>;
  signOut: () => void;
}

// --- Utility to handle redirects (since Zustand store is not a React component) ---
// Note: In Next.js App Router, router must be used inside a client component, 
// but we'll include the logic here to store the token and let a wrapper handle the redirect.

// Helper function to create a base User object from API data
const createUserObject = (data: any, email: string): User => ({
  id: data.id || data.userId || 'unknown-id', // Use ID from API or fallback
  email: email,
  firstName: data.firstName,
  lastName: data.lastName,
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
          
          // Store token in localStorage (Persistence layer is handled by you separately)
          localStorage.setItem("access_token", data.access_token);
          
          // Set user state in Zustand store
          set({ user: createUserObject(data, email) }); 
          
        } catch (err: any) {
          set({ error: err.message || "An error occurred during sign in." });
          throw err; // Re-throw for component handling
        } finally {
          set({ isLoading: false });
        }
      },

      // --- SIGN UP (Register) ---
      signUp: async (data: any) => { // Using 'any' here to simplify until exact API response is known
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
          
          // Store token in localStorage
          localStorage.setItem("access_token", result.access_token);
          
          // Set user state in Zustand store
          set({ user: createUserObject(result, data.email) });
          
          return result;
        } catch (err: any) {
          set({ error: err.message || "An error occurred during sign up." });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // --- SIGN OUT ---
      signOut: () => {
        // Clear state and token
        set({ user: null, error: null });
        localStorage.removeItem("access_token");
        // You would typically call router.push('/signin') from the component that uses signOut
      },
    }),
    {
      name: "auth-storage",
      // Only persist the user object and error state, not loading status
      partialize: (state) => ({ user: state.user, error: state.error }),
    },
  ),
);