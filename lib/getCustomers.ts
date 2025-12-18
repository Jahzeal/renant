const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import {apiRequest} from "@/lib/authenticate"

const getAuthToken =()=>{
  if(typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export async function  getTotalCustomers(): Promise<number> {
  const token = getAuthToken()
  if(!token){
    console.log("No auth token found ")
    return 0
  }
  const res = await apiRequest(`${API_BASE_URL}/admin/users`, {
    method: "GET",
    headers:{
      "Content-Type" : "application/json",
      "Authorization" : `Bearer ${token}`,
    }
  })
  if (!res?.ok) {
    const errorData = await res?.json().catch(() => ({}))
    console.error("Admin API error response:", errorData?.message || res?.statusText)
    return 0
  }

  const data = await res.json()

  // Case 1: backend returns array
  if (Array.isArray(data)) return data.length

  // Case 2: backend returns { users: [] }
  if (Array.isArray(data.users)) return data.users.length

  // Case 3: backend returns { total: number }
  if (typeof data.total === "number") return data.total

  return 0
  
}