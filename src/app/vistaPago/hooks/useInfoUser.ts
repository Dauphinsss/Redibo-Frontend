import { useQuery } from '@tanstack/react-query'
import { getUser } from '../service/infoUser'

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
  })
}
