import { useMemo, useState } from 'react'
import { AlertTriangle, Clock } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import { WARNING_CONVERSATIONS, ITEMS_PER_PAGE, type ManagerWarning } from '../../data/manager-dashboard-data'

function severityTag(warning: ManagerWarning) {
  if (warning.severity === 'high') {
    return <Tag variant="danger" size="sm" className="text-[10px] h-4 px-2">Nghiêm trọng</Tag>
  }
  return <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">Cảnh báo</Tag>
}

export default function WarningsTab() {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(WARNING_CONVERSATIONS.length / ITEMS_PER_PAGE))
  const paged = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return WARNING_CONVERSATIONS.slice(start, start + ITEMS_PER_PAGE)
  }, [page])

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Cảnh báo hội thoại</h2>
            <p className="text-sm text-gray-500 mt-1">Giám sát các cuộc hội thoại có vấn đề</p>
          </div>
          <div className="flex items-center gap-2">
            <Tag variant="danger" size="sm" className="text-[10px] h-4 px-2">
              {WARNING_CONVERSATIONS.filter(w => w.severity === 'high').length} Nghiêm trọng
            </Tag>
            <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">
              {WARNING_CONVERSATIONS.filter(w => w.severity === 'medium').length} Cảnh báo
            </Tag>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map(warning => (
            <Card
              key={warning.id}
              className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4"
              style={{ borderTopColor: warning.severity === 'high' ? '#FB2C36' : '#FF9800' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${warning.severity === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                    <h3 className="font-bold text-[#003366] text-sm line-clamp-1">{warning.issue}</h3>
                  </div>
                  {severityTag(warning)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col">
                      <p className="text-gray-500 uppercase font-medium">Nhân viên</p>
                      <p className="text-[#003366] font-medium line-clamp-1">{warning.staff}</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-500 uppercase font-medium">Khách hàng</p>
                      <p className="text-[#003366] font-medium line-clamp-1">{warning.customer}</p>
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded border border-gray-100 min-h-[4rem]">
                    <p className="text-xs text-gray-700 line-clamp-3">
                      <span className="font-bold">Chi tiết:</span> {warning.details}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {warning.messageCount != null && (
                      <Tag variant="danger" size="sm" className="text-[10px] h-4 px-2">
                        {warning.messageCount} tin/2phút
                      </Tag>
                    )}
                    {warning.waitTime && (
                      <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">
                        <Clock className="h-3 w-3 mr-1 inline" />
                        {warning.waitTime} chờ
                      </Tag>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-gray-500">{warning.id}</span>
                    <span className="text-[10px] text-gray-500 italic">{warning.time}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => {}}>
                  Xem chat
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 flex-1" onClick={() => {}}>
                  Xử lý
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

