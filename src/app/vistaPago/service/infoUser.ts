import { axiosInstance2 } from "@/api/axios"
import { UserInfo } from "../types/car"

export const getUser = async (): Promise<UserInfo> => {
  const token = localStorage.getItem('auth_token')
  if (!token) throw new Error('Token no encontrado')

  const response = await axiosInstance2.get('/users/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
