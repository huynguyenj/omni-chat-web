import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Boxes,
  CalendarDays,
  CircleDollarSign,
  Droplets,
  Package,
  Warehouse as WarehouseIcon,
  X
} from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { ManagerInventoryApi } from '../../api/inventory-api'
import type { InventoryDashboardData } from '../../types/inventory-type'
import type { ManagerProductItem } from '../../types/product-type'

const LOW_STOCK_MAX = 9
const WARNING_STOCK_MAX = 49

type StockLevel = { label: string; qtyClass: string; statusClass: string; sortRank: number }

function stockLevelFromQuantity(q: number): StockLevel {
  if (q <= LOW_STOCK_MAX) {
    return {
      label: 'Sắp hết hàng',
      qtyClass: 'text-red-600 font-semibold',
      statusClass: 'text-red-600 font-semibold',
      sortRank: 0
    }
  }
  if (q <= WARNING_STOCK_MAX) {
    return {
      label: 'Cảnh báo',
      qtyClass: 'text-amber-600 font-semibold',
      statusClass: 'text-amber-600 font-semibold',
      sortRank: 1
    }
  }
  return {
    label: 'Đủ hàng',
    qtyClass: 'text-emerald-600 font-semibold',
    statusClass: 'text-emerald-600 font-semibold',
    sortRank: 2
  }
}

type SortKey = 'name' | 'code' | 'brand' | 'quantity' | 'status'
type SortDir = 'asc' | 'desc'

function formatProductDateTime(iso: string | null | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
}

function ProductDetailField({
  label,
  value,
  valueClassName = 'text-[#003366]',
  icon,
  className
}: {
  label: string
  value: string
  valueClassName?: string
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={['min-w-0', className].filter(Boolean).join(' ')}>
      <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
        {icon ? <span className="inline-flex shrink-0 text-gray-400 [&>svg]:h-4 [&>svg]:w-4">{icon}</span> : null}
        <span>{label}</span>
      </p>
      <p className={`text-lg font-bold leading-snug break-words ${valueClassName}`}>{value}</p>
    </div>
  )
}

function InventorySortHeader({
  label,
  columnKey,
  sortKey,
  sortDir,
  onSort
}: {
  label: string
  columnKey: SortKey
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
}) {
  const active = sortKey === columnKey
  const Icon = !active ? ArrowUpDown : sortDir === 'asc' ? ArrowUp : ArrowDown
  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      className="inline-flex items-center justify-center gap-1 w-full min-h-[44px] px-2 py-2 font-semibold text-[#003366] hover:bg-[#BBDEFB]/60 transition-colors"
    >
      <span>{label}</span>
      <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-[#1565C0]' : 'text-gray-500'}`} aria-hidden />
    </button>
  )
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onMouseDown={onClose}>
      <div
        className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gray-200 bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-[#003366] pr-2">{title}</h3>
          <Button type="button" variant="outline" size="sm" className="h-9 w-9 shrink-0 p-0" onClick={onClose} aria-label="Đóng">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  )
}

