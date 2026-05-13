import useApiCall from '@/config/useApiCall'
import { useState } from 'react'
import type { ProductBatchAuditDetail } from '../types/product-batch-audit'


export default function useGetDetailAudit() {
  const { execute, loading } = useApiCall<ProductBatchAuditDetail>()
  const [auditDetail, setAuditDetail] = useState<ProductBatchAuditDetail>()
  const handleGetAuditDetail = async (auditId: string) => {
    const { data } = await execute({
      apiUrl: `/batch-audit/get/${auditId}`,
      method: 'get',
      type: 'private'
    })
    setAuditDetail(data)
  }
  return { loading, auditDetail, handleGetAuditDetail }
}