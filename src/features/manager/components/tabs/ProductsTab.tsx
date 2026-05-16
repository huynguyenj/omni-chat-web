import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Input from '@/components/ui/input/Input'
import { Edit, PlusIcon, Search, Trash2 } from 'lucide-react'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import NodataCard from '@/components/ui/card/NodataCard'
import { AnimatePresence } from 'motion/react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import useGetProductListManager from '../../hooks/useGetProductListManager'
import { useState } from 'react'
import useDebounce from '@/hooks/useDebounce'
import ProductCardSkeleton from '@/components/ui/skeleton/ProductCardSkeleton'
import { PRODUCT_TYPE } from '@/features/chat/const/product-type'
import { PRODUCT_LIST_SORT_BY, PRODUCT_PACKAGE_TYPE } from '../../const/product'
import { LuPackage } from 'react-icons/lu'
import type { ProductDetailType } from '@/features/chat/types/product-type'
import { FiCheckCircle } from 'react-icons/fi'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import useDeleteProduct from '../../hooks/useDeleteProduct'
import useCreateProduct from '../../hooks/useCreateProduct'
import { Controller } from 'react-hook-form'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import useGetAllBrand from '@/features/chat/hooks/useGetAllBrand'
import useUpdateProduct from '../../hooks/useUpdateProduct'
import ProductBatchList from './product-tab/ProductBatchList'
import { TableSkeleton } from '@/components/ui/skeleton/TableSkeleton'

