import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle, Package, Warehouse as WarehouseIcon } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import { ITEMS_PER_PAGE, PRODUCTS_WITH_BATCHES, type ManagerProduct, type ManagerBatch } from '../../data/manager-dashboard-data'

const batchStatusToVariant = (batch: ManagerBatch) => {
  if (batch.status === 'active') return 'success' as const
  if (batch.status === 'near-expiry') return 'danger' as const
  return 'warn' as const
}

export default function WarehouseTab() {
  const [page] = useState(1)

  const derived = useMemo(() => {
    const totalProducts = PRODUCTS_WITH_BATCHES.length
    const lowStock = PRODUCTS_WITH_BATCHES.filter(p => p.batches.some(b => b.status === 'low-stock')).length
    const nearExpiry = PRODUCTS_WITH_BATCHES.filter(p => p.batches.some(b => b.status === 'near-expiry')).length
    const totalStock = PRODUCTS_WITH_BATCHES.reduce((sum, p) => sum + p.totalStock, 0)
    return { totalProducts, lowStock, nearExpiry, totalStock }
  }, [])

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return PRODUCTS_WITH_BATCHES.slice(start, start + ITEMS_PER_PAGE)
  }, [page])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-[#003366]">{derived.totalProducts}</p>
            </div>
            <Package className="h-12 w-12 text-[#3366CC] opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sắp hết hàng</p>
              <p className="text-3xl font-bold text-yellow-700">{derived.lowStock}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-yellow-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tồn kho</p>
              <p className="text-3xl font-bold text-[#2ECC71]">{derived.totalStock}</p>
            </div>
            <WarehouseIcon className="h-12 w-12 text-[#2ECC71] opacity-50" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-[#003366] text-xl font-semibold mb-4">Chi tiết tồn kho</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedProducts.map(product => {
            return (
              <Card
                key={product.id}
                className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between border-l-4 border-l-[#3366CC]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[#003366] line-clamp-1">{product.name}</h3>
                    <Tag variant="secondary" size="sm" className="text-[10px] h-4 px-2" />
                  </div>

                  <div className="flex items-center justify-between py-2 border-y border-gray-50">
                    <span className="text-sm text-gray-500">Tổng tồn kho:</span>
                    <span className="text-xl font-bold text-[#003366]">
                      {product.totalStock} <span className="text-xs font-normal">sp</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase font-medium">Trạng thái lô hàng</p>
                    <div className="flex flex-wrap gap-2">
                      {product.batches.slice(0, 3).map(batch => (
                        <Tag
                          key={batch.id}
                          variant={batchStatusToVariant(batch)}
                          size="sm"
                          className="text-[10px] h-4 px-2"
                        >
                          {batch.status === 'active' ? 'Ổn định' : batch.status === 'near-expiry' ? 'Sắp hết hạn' : 'Cần nhập'}
                        </Tag>
                      ))}
                      {product.batches.length > 3 && (
                        <Tag variant="gray" size="sm" className="text-[10px] h-4 px-2">
                          +{product.batches.length - 3} lô
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t">
                  <Button variant="outline" size="sm" className="w-full text-xs text-[#3366CC]" onClick={() => {}}>
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