export default function WarehouseTab() {
  const productPageSize = 12
  const [dashboard, setDashboard] = useState<InventoryDashboardData>({
    totalProducts: 0,
    lowStockProducts: 0,
    totalBrands: 0
  })
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
  const [dashboardError, setDashboardError] = useState<string | null>(null)
  const [products, setProducts] = useState<ManagerProductItem[]>([])
  const [productPage, setProductPage] = useState(1)
  const [productTotalPages, setProductTotalPages] = useState(1)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ManagerProductItem | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoadingDashboard(true)
      setDashboardError(null)
      try {
        const stats = await ManagerInventoryApi.getDashboard()
        setDashboard(stats)
      } catch {
        setDashboardError('Không thể tải dữ liệu tổng quan kho.')
      } finally {
        setIsLoadingDashboard(false)
      }
    }

    void fetchDashboard()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true)
      setProductsError(null)
      try {
        const response = await ManagerInventoryApi.getProducts(productPage, productPageSize)
        setProducts(response.items ?? [])
        setProductTotalPages(Math.max(1, response.meta?.total_pages ?? 1))
      } catch {
        setProductsError('Không thể tải chi tiết tồn kho.')
        setProducts([])
        setProductTotalPages(1)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    void fetchProducts()
  }, [productPage, productPageSize])

  const totalProductsValue = isLoadingDashboard ? '...' : dashboard.totalProducts
  const lowStockValue = isLoadingDashboard ? '...' : dashboard.lowStockProducts
  const totalBrandsValue = isLoadingDashboard ? '...' : dashboard.totalBrands

  const sortedProducts = useMemo(() => {
    const list = [...products]
    const dir = sortDir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') {
        cmp = (a.name || '').localeCompare(b.name || '', 'vi', { sensitivity: 'base' })
      } else if (sortKey === 'code') {
        cmp = (a.code || '').localeCompare(b.code || '', 'vi', { sensitivity: 'base' })
      } else if (sortKey === 'brand') {
        cmp = (a.brand || '').localeCompare(b.brand || '', 'vi', { sensitivity: 'base' })
      } else if (sortKey === 'quantity') {
        cmp = (a.quantity ?? 0) - (b.quantity ?? 0)
      } else {
        cmp =
          stockLevelFromQuantity(a.quantity ?? 0).sortRank - stockLevelFromQuantity(b.quantity ?? 0).sortRank
      }
      return cmp * dir
    })
    return list
  }, [products, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-[#003366]">{totalProductsValue}</p>
            </div>
            <Package className="h-12 w-12 text-[#3366CC] opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sắp hết hàng</p>
              <p className="text-3xl font-bold text-yellow-700">{lowStockValue}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-yellow-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Hãng</p>
              <p className="text-3xl font-bold text-[#2ECC71]">{totalBrandsValue}</p>
            </div>
            <WarehouseIcon className="h-12 w-12 text-[#2ECC71] opacity-50" />
          </div>
        </Card>
      </div>

      {dashboardError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {dashboardError}
        </div>
      )}

      {productsError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {productsError}
        </div>
      )}

      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-[#003366] text-xl font-semibold">Danh sách chi tiết tồn kho</h2>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi tồn kho, SKU và trạng thái theo từng sản phẩm
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-[920px] border-collapse text-sm font-sans">
            <thead>
              <tr className="bg-[#E3F2FD]">
                <th className="border border-gray-200 px-2 py-2 text-center text-[#003366] font-semibold w-14">STT</th>
                <th className="border border-gray-200 px-2 py-2 text-left text-[#003366] font-semibold w-[100px]">Hình ảnh</th>
                <th className="border border-gray-200 p-0 align-middle min-w-[180px]">
                  <InventorySortHeader
                    label="Tên sản phẩm"
                    columnKey="name"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={toggleSort}
                  />
                </th>
                <th className="border border-gray-200 p-0 align-middle min-w-[120px]">
                  <InventorySortHeader
                    label="Mã SKU"
                    columnKey="code"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={toggleSort}
                  />
                </th>
                <th className="border border-gray-200 p-0 align-middle min-w-[120px]">
                  <InventorySortHeader
                    label="Hãng"
                    columnKey="brand"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={toggleSort}
                  />
                </th>
                <th className="border border-gray-200 p-0 align-middle min-w-[140px]">
                  <InventorySortHeader
                    label="Tổng tồn kho (sp)"
                    columnKey="quantity"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={toggleSort}
                  />
                </th>
                <th className="border border-gray-200 p-0 align-middle min-w-[130px]">
                  <InventorySortHeader
                    label="Trạng thái"
                    columnKey="status"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={toggleSort}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProducts && (
                <tr>
                  <td colSpan={8} className="border border-gray-200 px-3 py-10 text-center text-blue-700 bg-blue-50/50">
                    Đang tải chi tiết tồn kho...
                  </td>
                </tr>
              )}
              {!isLoadingProducts && products.length === 0 && (
                <tr>
                  <td colSpan={8} className="border border-gray-200 px-3 py-10 text-center text-gray-600 bg-gray-50">
                    Chưa có dữ liệu sản phẩm.
                  </td>
                </tr>
              )}
              {!isLoadingProducts &&
                sortedProducts.map((product, index) => {
                  const level = stockLevelFromQuantity(product.quantity ?? 0)
                  const stt = (productPage - 1) * productPageSize + index + 1
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/80">
                      <td className="border border-gray-200 px-2 py-2 text-center text-gray-900">{stt}</td>
                      <td className="border border-gray-200 px-2 py-2">
                        <div className="mx-auto h-12 w-12 overflow-hidden rounded border border-gray-200 bg-gray-50">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">—</div>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-900">{product.name}</td>
                      <td className="border border-gray-200 px-3 py-2 text-left text-gray-800">{product.code || '—'}</td>
                      <td className="border border-gray-200 px-3 py-2 text-left text-gray-800">{product.brand || '—'}</td>
                      <td className="border border-gray-200 px-3 py-2 text-center">
                        <span className={`inline-flex items-center justify-center gap-1.5 tabular-nums ${level.qtyClass}`}>
                          <Boxes className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                          {product.quantity ?? 0}
                        </span>
                      </td>
                      <td className={`border border-gray-200 px-3 py-2 text-center ${level.statusClass}`}>{level.label}</td>
                      <td className="border border-gray-200 px-3 py-2 text-center">
                        <button
                          type="button"
                          className="text-[#3366CC] font-medium underline underline-offset-2 hover:text-[#003366]"
                          onClick={() => {
                            setSelectedProduct(product)
                            setDetailOpen(true)
                          }}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <PaginationBar
            currentPage={productPage}
            setPage={setProductPage}
            totalPage={productTotalPages}
          />
        </div>
      </Card>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={selectedProduct ? `Thông tin chi tiết sản phẩm: ${selectedProduct.name}` : 'Thông tin chi tiết sản phẩm'}
      >
        {selectedProduct && (
          <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <div className="flex justify-center md:justify-start">
                <div className="flex aspect-square w-full max-w-[280px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-4">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 px-4 text-center text-sm text-gray-500">
                      <Package className="h-14 w-14 text-gray-300" aria-hidden />
                      <span className="font-medium text-gray-400">Chưa có ảnh sản phẩm</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-5">
                <p className="text-2xl font-bold leading-tight text-[#003366] md:text-3xl">
                  {selectedProduct.name || '—'}
                </p>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Thương hiệu</p>
                  <p className="text-lg font-bold text-[#003366]">{selectedProduct.brand || '—'}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Loại</p>
                  <p className="text-lg font-bold text-[#003366]">{selectedProduct.productKind || '—'}</p>
                </div>
              </div>
            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              <ProductDetailField
                label="Dung tích:"
                icon={<Droplets />}
                value={
                  selectedProduct.volumeMl != null && !Number.isNaN(Number(selectedProduct.volumeMl))
                    ? `${selectedProduct.volumeMl} ml`
                    : '—'
                }
              />
              <ProductDetailField
                label="Giá bán:"
                icon={<CircleDollarSign />}
                value={`${selectedProduct.price.toLocaleString('vi-VN')} VNĐ`}
                valueClassName="text-[#D97706]"
              />
              <ProductDetailField
                label="Quy cách:"
                icon={<Package />}
                value={selectedProduct.productPackagingType || '—'}
              />
              <ProductDetailField
                label="Tồn kho:"
                value={`${selectedProduct.quantity ?? '—'} chai`}
              />
              <ProductDetailField
                label="Hạn dùng:"
                icon={<CalendarDays />}
                value={
                  selectedProduct.lifeSpan != null && !Number.isNaN(Number(selectedProduct.lifeSpan))
                    ? `${selectedProduct.lifeSpan} ngày`
                    : '—'
                }
              />
              <ProductDetailField
                label="Mô tả:"
                value={selectedProduct.description?.trim() ? selectedProduct.description : '—'}
                valueClassName="text-[#003366] whitespace-pre-wrap"
              />
              <ProductDetailField
                className="md:col-span-2"
                label="Ngày tạo:"
                value={formatProductDateTime(selectedProduct.createDate)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

