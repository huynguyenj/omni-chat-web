import { useEffect, useState, type ReactNode } from 'react'
import { AlertTriangle, Package, Warehouse as WarehouseIcon, X, Boxes, Thermometer } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import { ManagerInventoryApi } from '../../api/inventory-api'
import type { InventoryDashboardData } from '../../types/inventory-type'
import type { ManagerProductItem } from '../../types/product-type'

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onMouseDown={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gray-100 bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-[#003366] pr-2">{title}</h3>
          <Button type="button" variant="outline" size="sm" className="h-9 w-9 shrink-0 p-0" onClick={onClose} aria-label="Đóng">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">{children}</div>
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
        <h2 className="text-[#003366] text-xl font-semibold mb-4">Chi tiết tồn kho</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {!isLoadingProducts && products.length === 0 && (
            <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-600">
              Chưa có dữ liệu sản phẩm.
            </div>
          )}

          {products.map(product => {
            return (
              <Card
                key={product.id}
                className="p-4 md:p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between border-2 border-[#3366CC]/80 rounded-2xl bg-white"
              >
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-28 w-28 md:h-32 md:w-32 shrink-0 rounded-xl border-2 border-[#0B4EA2] bg-gray-50 overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">No image</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-[#003366] text-lg leading-tight line-clamp-2">{product.name}</h3>
                        <Tag variant="gray" size="sm" className="text-[10px] h-6 px-3 rounded-full shrink-0">
                          {product.code}
                        </Tag>
                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF3FF] px-3 py-1.5 text-[#1E5BB8] text-sm font-semibold border border-[#BFD8FF]">
                        <span>Hãng: {product.brand || 'Chưa có'}</span>
                        <Thermometer className="h-4 w-4" />
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Boxes className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700 text-lg">Tổng tồn kho:</span>
                        </div>
                        <span className="text-3xl font-bold text-[#2E9E4D] leading-none">
                          {product.quantity} <span className="text-2xl">sp</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-1">
                  <Button
                    size="sm"
                    className="w-full h-11 rounded-xl bg-[#EAF3FF] hover:bg-[#DCEBFF] text-[#1E5BB8] border border-[#BFD8FF] text-xl font-semibold"
                    onClick={() => {
                      setSelectedProduct(product)
                      setDetailOpen(true)
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            )
          })}

          {isLoadingProducts && (
            <div className="col-span-full rounded-md border border-blue-200 bg-blue-50 px-3 py-8 text-center text-sm text-blue-700">
              Đang tải chi tiết tồn kho...
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={productPage <= 1 || isLoadingProducts}
            onClick={() => setProductPage(prev => Math.max(1, prev - 1))}
          >
            Prev
          </Button>
          <span className="text-sm text-gray-600">
            Page {productPage}/{productTotalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={productPage >= productTotalPages || isLoadingProducts}
            onClick={() => setProductPage(prev => Math.min(productTotalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      </Card>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={selectedProduct ? `Thông tin chi tiết sản phẩm: ${selectedProduct.name}` : 'Thông tin chi tiết sản phẩm'}
      >
        {selectedProduct && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
                {selectedProduct.imageUrl ? (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-52 object-contain rounded-md bg-white border border-gray-200"
                  />
                ) : (
                  <div className="w-full h-52 rounded-md bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-500">
                    Không có ảnh
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="rounded-lg border border-gray-300 p-3 bg-white">
                  <p className="text-sm text-gray-500">Tên sản phẩm:</p>
                  <p className="text-2xl font-semibold text-[#003366] leading-tight">{selectedProduct.name || '-'}</p>
                </div>
                <div className="rounded-lg border border-gray-300 p-3 bg-white">
                  <p className="text-sm text-gray-500">Thương hiệu:</p>
                  <p className="text-xl font-semibold text-[#003366]">{selectedProduct.brand || '-'}</p>
                </div>
                <div className="rounded-lg border border-gray-300 p-3 bg-white">
                  <p className="text-sm text-gray-500">Loại:</p>
                  <p className="text-xl font-semibold text-[#003366]">{selectedProduct.productKind || '-'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-300 p-3 bg-white">
                <p className="text-sm text-gray-500">Dạng đóng gói:</p>
                <p className="text-2xl font-semibold text-[#003366]">{selectedProduct.productPackagingType || '-'}</p>
              </div>
              <div className="rounded-lg border border-gray-300 p-3 bg-white">
                <p className="text-sm text-gray-500">Dung tích:</p>
                <p className="text-2xl font-semibold text-[#003366]">{selectedProduct.volumeMl ?? '-'} ml</p>
              </div>
              <div className="rounded-lg border border-gray-300 p-3 bg-white">
                <p className="text-sm text-gray-500">Giá bán:</p>
                <p className="text-2xl font-semibold text-[#D97706]">{selectedProduct.price.toLocaleString('vi-VN')} VNĐ</p>
              </div>
              <div className="rounded-lg border border-gray-300 p-3 bg-white">
                <p className="text-sm text-gray-500">Đóng gói:</p>
                <p className="text-2xl font-semibold text-[#003366]">
                  {selectedProduct.productPackagingType || '-'}
                  {selectedProduct.productPackagingType ? ` (${selectedProduct.productPackagingType})` : ''}
                </p>
              </div>
              <div className="rounded-lg border border-gray-300 p-3 bg-white">
                <p className="text-sm text-gray-500">Tồn kho:</p>
                <p className="text-2xl font-semibold text-[#003366]">{selectedProduct.quantity ?? '-'} chai</p>
              </div>
              <div className="rounded-lg border border-gray-300 p-3 bg-white">
                <p className="text-sm text-gray-500">Hạn sử dụng:</p>
                <p className="text-2xl font-semibold text-[#003366]">{selectedProduct.lifeSpan ?? '-'} ngày</p>
              </div>
              <div className="rounded-lg border border-gray-300 p-3 md:col-span-2 bg-white">
                <p className="text-sm text-gray-500">Mô tả sản phẩm:</p>
                <p className="text-xl font-semibold text-[#003366] whitespace-pre-wrap">{selectedProduct.description || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

