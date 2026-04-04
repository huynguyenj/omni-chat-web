import { useMemo, useState } from 'react'
import { Package, Tag as TagIcon } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import { PRODUCTS_WITH_BATCHES, type ManagerBatch, type ManagerProduct, ITEMS_PER_PAGE } from '../../data/manager-dashboard-data'

const statusLabel = (batch: ManagerBatch) => {
  if (batch.status === 'active') return { text: 'Đủ hàng', variant: 'success' as const }
  if (batch.status === 'near-expiry') return { text: 'Sắp hết hạn', variant: 'danger' as const }
  return { text: 'Cần nhập thêm', variant: 'warn' as const }
}

export default function ProductsTab() {
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string[]>([])

  const totalPages = Math.max(1, Math.ceil(PRODUCTS_WITH_BATCHES.length / ITEMS_PER_PAGE))
  const pagedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return PRODUCTS_WITH_BATCHES.slice(start, start + ITEMS_PER_PAGE)
  }, [page])

  const toggleExpanded = (productId: string) => {
    setExpanded(prev => (prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]))
  }

  const computeProductStatus = (product: ManagerProduct) => {
    if (product.batches.some(b => b.status === 'near-expiry')) return { label: 'Sắp hết hạn', variant: 'danger' as const }
    if (product.batches.some(b => b.status === 'low-stock')) return { label: 'Sắp hết hàng', variant: 'warn' as const }
    return { label: 'Ổn định', variant: 'success' as const }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Quản lý sản phẩm</h2>
            <p className="text-sm text-gray-500 mt-1">Danh sách sản phẩm và lô hàng</p>
          </div>
          <Button className="bg-[#3366CC] hover:bg-[#2952A3]" size="sm" onClick={() => {}}>
            <Package className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedProducts.map(product => {
            const productStatus = computeProductStatus(product)
            return (
              <Card key={product.id} className="p-4 hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-[#003366] line-clamp-1 leading-tight">{product.name}</h3>
                    <Tag variant="gray" size="sm" className="text-[10px] h-4 px-2">
                      {product.sku}
                    </Tag>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Tag variant={productStatus.variant} size="sm" className="text-[10px] h-4 px-2">
                      {productStatus.label}
                    </Tag>
                    <Tag variant="default" size="sm" className="text-[10px] h-4 px-2">
                      {product.batches.length} lô
                    </Tag>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Tổng tồn:</span>
                      <span className="font-semibold text-[#003366]">
                        {product.totalStock} sp
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Giá bán:</span>
                      <span className="font-bold text-[#2ECC71]">{product.price}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs text-[#3366CC] flex items-center justify-between"
                    onClick={() => toggleExpanded(product.id)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <TagIcon className="h-3.5 w-3.5" />
                      Xem lô hàng ({product.batches.length})
                    </span>
                    <span className="text-gray-500">{expanded.includes(product.id) ? '▲' : '▼'}</span>
                  </Button>
                </div>

                {expanded.includes(product.id) && (
                  <div className="mt-4 space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {product.batches.map(batch => {
                      const st = statusLabel(batch)
                      return (
                        <div key={batch.id} className="p-2 bg-[#F5F7FA] rounded-lg border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-[#003366]">LOT: {batch.batch}</span>
                            <span className="font-bold text-[#003366] text-xs">{batch.stock} sp</span>
                          </div>
                          <div className="text-[10px] text-gray-500 leading-relaxed">
                            <p>MFG: {batch.mfgDate} • EXP: {batch.expDate}</p>
                            <p className={batch.daysToExpire <= 30 ? 'text-red-500 font-medium' : ''}>
                              Còn {batch.daysToExpire} ngày
                            </p>
                          </div>
                          <div className="mt-2">
                            <Tag variant={st.variant} size="sm" className="text-[10px] h-4 px-2">
                              {st.text}
                            </Tag>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
            Prev
          </Button>
          <span className="text-sm text-gray-600">
            Page {page}/{totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  )
}

