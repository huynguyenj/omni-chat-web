import TutorialBox from '../../ui/TutorialBox'
import Tag from '@/components/ui/tag/Tag'
import Checkbox from '@/components/ui/input/Checkbox'
import Card from '@/components/ui/card/Card'
import { ScrollArea } from '@/components/ui/scrollbar/ScrollArea'
import { IoIosArrowForward } from 'react-icons/io'
import Button from '@/components/ui/button/Button'
import type { ProductDetailType } from '@/features/chat/types/product-type'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import SelectionBox from '../../ui/SelectionBox'
import type { BatchType } from '@/features/chat/types/batch-type'
import type { OrderItems, OrderReviewType } from '@/features/chat/types/order-type'
import useGetListBatchByProductId from '@/features/chat/hooks/useGetListBatchByProductId'
import BatchItem from '../BatchItem'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import { FiCheckCircle } from 'react-icons/fi'

type OrderStepTwoProps = {
   onPrevious: () => void
   onNext: () => void
   listProductSelected: ProductDetailType[]
   listProductWithOrderItems: Map<string, OrderReviewType>
   setListProductWithOrderItems: Dispatch<SetStateAction<Map<string, OrderReviewType>>>
}

export default function OrderStepTwo({
  listProductSelected,
  listProductWithOrderItems,
  setListProductWithOrderItems,
  onNext,
  onPrevious
}: OrderStepTwoProps) {
  const [productChecked, setProductChecked] = useState<ProductDetailType>()
  const [checked, setChecked] = useState(false)
  const { currentPage, listBatch, loading, setCurrentPage, setNewFilter } = useGetListBatchByProductId({ productId: productChecked?.id })
  const [listOrderItems, setListOrderItems] = useState<Map<string, OrderItems>>(new Map())
  const [listBatchChosen, setListBatchChosen] = useState<Map<string, BatchType>>(new Map())

  const handleCheckNewestBatch = () => {
    setChecked((prev) => !prev)
    setNewFilter((prevState) => !prevState)
  }

  const handleCheckProduct = (product: ProductDetailType) => {
    if (productChecked?.id === product.id) {
      setProductChecked(undefined)
      return
    }
    const newListBatchChosen = new Map()
    const newListOrderItems = new Map()
    if (listProductWithOrderItems.has(product.id)) {
      const previousProduct = listProductWithOrderItems.get(product.id)
      previousProduct?.listBatch.map((batch) => (
        newListBatchChosen.set(batch.id, batch)
      ))
      previousProduct?.orderItems.map((orderItem) => (
        newListOrderItems.set(orderItem.productBatchId, orderItem)
      ))
    }
    setListBatchChosen(newListBatchChosen)
    setListOrderItems(newListOrderItems)
    setProductChecked(product)
  }

  const handleOrderItemSelected = (batch: BatchType) => {
    const newListItems = new Map(listOrderItems)
    const newListBatchChosen = new Map(listBatchChosen)
    if (newListItems.has(batch.id)) {
      newListItems.delete(batch.id)
      newListBatchChosen.delete(batch.id)
      setListOrderItems(newListItems)
      setListBatchChosen(newListBatchChosen)
      return
    }
    newListItems.set(batch.id, { productBatchId: batch.id, quantity: 1 })
    newListBatchChosen.set(batch.id, batch)
    setListOrderItems(newListItems)
    setListBatchChosen(newListBatchChosen)
  }

  const handleValidateData = () => {
    if (listProductWithOrderItems.size == 0) return true
    if (listProductWithOrderItems.size !== listProductSelected.length) return true
    return Array.from(listProductWithOrderItems.values()).map((product) => {
      if (product.orderItems.length === 0) return false
      if (product.listBatch.length === 0) return false
      return true
    }).includes(false) ? true: false
  }

  useEffect(() => {
    if (!productChecked) return
    const handleSetOrderReview = () => {
      const newProductList = new Map(listProductWithOrderItems)

      newProductList.set(productChecked?.id, { ...productChecked, listBatch: Array.from(listBatchChosen.values()), orderItems: Array.from(listOrderItems.values()) })
      setListProductWithOrderItems(newProductList)
    }
    handleSetOrderReview()
  }, [listBatchChosen, listOrderItems, productChecked])

  const handleCheckProductHasOrderItems = (productId: string) => {
    if (!listProductWithOrderItems.has(productId)) return false
    if (listProductWithOrderItems.get(productId)?.orderItems.length) return true
  }

  console.log(listProductWithOrderItems);
  
  return (
    <div id='index#2'>
      <div className='mt-7'>
        <TutorialBox step='Bước 2: Chọn lô hàng & Số lượng' description='Chọn lô hàng và nhập số lượng mong muốn'/>
        { listProductSelected.length > 0 &&
            <>
              <p className='text-sm-body-desktop text-primary font-medium mt-3'>Sản phẩm đã chọn ({listProductSelected.length})</p>
              { listProductSelected.length > 0 &&
                <ScrollArea className='h-120 px-4'>
                  {listProductSelected.map((product) => (
                    <>
                      <SelectionBox isChosen={productChecked?.id === product.id} className={`justify-start px-5 py-4 rounded-xl my-3 hover:border-2 hover:border-gray-300 ${productChecked?.id !== product.id && handleCheckProductHasOrderItems(product.id) && 'border-green-accent bg-[#F0FDF4]'}`} onClick={() => handleCheckProduct(product)}>
                        <div className='flex gap-3 items-center'>
                          { handleCheckProductHasOrderItems(product.id) &&
                          <Tag variant='success' className='w-6 aspect-square rounded-full px-0 py-0'><FiCheckCircle className='size-5'/></Tag>
                          }
                          <div className='text-sm-body-desktop'>
                            <p className='text-primary font-medium text-sm/7'>
                              {product.brand} - {product.name}
                            </p>
                            { listProductWithOrderItems && listProductWithOrderItems.get(product.id)?.orderItems &&
                              <p className='font-normal text-soft-gray'>{listProductWithOrderItems.get(product.id)?.orderItems.length} lô <span>.</span> {listProductWithOrderItems.get(product.id)?.orderItems.reduce((total, item) => {
                                return item.quantity + total
                              }, 0)}sp</p>
                            }
                          </div>
                        </div>
                      </SelectionBox>
                      {productChecked?.id === product.id &&
                      <Card>
                        <div className='flex items-center gap-3 my-4 bg-[#F5F7FA] py-3 px-4 rounded-xl'>
                          <Checkbox id='check-batch' onCheckedChange={handleCheckNewestBatch} checked={checked}/>
                          <div>
                            <label htmlFor="check-batch" className='text-sm-body-desktop font-semibold text-primary'>Tự động chọn lô hàng mới nhất (FIFO)</label>
                            <p className='text-[0.85rem] text-soft-gray'>Hệ thống sẽ tự động chọn lô có hạn sử dụng xa nhất</p>
                          </div>
                        </div>
                        <p className='text-sm-body-desktop text-primary font-medium'>Chọn lô hàng (có thể chọn nhiều)</p>
                        { listBatch && listBatch.items.length > 0 &&
                          <>
                            <ScrollArea className='h-90 px-5'>
                              { loading ?
                                <CardSkeleton count={3}/>
                                :
                                <>
                                  {listBatch.items.map((batch, i) => (
                                    <BatchItem
                                      key={batch.id}
                                      batch={batch}
                                      isSelected={listBatchChosen.has(batch.id)}
                                      listOrderItems={listOrderItems}
                                      setListOrderItems={setListOrderItems}
                                      onSelect={() => handleOrderItemSelected(batch)}
                                      showQuantity={listOrderItems.has(batch.id)}
                                      isNewestBoxChecked={checked}
                                      indexItem={i}
                                    />
                                  ))}
                                </>
                              }

                            </ScrollArea>
                            <PaginationBar
                              currentPage={currentPage}
                              setPage={setCurrentPage}
                              totalPage={listBatch.meta.total_pages}
                            />
                          </>
                        }
                      </Card>
                      }
                    </>
                  ))}
                </ScrollArea>
              }
            </>
        }
      </div>
      <div className='flex gap-2 mt-3'>
        <Button variant='outline' className='w-full font-bold border-2 border-border-primary text-black hover:bg-gray-100' onClick={onPrevious}>
                  Quay lại
        </Button>
        <Button className={`w-full font-bold ${handleValidateData() && 'opacity-50'}`} onClick={onNext} disabled={handleValidateData()}>
                  Tiếp theo
          <IoIosArrowForward/>
        </Button>
      </div>
    </div>
  )
}
