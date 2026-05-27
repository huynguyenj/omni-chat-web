import useApiCall from '@/config/useApiCall'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import type { ClaimType } from '../types/claim-type'
import { toast } from 'react-toastify'

export default function useGetClaimList({ currentPage }: { currentPage: number }) {
  const staffId = useAuthStore((s) => s.staffId)
  const [listClaims, setListClaims] = useState<PaginationStructure<ClaimType>>()
  const { execute, loading } = useApiCall<PaginationStructure<ClaimType>>()
  const [isRefresh, setIsRefresh] = useState(false)
  useEffect(() => {
    if (!staffId) {
      toast.error('Hãy đăng nhập để lấy danh sách đơn!')
    }
    const fetchListClaims = async () => {
      const apiData = await execute({
        apiUrl: `/claims/staff/${staffId}?pageIndex=${currentPage}&pageSize=${2}`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      setListClaims(data)
      if (error) toast.error(error)
    }
    fetchListClaims()
  }, [currentPage, isRefresh])
  const handleRefresh = () => {
    setIsRefresh(prevState => !prevState)
  }
  return { listClaims, loading, handleRefresh }
}
