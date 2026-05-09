import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import Input from '@/components/ui/input/Input'
import { Edit2, PlusIcon, Search, Trash2 } from 'lucide-react'
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
import { LuPackageSearch } from 'react-icons/lu'
import type { ProductDetailType } from '@/features/chat/types/product-type'
import useCreateBatchProduct from '../../hooks/useCreateBatchProduct'
import { countRestDay, formatDate } from '@/utils/date-resolver'
import { FiCheckCircle } from 'react-icons/fi'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import useDeleteProduct from '../../hooks/useDeleteProduct'
import useCreateProduct from '../../hooks/useCreateProduct'
import { Controller } from 'react-hook-form'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import useGetAllBrand from '@/features/chat/hooks/useGetAllBrand'
import useGetProductBatchManager from '../../hooks/useGetProductBatchManager'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import { ScrollArea } from '@/components/ui/scrollbar/ScrollArea'
import useUpdateProduct from '../../hooks/useUpdateProduct'


export default function ProductsTab() {
  const { currentPage, listProducts, loading, setCurrentPage, setOnRefresh, setSearchText, setSortBy, setSortType, sortBy, sortType } = useGetProductListManager()
  const [isOpenCreateBatch, setIsOpenCreateBatch] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isOpenCreateProduct, setIsOpenCreateProduct] = useState(false)
  const [isOpenProductInfoEdit, setIsOpenProductInfoEdit] = useState(false)
  const [isOpenProductImageEdit, setIsOpenProductImageEdit] = useState(false)
  const [batchDetailOpen, setBatchDetailOpen] = useState(false)

  const { handleCreateBatch, listBatchItems, loading: loadingCreateBatch, productChoseForBatch, setListBatchItems, setProductChoseForBatch, handleAddBatch, handleDeleteBatch, handleSubmit, register } = useCreateBatchProduct()
  const { handleDelete, loading: deleteLoading, setProductId } = useDeleteProduct({ onRefresh: setOnRefresh, onCloseModalDelete: setIsAlertOpen })
  const { control, errors, handleSubmit:handleSubmitProduct, loading: createProductLoading, onSubmit: onSubmitProduct, register: registerProduct, preview, reset, setPreview } = useCreateProduct()
  const { listBrand } = useGetAllBrand()
  const { loading:batchLoading, productBatchList, setBatchCurrentPage, setProductForBatchId, productForBatchId, batchCurrentPage } = useGetProductBatchManager()
  const { errors: errorUpdate, handleSubmitImage, handleSubmitProductInfo, loading: loadingUpdate, newImagePreview, onProductImageSubmit, onProductInfoSubmit, resetImage, resetProductInfo, setProductUpdateSelected, registerProductInfoUpdate, setNewImagePreview, controlProductUpdateImage, productUpdateSelected } = useUpdateProduct({ onRefresh: setOnRefresh })

  const handleSearch = (text: string) => {
    setSearchText(text)
  }
  const debounce = useDebounce(handleSearch, 500)

  const handleOpenAlert = (productId: string) => {
    setIsAlertOpen((prev) => !prev)
    setProductId(productId)
  }

  const handleOpenCreateBatch = (product: ProductDetailType) => {
    setProductChoseForBatch(product)
    setIsOpenCreateBatch(prev => !prev)
  }
  const handleCloseCreateBatch = () => {
    setListBatchItems([])
    setIsOpenCreateBatch(prev => !prev)
  }

  const handleOpenCreateProduct = () => {
    reset()
    setPreview(null)
    setIsOpenCreateProduct(prev => !prev)
  }

  const handleUpdateProductInfo = (productInfo: ProductDetailType) => {
    setIsOpenProductInfoEdit(prev => !prev)
    setProductUpdateSelected(productInfo)
    resetProductInfo({
      name: productInfo.name,
      description: productInfo.description,
      price: productInfo.price
    })
  }

  const handleUpdateProductImage = (productInfo: ProductDetailType) => {
    setNewImagePreview(null)
    setIsOpenProductImageEdit(prev => !prev)
    setProductUpdateSelected(productInfo)
    resetImage({
      Image: undefined
    })
  }

  const handleBatchShowSelect = (productId: string) => {
    if (productForBatchId === productId && batchDetailOpen === true) {
      setBatchDetailOpen(false)
      return
    }
    setProductForBatchId(productId)
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
          <ProductCardSkeleton count={3}/>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {listProducts.items.map((product) => (
                    <Card
                      key={product.id}
                      className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full text-sm-body-desktop px-9 py-7"
                    >
                      <div className="flex flex-col gap-2">
                        <div className='relative shadow-[0px_2px_4px_2px_rgba(0,0,0,0.1)] rounded-2xl w-full py-3'>
                          { product.imageUrl ?
                            <img src={product.imageUrl} alt='avatar' className='shrink-0 w-full h-60 object-contain'/>
                            :
                            <div className="shrink-0 h-12 w-12 rounded-full bg-[#3366CC] text-white flex items-center justify-center font-semibold">
                              {product.name.charAt(0)}
                            </div>
                          }
                          <Button className='absolute top-2 left-2 bg-transparent text-black hover:bg-gray-200' onClick={() => handleUpdateProductImage(product)}>
                            <Edit2 className='size-4'/>
                          </Button>
                        </div>
                        <div className='flex flex-col gap-1'>
                          <p className="font-semibold text-m-body-desktop line-clamp-1 my-2 ml-2">{product.name.toUpperCase()}</p>
                          <div className='flex gap-2 items-center px-2'>
                            <div className='flex gap-2 items-center'>
                              <p className='text-sm-body-desktop font-medium'>Loại: </p>
                              <Tag className={`bg-transparent rounded-2xl px-2 py-0.5 border text-nowrap ${PRODUCT_TYPE[product.productKind].style}`}>
                                {PRODUCT_TYPE[product.productKind].name}
                              </Tag>
                            </div>
                            <div className='flex gap-2 items-center px-2'>
                              <p className='text-sm-body-desktop font-medium'>Kiểu hộp: </p>
                              <Tag variant='primary' className='rounded-2xl px-5 text-nowrap'>
                                {PRODUCT_PACKAGE_TYPE[product.productPackagingType]}
                              </Tag>
                            </div>
                          </div>
                          <div className='flex flex-col gap-2  px-2'>
                            <p className='text-sm-body-desktop font-medium'>Dung tích: <span className='text-primary text-m-body-desktop'>{product.volumeMl}ml</span></p>
                            <p className='text-sm-body-desktop font-medium'>Hãng: <span className='text-primary text-m-body-desktop'>{product.brand}</span></p>
                          </div>
                          <div className='flex justify-end'>
                            <p className='text-xl-body-desktop text-green-accent font-medium'>{product.price.toLocaleString()}đ</p>
                          </div>
                        </div>
                      </div>
                      <div className='flex w-full gap-2 items-center my-3'>
                        <Button variant="default" onClick={() => handleOpenCreateBatch(product)} className='w-full'>
                          <PlusIcon className="size-4" />
                          Tạo lô
                        </Button>
                        <Button variant="danger" className="py-3 px-3 text-white hover:text-red-500 border-border-primary hover:bg-gray-200 w-full flex-1" onClick={() => handleOpenAlert(product.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                        <Button variant='basic' className='py-3 px-3 hover:bg-gray-200 w-fit' onClick={() => handleUpdateProductInfo(product)}>
                          <Edit2 className="size-4" />
                        </Button>
                      </div>
                      <Button variant="basic" className='' onClick={() => handleBatchShowSelect(product.id)}>
                        <LuPackageSearch />
                          Xem lô hàng
                      </Button>
                      { productForBatchId === product.id && batchDetailOpen &&
                        <>
                          { batchLoading ?
                            <CardSkeleton count={3}/>
                            :
                            <>
                              { productBatchList && productBatchList.items.length > 0 ?
                                <>
                                  <ScrollArea className='h-50 my-3 px-4'>
                                    { productBatchList.items.map((batch) => (
                                      <Card key={batch.id} className='text-sm-body-desktop my-2'>
                                        <div className='flex justify-between items-center'>
                                          <p className='text-primary font-medium'>{batch.code}</p>
                                          <p className='text-primary font-medium'>{batch.quantity} sp</p>
                                        </div>
                                        <p className='text-[0.85rem] text-soft-gray'>EXP: {formatDate(batch.expiryDate)}</p>
                                        <p className={`${countRestDay(batch.expiryDate) <= 30 ? 'text-red-500 font-medium' : 'text-soft-gray text-[0.85rem]'}`}>
                                          {countRestDay(batch.expiryDate) > 0 ? `Còn lại ${countRestDay(batch.expiryDate)} ngày` : 'Hết hạn'}
                                        </p>
                                      </Card>
                                    )) }
                                  </ScrollArea>
                                  <PaginationBar
                                    currentPage={batchCurrentPage}
                                    setPage={setBatchCurrentPage}
                                    totalPage={productBatchList.meta.total_pages}
                                  />
                                </>
                                :
                                <NodataCard content='Không có lô nào từ sản phẩm này'/>
                              }
                            </>
                          }
                        </>
                      }
                    </Card>
                  ))}

                </div>
                <div className='w-full flex justify-center mt-4'>
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
        { isOpenCreateBatch &&
        <PopupBasic title='Tạo lô sản phẩm mới' onClose={() => setIsOpenCreateBatch(false)}>
          <p className='text-sm-body-desktop text-soft-gray'>Sản phẩm: {productChoseForBatch?.name}</p>
          <div className='flex items-center gap-3 my-3'>
            <Input {...register('manuFactureDate', { valueAsDate: true })} variant='gray' label='Ngày sản xuất' type='date'/>
            <Input {...register('quantity', { valueAsNumber: true })} variant='gray' label='Số lượng sản phẩm' type='number'/>
          </div>
          <Button variant='outline' onClick={handleSubmit(handleAddBatch)} className='w-full my-2'>
            <PlusIcon/>
            Thêm lô
          </Button>
          { listBatchItems.length > 0 &&
            <>
              <p className='text-sm-body-desktop font-medium text-primary'>Danh sách lô ({listBatchItems.length})</p>
              { listBatchItems.map((batch, i) => (
                <Card key={i} className='text-sm-body-desktop my-3 bg-[#EFF6FF] border-none'>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center text-white bg-secondary w-8 aspect-square rounded-full'>{i+1}</div>
                      <div>
                        <p className='text-primary font-medium'>Lô #{i+1}</p>
                        <p>Ngày sản xuất: {formatDate(batch.manuFactureDate)} - {batch.quantity}sp</p>
                      </div>
                    </div>
                    <Button className='bg-transparent border-none text-red-400 hover:bg-gray-200' onClick={() => handleDeleteBatch(batch)}>
                      <Trash2 className='size-4'/>
                    </Button>
                  </div>
                </Card>
              )) }
              <div className='flex w-full gap-2 items-center'>
                { loadingCreateBatch ?
                  <LoadingSpinner size='lg'/>
                  :
                  <>
                    <Button variant="basic" className="py-2 px-3 hover:bg-gray-200 w-full" onClick={handleCloseCreateBatch}
                    >
                    Hủy
                    </Button>
                    <Button variant='default' className='py-2 px-3 w-full' onClick={handleCreateBatch}>
                      <FiCheckCircle className='size-4' />
                                    Tạo lô ({listBatchItems.length})
                    </Button>
                  </>
                }
              </div>
            </>
          }
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
                    <Button variant='basic' className='w-full' onClick={() => setIsOpenProductInfoEdit(false)}>Hủy</Button>
                    <Button className='w-full' onClick={handleSubmitProductInfo(onProductInfoSubmit)}>Cập nhật thông tin</Button>
                  </>
                }
              </div>
            </div>
          </PopupBasic>
        }
      </AnimatePresence>
      <AnimatePresence>
        { isOpenProductImageEdit &&
          <PopupBasic title='Cập nhật ảnh cho sản phẩm' onClose={() => setIsOpenProductImageEdit(false)}>
            <div className='text-sm-body-desktop'>
              <p className='text-soft-gray'>Cập nhật lại thông tin cơ bản của sản phẩm</p>
              <div className='flex flex-col gap-3 my-5'>
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
                <div className='w-full h-50 my-4'>
                  <p className='font-medium'>Ảnh mới</p>
                  { newImagePreview ?
                    <img src={newImagePreview} alt='product-image' className='w-full h-full object-contain'/>
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
                    <Button variant='basic' className='w-full' onClick={() => setIsOpenProductImageEdit(false)}>Hủy</Button>
                    <Button className='w-full' onClick={handleSubmitImage(onProductImageSubmit)}>Cập nhật thông tin</Button>
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

