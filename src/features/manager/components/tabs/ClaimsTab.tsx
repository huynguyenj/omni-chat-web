import { useMemo, useState } from 'react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import {
  ITEMS_PER_PAGE,
  CLAIMS_LIST,
  type ManagerClaim
} from '../../data/manager-dashboard-data'

function claimStatusTag(status: ManagerClaim['status']) {
  if (status === 'approved') return <Tag variant="success" size="sm" className="text-[10px] h-4 px-2">Đã duyệt</Tag>
  if (status === 'rejected') return <Tag variant="danger" size="sm" className="text-[10px] h-4 px-2">Từ chối</Tag>
  return <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">Chờ duyệt</Tag>
}

export default function ClaimsTab() {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(CLAIMS_LIST.length / ITEMS_PER_PAGE))
  const paged = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return CLAIMS_LIST.slice(start, start + ITEMS_PER_PAGE)
  }, [page])

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Claims</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý các yêu cầu (mock)</p>
          </div>
          <div className="flex items-center gap-2">
            <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">Pending</Tag>
            <Tag variant="success" size="sm" className="text-[10px] h-4 px-2">Approved</Tag>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map(claim => (
            <Card key={claim.id} className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 border-t-[#3366CC]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-[#003366] text-lg">{claim.id}</p>
                  <p className="text-sm text-gray-500">{claim.staff} • {claim.type}</p>
                </div>
                {claimStatusTag(claim.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Thời gian</span>
                  <span>{claim.startDate} - {claim.endDate}</span>
                </div>
                <div className="bg-[#F5F7FA] p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Lý do</p>
                  <p className="text-sm font-semibold text-[#003366]">{claim.reason}</p>
                </div>
              </div>

              <div className="pt-3 border-t mt-4">
                <Button variant="outline" size="sm" className="w-full" onClick={() => {}}>
                  Xử lý claim
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
            Prev
          </Button>
          <span className="text-sm text-gray-600">Page {page}/{totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  )
}

