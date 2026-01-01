"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- INTERFACES ---

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    role: 'ADMIN' | 'USER';
}

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
    updateProfileData: (data: ProfileUpdateDto) => Promise<void>;
}

// Helper to decode JWT payload safely
const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

// Helper function to create a base User object from API data (used on SIGN IN/UP)
const createUserObject = (data: any, email: string, token?: string): User => {
    // Try to extract role from Token if available
    let extractedRole = data.role;
    if (token) {
        const decoded = parseJwt(token);
        if (decoded?.role) {
            extractedRole = decoded.role;
        }
    }

    return {
        id: data.id || data.userId || 'unknown-id',
        email: email,
        role: extractedRole || 'USER',
        // Assuming API response might use Firstname/Lastname or firstName/lastName
        firstName: data.firstName || data.Firstname || 'User',
        lastName: data.lastName || data.Lastname || '',
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
};

// 💡 NEW HELPER: Normalizes API response (PascalCase) into the frontend User interface (camelCase).
const normalizeProfileResponse = (apiData: any, existingUser: User): Partial<User> => {
    const update: Partial<User> = {};

    // Map fields from API (PascalCase) to User interface (camelCase)
    if (apiData.email !== undefined) update.email = apiData.email;
    if (apiData.Firstname !== undefined) update.firstName = apiData.Firstname;
    if (apiData.Lastname !== undefined) update.lastName = apiData.Lastname;
    
    // Also include normalized profileImage if returned
    if (apiData.profileImage !== undefined) update.profileImage = apiData.profileImage;

    // Optional: Recalculate default profile image if name or email changed
    if (update.email || update.firstName || update.lastName) {
         update.profileImage = update.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${update.email || existingUser.email}`;
    }

    return update;
};

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
                    
                    set({ user: createUserObject(data, email, data.access_token) });
                    
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
                    
                    set({ user: createUserObject(result, data.email, result.access_token) });
                    
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

                    const apiResponse = await res.json();
                    
                    // 💡 CRUCIAL FIX: Normalize API response before merging
                    set((state) => {
                        if (!state.user) return state; // Safety check

                        const normalizedUpdate = normalizeProfileResponse(apiResponse, state.user);

                        return { 
                            user: {
                                ...state.user, 
                                ...normalizedUpdate, // Merges the correct camelCase properties
                            },
                        };
                    });
                    
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