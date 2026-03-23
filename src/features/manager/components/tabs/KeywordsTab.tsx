import { useMemo, useState } from 'react'
import { Edit2, Plus, Search, Trash2, Tag as TagIcon, TrendingUp, Users } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import { KEYWORDS_LIST, ITEMS_PER_PAGE, type ManagerKeyword } from '../../data/manager-dashboard-data'

function priorityToTagVariant(priority: ManagerKeyword['priority']) {
  if (priority === 'high') return 'danger'
  if (priority === 'medium') return 'warn'
  return 'primary'
}

export default function KeywordsTab() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return KEYWORDS_LIST
    return KEYWORDS_LIST.filter(k => {
      return (
        k.keyword.toLowerCase().includes(q) ||
        k.assignedTo.toLowerCase().includes(q) ||
        k.priority.toLowerCase().includes(q)
      )
    })
  }, [query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Quản lý Keywords</h2>
            <p className="text-sm text-gray-500 mt-1">Cấu hình từ khóa và độ ưu tiên</p>
          </div>
          <Button className="bg-[#3366CC] hover:bg-[#2952A3]" size="sm" onClick={() => {}}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm keyword
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm keyword..."
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#3366CC]/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map((keyword) => (
            <Card key={keyword.id} className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TagIcon className="h-4 w-4 text-[#3366CC]" />
                  <h3 className="font-semibold text-[#003366] text-lg line-clamp-1">{keyword.keyword}</h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Độ ưu tiên:</span>
                    <Tag variant={priorityToTagVariant(keyword.priority)} size="sm" className="text-[10px] h-4 px-2">
                      {keyword.priority === 'high' ? 'Cao' : keyword.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </Tag>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" />
                      <span>{keyword.assignedTo}</span>
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>{keyword.count} lần đề cập</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => {}}>
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  Sửa
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => {}}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} className="disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setPage(p => Math.max(1, p - 1))}>
            Prev
          </Button>
          <span className="text-sm text-gray-600">
            Page {page}/{totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} className="disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  )
}