export default function ProductsTab() {
  const { currentPage, listProducts, loading, setCurrentPage, setOnRefresh, setSearchText, setSortBy, setSortType, sortBy, sortType } = useGetProductListManager()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isOpenCreateProduct, setIsOpenCreateProduct] = useState(false)
  const [isOpenProductInfoEdit, setIsOpenProductInfoEdit] = useState(false)
  const [batchDetailOpen, setBatchDetailOpen] = useState(false)
  const { handleDelete, loading: deleteLoading, setProductId } = useDeleteProduct({ onRefresh: setOnRefresh, onCloseModalDelete: setIsAlertOpen })
  const { control, errors, handleSubmit:handleSubmitProduct, loading: createProductLoading, onSubmit: onSubmitProduct, register: registerProduct, preview, reset, setPreview } = useCreateProduct()
  const { listBrand } = useGetAllBrand()
  const { errors: errorUpdate, handleSubmitImage, handleSubmitProductInfo, loading: loadingUpdate, newImagePreview, onProductImageSubmit, onProductInfoSubmit, resetImage, resetProductInfo, setProductUpdateSelected, registerProductInfoUpdate, setNewImagePreview, controlProductUpdateImage, productUpdateSelected } = useUpdateProduct({ onRefresh: setOnRefresh })
  const [productIdSelected, setProductIdSelected] = useState('')
  const handleSearch = (text: string) => {
    setSearchText(text)
  }
  const debounce = useDebounce(handleSearch, 500)

  const handleOpenAlert = (productId: string) => {
    setIsAlertOpen((prev) => !prev)
    setProductId(productId)
  }

  const handleOpenCreateProduct = () => {
    reset()
    setPreview(null)
    setIsOpenCreateProduct(prev => !prev)
  }

  const handleUpdateProductInfo = (productInfo: ProductDetailType) => {
    setIsOpenProductInfoEdit(prev => !prev)
    setNewImagePreview(null)
    setProductUpdateSelected(productInfo)
    resetImage({
      Image: undefined
    })
    resetProductInfo({
      name: productInfo.name,
      description: productInfo.description,
      price: productInfo.price
    })
  }

  const handleBatchShowSelect = (productId: string) => {
    setProductIdSelected(productId)
    setBatchDetailOpen(true)
  }
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-sm-title-desktop font-semibold">Quản lý sản phẩm</h2>
            <p className="text-sm-body-desktop text-soft-gray mt-1">Danh sách và thông tin sản phẩm</p>
          </div>
          <Button onClick={handleOpenCreateProduct}>
            <PlusIcon/>
            Thêm sản phẩm
          </Button>
        </div>
        <div className="mb-4">
          <Input variant='gray' icon={Search} placeholder='Tìm kiếm theo tên sản phẩm...' onChange={(e) => debounce(e.target.value)}/>
        </div>
        { loading ?
          <TableSkeleton numberOfColumn={10}/>
          :
          <>
            <div className='flex gap-2 items-center w-full mb-3'>
              <p className='text-nowrap'>Sắp xếp:</p>
              <AdvSelect
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chức năng'/>
                </SelectTrigger>
                <SelectContent>
                  { PRODUCT_LIST_SORT_BY.map((sort, i) => (
                    <SelectItem key={i} value={sort.value}>{sort.name}</SelectItem>
                  )) }
                </SelectContent>
              </AdvSelect>
              <AdvSelect
                onValueChange={setSortType}
                defaultValue='false'
                value={sortType}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Thứ tự'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='true'>{ sortBy !== 'createdate' ? 'Giảm dần' : 'Mới nhất' }</SelectItem>
                  <SelectItem value='false'>{ sortBy !== 'createdate' ? 'Tăng dần' : 'Cũ nhất' }</SelectItem>
                </SelectContent>
              </AdvSelect>
            </div>
            {listProducts && listProducts.items.length > 0 ?
              <div>
                <div className='overflow-x-auto'>
                  <table className='w-full border border-border-primary my-3 table-fixed min-w-250 '>
                    <thead className='bg-secondary'>
                      <tr className='text-white'>
                        <th className='py-2 text-start px-5 w-1/6'>STT</th>
                        <th className='py-2 text-start px-5 w-1/3'>Tên sản phẩm</th>
                        <th className='py-2 text-start px-5 w-1/4'>Ảnh</th>
                        <th className='py-2 text-start px-5 w-1/3'>Hãng</th>
                        <th className='py-2 text-start px-5 w-1/4'>Loại sữa</th>
                        <th className='py-2 text-start px-5 w-1/4'>Loại hộp</th>
                        <th className='py-2 text-start px-5 w-1/4'>Dung tích</th>
                        <th className='py-2 text-end px-5 w-1/4'>Số lượng</th>
                        <th className='py-2 text-end px-5 w-1/4'>Giá</th>
                        <th className='py-2 text-end px-5 w-1/4'>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listProducts.items.map((product, i) => (
                        <tr key={product.id}>
                          <td className='py-2 px-5 w-1/6 border-r border-b-2 border-border-primary'>
                            <p>{i + 1}</p>
                          </td>
                          <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                            <p>{product.name}</p>
                          </td>
                          <td className='py-2 px-5 w-1/4 wrap-break-word border-r border-b-2 border-border-primary'>
                            { product.imageUrl ?
                              <img src={product.imageUrl} alt='avatar' className='shrink-0 w-20 h-20 object-contain'/>
                              :
                              <div className="shrink-0 h-20 w-20 rounded-full bg-[#3366CC] text-white flex items-center justify-center font-semibold">
                                {product.name.charAt(0)}
                              </div>
                            }
                          </td>
                          <td className='py-2 px-5 w-1/6 border-r border-b-2 border-border-primary'>
                            <p>{product.brand}</p>
                          </td>
                          <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                            <p>{PRODUCT_TYPE[product.productKind].name}</p>
                          </td>
                          <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                            <p>{PRODUCT_PACKAGE_TYPE[product.productPackagingType]}</p>
                          </td>
                          <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                            <p>{product.volumeMl}ml</p>
                          </td>
                          <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary text-end'>
                            <p>{product.quantity}</p>
                          </td>
                          <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary text-end'>
                            <p>{product.price.toLocaleString()}đ</p>
                          </td>
                          <td className='py-2 px-5 border-r border-b-2 border-border-primary'>
                            <div className='grid grid-cols-2 justify-end items-center gap-2 '>
                              <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleBatchShowSelect(product.id)}>
                                <LuPackage className='text-secondary size-5'/>
                              </Button>
                              <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleUpdateProductInfo(product)}>
                                <Edit className='text-secondary size-5'/>
                              </Button>
                              <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleOpenAlert(product.id)}>
                                <Trash2 className='text-red-500 size-5'/>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <PaginationBar
                    currentPage={currentPage}
                    setPage={setCurrentPage}
                    totalPage={listProducts.meta.total_pages}
                  />
                </div>
              </div>
              :
              <NodataCard content='Không có dữ liệu sản phẩm'/>
            }
          </>
        }
      </Card>
      <AnimatePresence>
        { batchDetailOpen &&
          <PopupBasic onClose={() => setBatchDetailOpen(false)} title='Lô của sản phẩm' size='lg'>
            <p className='text-soft-gray'>Danh sách lô của sản phẩm</p>
            <ProductBatchList productId={productIdSelected}/>
          </PopupBasic>
        }
      </AnimatePresence>
      <AnimatePresence>
        { isOpenCreateProduct &&
        <PopupBasic title='Thêm sản phẩm mới' onClose={handleOpenCreateProduct}>
          <div className='text-sm-body-desktop'>
            <p className='text-soft-gray'>Nhập thông tin sản phẩm</p>
            <div className='flex items-center gap-2 my-5'>
              <Input {...registerProduct('name')} variant='gray' label='Tên sản phẩm' placeholder='Sữa tưới Vinamlk...' error={errors.name?.message}/>
              <div className='w-full'>
                <p className='text-primary font-medium'>Hãng</p>
                <Controller
                  control={control}
                  name='brandId'
                  render={({ field }) => (
                    <AdvSelect
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn hãng'/>
                      </SelectTrigger>
                      <SelectContent>
                        { listBrand.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                        )) }
                      </SelectContent>
                    </AdvSelect>
                  )}
                />
                { errors.brandId?.message && <p className='text-sm-body-desktop text-red-400 mb-3 font-medium'>{errors.brandId?.message}</p> }
              </div>
            </div>
            <div className='flex gap-2 items-center my-3'>
              <p className='text-primary font-medium'>Loại sữa</p>
              <Controller
                control={control}
                name='productKind'
                render={({ field }) => (
                  <AdvSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn loại sữa'/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Sugar'>Sữa có đường</SelectItem>
                      <SelectItem value='NoSugar'>Sữa không đường</SelectItem>
                      <SelectItem value='Yogurt'>Sữa chua</SelectItem>
                    </SelectContent>
                  </AdvSelect>
                )}
              />
              { errors.productKind?.message && <p className='text-sm-body-desktop text-red-400 mb-3 font-medium'>{errors.productKind?.message}</p> }
              <p className='text-primary font-medium'>Loại hộp</p>
              <Controller
                control={control}
                name='productPackagingType'
                render={({ field }) => (
                  <AdvSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn loại hộp'/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Bottle'>Chai</SelectItem>
                      <SelectItem value='Carton'>Hộp giấy</SelectItem>
                    </SelectContent>
                  </AdvSelect>
                )}
              />
              { errors.productPackagingType?.message && <p className='text-sm-body-desktop text-red-400 mb-3 font-medium'>{errors.productPackagingType?.message}</p> }
            </div>
            <p className='text-primary font-medium'>Dung tích</p>
            <Controller
              control={control}
              name='volumeMl'
              render={({ field }) => (
                <AdvSelect
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn dung tích'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='180'>180ml</SelectItem>
                    <SelectItem value='490'>490ml</SelectItem>
                    <SelectItem value='880'>880ml</SelectItem>
                    <SelectItem value='1760'>1760ml</SelectItem>
                  </SelectContent>
                </AdvSelect>
              )}
            />
            <div className='flex items-center gap-2'>
              { errors.productPackagingType?.message && <p className='text-sm-body-desktop text-red-400 mb-3 font-medium'>{errors.productPackagingType?.message}</p> }
              <Input type='number' {...registerProduct('lifeSpan', { valueAsNumber: true })} variant='gray' placeholder='14' label='Hạn sử dụng' error={errors.lifeSpan?.message}/>
              <Input {...registerProduct('price', { valueAsNumber: true })} type='number' variant='gray' label='Giá' placeholder='100000' error={errors.price?.message}/>
            </div>
            <hr className='border-2 border-border-primary my-5'/>
            <Input {...registerProduct('description')} variant='gray' placeholder='Mô tả sản phẩm' label='Mô tả sản phẩm'/>
            <hr className='border-2 border-border-primary my-5'/>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <Input
                  variant='gray'
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  label='Tải ảnh sản phẩm'
                />
              )}
            />
            { preview &&
              <div className="w-full h-60 border border-border-primary my-5 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-contain"
                />
              </div>
            }
          </div>
          <div className='flex w-full gap-2 items-center my-3'>
            { createProductLoading ?
              <LoadingSpinner size='lg'/>
              :
              <>
                <Button variant="basic" className="py-2 px-3 hover:bg-gray-200 w-full" onClick={handleOpenCreateProduct}
                >
                    Hủy
                </Button>
                <Button variant='default' className='py-2 px-3 w-full' onClick={handleSubmitProduct(onSubmitProduct)}>
                  <FiCheckCircle className='size-4' />
                      Thêm sản phẩm
                </Button>
              </>
            }
          </div>
        </PopupBasic>
        }
      </AnimatePresence>
      <AnimatePresence>
        { isAlertOpen &&
          <PopupBasic onClose={() => setIsAlertOpen(false)} title='Xác nhận'>
            <p className='text-m-body-desktop font-medium my-3'>Bạn có chắc muốn xóa sản phẩm này</p>
            <div className='flex gap-2 items-center my-3 w-full justify-center'>
              { deleteLoading ?
                <LoadingSpinner size='lg'/>
                :
                <>
                  <Button variant='outline' className='w-full' onClick={() => setIsAlertOpen(false)}>Không</Button>
                  <Button className='w-full' variant='danger' onClick={handleDelete}>Có</Button>
                </>
              }
            </div>
          </PopupBasic>
        }
      </AnimatePresence>
      <AnimatePresence>
        { isOpenProductInfoEdit &&
          <PopupBasic title='Cập nhật thông tin sản phẩm' onClose={() => setIsOpenProductInfoEdit(false)}>
            <div className='text-sm-body-desktop'>
              <p className='text-soft-gray'>Cập nhật lại thông tin cơ bản của sản phẩm</p>
              <div className='flex flex-col gap-3 my-5'>
                <Input {...registerProductInfoUpdate('name')} variant='gray' label='Tên sản phẩm' error={errorUpdate.name?.message}/>
                <Input {...registerProductInfoUpdate('description')} variant='gray' label='Mô tả sản phẩm' placeholder='Mô tả sản phẩm'/>
                <Input type='number' {...registerProductInfoUpdate('price', { valueAsNumber: true })} variant='gray' label='Giá sản phẩm'/>
              </div>
              <div className='flex gap-2 items-center my-3 w-full justify-center'>
                { loading ?
                  <LoadingSpinner size='lg'/>
                  :
                  <>
                    <Button className='w-full' onClick={handleSubmitProductInfo(onProductInfoSubmit)}>Cập nhật thông tin</Button>
                  </>
                }
              </div>
            </div>
            <hr className='border border-border-primary my-3'/>
            <div className='text-sm-body-desktop'>
              <p className='text-soft-gray'>Cập nhật lại ảnh của sản phẩm</p>
              <div className='flex flex-col gap-3 my-2'>
                { productUpdateSelected?.imageUrl ?
                  <div className='w-full h-40 my-3'>
                    <p className='font-medium'>Ảnh hiện tại</p>
                    <img src={productUpdateSelected.imageUrl} alt='product-image' className='w-full h-full object-contain'/>
                  </div>
                  :
                  <p>Sản phẩm chưa có ảnh</p>
                }
                <Controller
                  name="Image"
                  control={controlProductUpdateImage}
                  render={({ field }) => (
                    <Input
                      variant='gray'
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      label='Tải ảnh sản phẩm'
                    />
                  )}
                />
                <div className='w-full h-fit my-4'>
                  <p className='font-medium'>Ảnh mới</p>
                  { newImagePreview ?
                    <img src={newImagePreview} alt='product-image' className='w-50 h-50 object-contain'/>
                    :
                    <p>Chưa có ảnh mới được tải lên</p>
                  }
                </div>
              </div>
              <div className='flex gap-2 items-center my-3 w-full justify-center'>
                { loadingUpdate ?
                  <LoadingSpinner size='lg'/>
                  :
                  <>
                    <Button className='w-full' onClick={handleSubmitImage(onProductImageSubmit)}>Cập nhật ảnh</Button>
                  </>
                }
              </div>
            </div>
          </PopupBasic>
        }
      </AnimatePresence>
    </div>
  )
}

