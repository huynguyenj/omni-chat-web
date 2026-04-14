import PopupBasic from '@/components/ui/popup/PopupBasic'
import type { ProductDetailType } from '../../types/product-type'
import { useEffect, useState } from 'react'
import TutorialBox from '../ui/TutorialBox'
import Card from '@/components/ui/card/Card'
import Tag from '@/components/ui/tag/Tag'
import Checkbox from '@/components/ui/input/Checkbox'
import SelectionBox from '../ui/SelectionBox'
import { IoIosArrowForward, IoMdCheckmarkCircleOutline } from 'react-icons/io'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import OrderReview from './OrderReview'
import { LuCircleCheckBig } from 'react-icons/lu'
import useGetListBatchByProductId from '../../hooks/useGetListBatchByProductId'
import type { BatchType } from '../../types/batch-type'
import { formatDate } from '@/utils/date-resolver'
import NodataCard from '@/components/ui/card/NodataCard'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '../../context/SelectionMessageProvider'
import useCreateOrder from '../../hooks/useCreateOrder'
import { toast } from 'react-toastify'
import type { OrderRequestType } from '../../types/order-type'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'

type CreateOrderSearchSectionProps = {
  handleOpenCreate: () => void
  product: ProductDetailType
}

export default function CreateOrderSearchSection({ handleOpenCreate, product }: CreateOrderSearchSectionProps) {
  const [index, setIndex] = useState(1)
  const [checked, setChecked] = useState(true)
  const { listBatch, loading, setCurrentPage, currentPage } = useGetListBatchByProductId({ productId: product.id })
  const [batchChosen, setBatchChosen] = useState<BatchType>()
  const [totalBatch, setTotalBatch] = useState(1)
  const context = useContextValid(SelectionMessageContext)
  const { handleOrder, loading: orderLoading } = useCreateOrder()
  const handleChecked = () => {
    setChecked((prev) => !prev)
  }
  const handlePrev = () => {
    if (index == 1) return
    setIndex((page) => page - 1)
  }
  const handleNext = () => {
    if (index == 4) return
    setIndex((page) => page + 1)
  }
  const handleSelectBatch = (batch: BatchType) => {
    if (batch.id != batchChosen?.id) {
      setTotalBatch(0)
    }
    setBatchChosen(batch)
  }

  useEffect(() => {
    const handleNewestChecked = () => {
      if (checked) {
        setBatchChosen(listBatch?.items[0])
      }
    }
    handleNewestChecked()
  }, [listBatch, checked])

  const handleOrderProduct = () => {
    if (!context.customerId) {
      toast.error('Không nhận đưa id khách hàng')
      return
    }
    if (!batchChosen) {
      toast.error('Lô sản phẩm chưa được chọn')
      return
    }
    const fullOrderBody: OrderRequestType = {
      customerId: context.customerId,
      name: product.name,
      orderItems: [
        { productBatchId: batchChosen.id, quantity: totalBatch }
      ]
    }
    handleOrder(fullOrderBody)
  }
  return (
    <PopupBasic title='Đặt hàng' onClose={handleOpenCreate}>
      { index == 1 &&
                  <div id='index#2'>
                    <div className='mt-7'>
                      <TutorialBox step='Bước 1: Chọn lô hàng & Số lượng' description='Chọn lô hàng và nhập số lượng mong muốn'/>
                      <Card className='bg-[#EFF6FF] border-2 border-[#C9D9F5] rounded-xl my-5'>
                        <p className='text-sm-body-desktop text-soft-gray'>Sản phẩm đã chọn</p>
                        <p className='text-sm-body-desktop text-primary font-medium text-sm/7'>{product.name}</p>
                        <div className='flex items-center gap-3 my-2'>
                          {/* <Tag className={`bg-transparent rounded-2xl px-2 py-0.5 border-2 ${PRODUCT_TYPE[product.type].style}`}>
                            {PRODUCT_TYPE[product.type].name}
                          </Tag> */}
                          <Tag className='bg-transparent border-2 rounded-2xl px-2 py-0.5 text-secondary font-medium border-secondary'>
                            {product.volumeMl}ml
                          </Tag>
                          <p className='text-sm-body-desktop text-soft-gray'>Tồn kho: <span className='font-medium text-primary'>{product.quantity}</span></p>
                        </div>
                      </Card>
                      <div className='flex items-center gap-3 my-4 bg-[#F5F7FA] py-3 px-4 rounded-xl'>
                        <Checkbox id='check-batch' onCheckedChange={handleChecked} checked={checked}/>
                        <div>
                          <label htmlFor="check-batch" className='text-sm-body-desktop font-semibold text-primary'>Tự động chọn lô hàng mới nhất (FIFO)</label>
                          <p className='text-[0.85rem] text-soft-gray'>Hệ thống sẽ tự động chọn lô có hạn sử dụng xa nhất</p>
                        </div>
                      </div>
                      { loading ?
                        <CardSkeleton/>
                        :
                        <>
                          {listBatch && listBatch.items.length > 0 ?
                            <div>
                              { checked ?
                                <SelectionBox
                                  id={batchChosen?.id}
                                  className='flex flex-col px-4 py-3 my-2'
                                  isChosen={batchChosen?.id ? true : false }>
                                  <div className='w-full flex flex-col mb-3'>
                                    <div className='w-full flex gap-3'>
                                      <IoMdCheckmarkCircleOutline className='size-6'/>
                                      <div className='flex justify-between items-start w-full'>
                                        <div className='flex items-start gap-2'>
                                          <div>
                                            <p className='text-sm-body-desktop font-medium text-primary'>Lô: {batchChosen?.code}</p>
                                            <p className='text-sm-body-desktop text-soft-gray font-normal'>HSD: {batchChosen ? formatDate(batchChosen.expiryDate) : ''}</p>
                                          </div>
                                          <Tag variant='primary' className='py-0.5 px-3 text-[0.85rem]'>Mới nhất</Tag>
                                        </div>
                                        <Tag variant='success' className='py-0.5 px-3 flex items-center'>
                                          <p className='text-[0.85rem] text-center font-medium'>Tồn: {batchChosen?.quantity}</p>
                                        </Tag>
                                      </div>
                                    </div>
                                  </div>
                                  <hr className='border-2 border-border-primary my-2 w-full'/>
                                  <Input label='Số lượng muốn mua' variant='gray' placeholder='1' type='number' onChange={(e) => setTotalBatch(Number(e.target.value))} className='w-[20%] text-center text-black shadow-[0px_2px_1px_1px_rgba(0,0,0,0.1)]'/>
                                </SelectionBox>
                                :
                                <>
                                  <p className='text-sm-body-desktop text-primary font-medium mt-2'>Chọn lô hàng theo HSD</p>
                                  { listBatch?.items.map((batch) => (
                                    <SelectionBox
                                      id={batch.id}
                                      className='flex items-start gap-3 px-4 py-3 my-2'
                                      isChosen={batch.id == batchChosen?.id ? true : false }
                                      onClick={() => handleSelectBatch(batch)}>
                                      { batchChosen?.id === batch.id && <IoMdCheckmarkCircleOutline className='size-6'/>}
                                      <div className='flex flex-col w-full'>
                                        <div className='w-full flex flex-col mb-3'>
                                          <div className='w-full flex gap-3'>
                                            <div className='flex justify-between items-start w-full'>
                                              <div className='flex items-start gap-2'>
                                                <div>
                                                  <p className='text-sm-body-desktop font-medium text-primary'>Lô: {batch.code}</p>
                                                  <p className='text-sm-body-desktop text-soft-gray font-normal'>HSD: {formatDate(batch.expiryDate)}</p>
                                                </div>
                                                <Tag variant='primary' className='py-0.5 px-3 text-[0.85rem]'>Mới nhất</Tag>
                                              </div>
                                              <Tag variant='success' className='py-0.5 px-3 flex items-center'>
                                                <p className='text-[0.85rem] text-center font-medium'>Tồn: {batch.quantity}</p>
                                              </Tag>
                                            </div>
                                          </div>
                                        </div>
                                        { batchChosen?.id === batch.id &&
                                  <>
                                    <hr className='border-2 border-border-primary my-2 w-full'/>
                                    <Input label='Số lượng muốn mua' variant='gray' placeholder='1' type='number' onChange={(e) => setTotalBatch(Number(e.target.value))} className='w-[20%] text-center text-black shadow-[0px_2px_1px_1px_rgba(0,0,0,0.1)]'/>
                                  </>
                                        }
                                      </div>
                                    </SelectionBox>
                                  )) }
                                </>
                              }
                              <PaginationBar
                                currentPage={currentPage}
                                setPage={setCurrentPage}
                                totalPage={listBatch.meta.total_pages}
                              />
                            </div>
                            :
                            <NodataCard content='Sản phẩm này chưa có lô hàng'/>
                          }
                        </>
                      }

                      {/* <Input label='Ngày giao hàng' type='date' variant='gray' onChange={(e) => setDateOfShipment(e.target.value)}/> */}
                    </div>
                    <div className='flex gap-2 mt-3'>
                      <Button variant='outline' className='w-full font-bold border-2 border-border-primary text-black hover:bg-gray-100' onClick={handlePrev}>
                        Quay lại
                      </Button>
                      <Button className={`w-full font-bold ${!batchChosen && 'opacity-50'}`} onClick={handleNext} disabled={batchChosen ? false : true}>
                        Tiếp theo
                        <IoIosArrowForward/>
                      </Button>
                    </div>
                  </div>
      }
      { index == 2 &&
                    <div id='index#3'>
                      <div className='mt-7'>
                        <TutorialBox step='Bước 2: Xác nhận đơn hàng' description='Kiểm tra lại thông tin khi tạo đơn'/>
                        <OrderReview
                          batchCode={batchChosen?.code}
                          batchDate={batchChosen? formatDate(batchChosen.expiryDate) : 'Chưa có hạn sử dụng'}
                          capacityProduct={product.volumeMl}
                          productName={product.name}
                          // shipDate={dateOfShipment}
                          totalPrice={product.price}
                          // totalProduct={numberOfProduct}
                          totalBatch={totalBatch}
                        //   typeProduct={product.type}
                        />
                      </div>
                      { orderLoading ?
                        <div className='flex justify-center items-center w-full'>
                          <LoadingSpinner size='lg'/>
                        </div>
                        :
                        <div className='flex gap-2'>
                          <Button variant='outline' className='w-full font-bold border-2 border-border-primary text-black hover:bg-gray-100' onClick={handlePrev}>
                              Quay lại
                          </Button>
                          <Button variant='success' className='w-full font-bold items-center' onClick={handleOrderProduct}>
                            <LuCircleCheckBig/>
                              Tạo đơn hàng
                          </Button>
                        </div>
                      }
                    </div>
      }
    </PopupBasic>
  )
}
