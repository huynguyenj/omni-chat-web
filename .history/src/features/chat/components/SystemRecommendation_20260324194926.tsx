
import Button from '@/components/ui/button/Button'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import { useMemo, useState } from 'react'
import { BsStars } from 'react-icons/bs'
import { LuCircleCheckBig, LuPackage } from 'react-icons/lu'
import type { Recommendation } from '../types/system-recommendation-type'
import { MdHistory } from 'react-icons/md'
import type { ProductType } from '../types/product-type'
import type { OrderType } from '../types/order-type'
import Card from '@/components/ui/card/Card'
import Tag from '@/components/ui/tag/Tag'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { AnimatePresence } from 'motion/react'
import TutorialBox from './ui/TutorialBox'
import Select from '@/components/ui/select/Select'
import Input from '@/components/ui/input/Input'
import { IoIosArrowForward } from 'react-icons/io'
import SelectionBox from './ui/SelectionBox'
import { GiCheckMark } from 'react-icons/gi'
import Checkbox from '@/components/ui/input/Checkbox'
import { ScrollArea } from '@/components/ui/scrollbar/ScrollArea'
import OrderReview from './OrderReview'


function ProductButton({ productData }: { productData: ProductType}) {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  return (
    <>
      <Button variant='outline' className='rounded-2xl py-2 border border-border-secondary hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleOpen}>
        <LuPackage className='text-[1.25rem]'/>
        Tra cứu thông tin sản phẩm
      </Button>
      <AnimatePresence>

        { isOpen &&
            <PopupBasic title='Thông tin sản phẩm' onClose={handleOpen}>
              <p className='text-gray-400 text-sm-body-desktop'>Thông tin sản phẩm</p>
              <div className='flex gap-15 items-center mt-3'>
                <div>
                  <p className='text-sm-body-desktop text-gray-400'>Tên sản phẩm</p>
                  <p className='text-sm-body-desktop font-bold text-primary'>{productData.productName}</p>
                </div>
                <div>
                  <p className='text-sm-body-desktop text-gray-400'>Mã sản phẩm</p>
                  <p className='text-sm-body-desktop font-bold text-primary'>{productData.productCode}</p>
                </div>
              </div>
              <hr className='border border-gray-100 my-5'/>
              <div className='flex flex-col gap-5'>
                <p className='text-gray-400 text-sm-body-desktop'>Ảnh sản phẩm</p>
                <img src={productData.productImageUrl} alt="product image" className='w-50 h-40' />
              </div>
            </PopupBasic>
        }
      </AnimatePresence>
    </>
  )
}

function OrderHistoryButton({ orderHistoryData }: { orderHistoryData: OrderType }) {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  const tag = (status: string) => {
    switch (status) {
    case 'Đã giao': return <Tag className="text-[0.75rem] text-white font-bold" variant='success'>Đã giao </Tag>
    case 'Đang giao': return <Tag className="text-[0.75rem] text-white font-bold" variant='primary'>Đang giao</Tag>

    }
  }
  return (
    <>
      <Button variant='outline' className='rounded-2xl py-2 border border-border-secondary hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleOpen}>
        <MdHistory className='text-[1.25rem]'/>
        Lịch sử đơn hàng
      </Button>
      <AnimatePresence>
        { isOpen &&
            <PopupBasic title='Thông tin sản phẩm' onClose={handleOpen}>
              <p className='text-gray-400'>Lịch sử mua hàng của khách hàng</p>
              <Card className='mt-3'>
                <div className="flex items-center justify-between">
                  <p className="text-m-body-desktop text-primary font-bold">{orderHistoryData.orderId}</p>
                  {tag(orderHistoryData.deliveryStatus)}
                </div>
                <div className="bg-gray-100 py-1 px-3 rounded-[5px] my-10">
                  <p className="text-sm-body-desktop text-gray-600">{orderHistoryData.orderName}</p>
                </div>
                <hr className="text-gray-200 mb-3"/>
                <div className="flex justify-between items-center">
                  <p className="text-sm-body-desktop text-gray-500">Số lượng: </p>
                  <p className="text-sm-body-desktop text-primary font-bold">{orderHistoryData.totalAmount.toLocaleString('vi-VN')}đ</p>
                </div>
              </Card>
            </PopupBasic>
        }
      </AnimatePresence>
    </>
  )
}

// function CustomerProfileButton({ customerData }: { customerData: CustomerType }) {
//   const [isOpen, setIsOpen] = useState(false)
//   const handleOpen = () => {
//     setIsOpen((prev) => !prev)
//   }
//   return (
//     <>
//       <Button variant='outline' className='rounded-2xl py-2 border border-blue-200 hover:bg-secondary hover:text-white hover:border-none gap-2'>
//         <IoPersonCircleOutline className='text-[1.25rem]'/>
//         Thông tin khách hàng
//       </Button>
//       { isOpen &&
//         <PopupBasic title='Thông tin sản phẩm' onClose={handleOpen}>
//         </PopupBasic>
//       }
//     </>
//   )
// }

type ProductListType = {
  name: string
  storage: number
  productId: string
  price: number
  category: 'sour' | 'have' | 'not'
  capacity: number[]
}
const listProducts: ProductListType[] = [
  // Vinamilk (3)
  { name: 'Vinamilk', capacity: [180, 490, 880, 1760], category: 'not', price: 32000, productId: 'VNM-N-01', storage: 286 },
  { name: 'Vinamilk', capacity: [180, 490, 880], category: 'have', price: 33000, productId: 'VNM-H-02', storage: 220 },
  { name: 'Vinamilk', capacity: [180, 490], category: 'sour', price: 30000, productId: 'VNM-S-03', storage: 168 },

  // TH True Milk (3)
  { name: 'TH True Milk', capacity: [180, 490, 880, 1760], category: 'not', price: 35000, productId: 'THM-N-01', storage: 195 },
  { name: 'TH True Milk', capacity: [180, 490, 880], category: 'have', price: 36000, productId: 'THM-H-02', storage: 174 },
  { name: 'TH True Milk', capacity: [180, 490], category: 'sour', price: 34000, productId: 'THM-S-03', storage: 142 },

  // Dalat Milk (3)
  { name: 'Dalat Milk', capacity: [180, 490, 880, 1760], category: 'not', price: 31000, productId: 'DLM-N-01', storage: 210 },
  { name: 'Dalat Milk', capacity: [180, 490, 880], category: 'have', price: 32000, productId: 'DLM-H-02', storage: 184 },
  { name: 'Dalat Milk', capacity: [180, 490], category: 'sour', price: 29500, productId: 'DLM-S-03', storage: 153 }

]

type ProductCategoryType = {
  id: string
  name: string
}

const listCategories: ProductCategoryType[] = [
  { id: 'goajgorewg', name: 'Vinamilk' },
  { id: 'agwojgowg', name: 'TH True Milk' },
  { id: 'agwjgowga', name: 'Dalat Milk' },
  { id: 'gajgowgag', name: 'Ông thọ' }
]

type BatchesType = {
  batchId: string
  date: string
  storage: number
}

const listBatches: BatchesType[] = [
  { batchId: 'LOT20260125', date: '25/03/2026', storage: 120 },
  { batchId: 'LOT20260122', date: '22/03/2026', storage: 89 },
  { batchId: 'LOT20260118', date: '18/03/2026', storage: 71 }
]

function OrderButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(1)
  const [typeProduct, setTypeProduct] = useState<{ type: 'sour' | 'have' | 'not' }>()
  const [capacityProduct, setCapacityProduct] = useState<{ capacity: 180 | 490 | 880 | 1760 }>()
  const [batchChosen, setBatchChosen] = useState<BatchesType>(listBatches[0])
  const [checked, setChecked] = useState(false)
  const [product, setProduct] = useState<ProductListType>()
  const [numberOfProduct, setNumberOfProduct] = useState(1)
  const [dateOfShipment, setDateOfShipment] = useState<string>()
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  const handleSelectProduct = (productId: string) => {
    const product = listProducts.find((product) => product.productId === productId)
    setProduct(product)
  }
  const handlePrev = () => {
    if (index == 1) return
    setIndex((page) => page - 1)
  }
  const handleNext = () => {
    if (index == 4) return
    setIndex((page) => page + 1)
  }
  const handleSelectTypeProduct = (type: typeof typeProduct) => {
    if (type == typeProduct?.type) setTypeProduct(undefined)
    setTypeProduct(type)
  }
  const handleSelectCapacity = (capacity: typeof capacityProduct) => {
    if (capacity == capacityProduct?.capacity) setCapacityProduct(undefined)
    setCapacityProduct(capacity)
  }
  const handleChecked = () => {
    setChecked((prev) => !prev)
    setBatchChosen(listBatches[0])
  }

  const filterProductList = useMemo(() => {
    return listProducts.filter((product) => {
      const matchCapacity = capacityProduct
        ? product.capacity.includes(capacityProduct.capacity)
        : true
      const matchType = typeProduct
        ? product.category === typeProduct.type
        : true
      return matchCapacity && matchType
    })
  }, [typeProduct, capacityProduct])
  return (
    <>
      <Button variant='outline' className='rounded-2xl py-2 border border-border-secondary hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleOpen}>
        <MdOutlineShoppingCart/>
          Tạo đơn hàng mới
      </Button>
      <AnimatePresence>
        {isOpen &&
          <PopupBasic title='Tạo đơn hàng mới' onClose={handleOpen}>
            <div className='flex gap-2 items-center my-5'>
              <div className={`text-soft-gray flex items-center gap-2 ${index === 1 && 'text-secondary'}`}>
                <div className={`flex items-center justify-center bg-gray-200 font-medium rounded-full w-8 h-8  ${index === 1 && 'text-white bg-secondary'}`}>1</div>
                <p className={`text-sm-body-desktop ${index === 1 && 'font-medium text-secondary'}`}>Chọn SP</p>
              </div>
              <hr className='border-2 border-border-primary w-10'/>
              <div className={`text-soft-gray flex items-center gap-2 ${index === 2 && 'text-secondary'}`}>
                <div className={`flex items-center justify-center bg-gray-200 font-medium rounded-full w-8 h-8  ${index === 2 && 'text-white bg-secondary'}`}>2</div>
                <p className={`text-sm-body-desktop ${index === 2 && 'font-medium text-secondary'}`}>Chọn Lô</p>
              </div>
              <hr className='border-2 border-border-primary w-10'/>
              <div className={`text-soft-gray flex items-center gap-2 ${index === 3 && 'text-secondary'}`}>
                <div className={`flex items-center justify-center bg-gray-200 font-medium rounded-full w-8 h-8  ${index === 3 && 'text-white bg-secondary'}`}>3</div>
                <p className={`text-sm-body-desktop ${index === 3 && 'font-medium text-secondary'}`}>Xác nhận</p>
              </div>
            </div>
            { index == 1 &&
            <div id='index#1'>
              <div className='mt-7'>
                <TutorialBox step='Bước 1: Chọn sản phẩm sữa' description='Hãy chọn sản phẩm khách hàng muốn đặt'/>
                <div className='my-5'>
                  <label htmlFor="select-product" className='text-primary text-sm-body-desktop font-medium'>Tên hãng</label>
                  <Select id='select-product' className='border border-border-primary mt-2' onChange={(e) => handleSelectProduct(e.target.value)}>
                    <option value="">Tất cả các hãng</option>
                    {listCategories.map((category) => (
                      <option id={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Select>
                </div>
                <div className='my-5'>
                  <label htmlFor="select-capacity" className='text-primary text-sm-body-desktop font-medium'>Dung tích / Khối lượng</label>
                  <div className='grid grid-cols-4 gap-3 mt-2' id='select-capacity'>
                    <SelectionBox
                      isChosen={capacityProduct?.capacity == 180 ? true : false}
                      onClick={() => handleSelectCapacity({ capacity: 180 })}
                    >
                      <p className="text-sm-body-desktop">180ml</p>
                    </SelectionBox>
                    <SelectionBox
                      isChosen={capacityProduct?.capacity == 490 ? true : false}
                      onClick={() => handleSelectCapacity({ capacity: 490 })}
                    >
                      <p className="text-sm-body-desktop">490 ml</p>
                    </SelectionBox>
                    <SelectionBox
                      isChosen={capacityProduct?.capacity == 880 ? true : false}
                      onClick={() => handleSelectCapacity({ capacity: 880 })}
                    >
                      <p className="text-sm-body-desktop">880 ml</p>
                    </SelectionBox>
                    <SelectionBox
                      isChosen={capacityProduct?.capacity == 1760 ? true : false}
                      onClick={() => handleSelectCapacity({ capacity: 1760 })}
                    >
                      <p className="text-sm-body-desktop">1760 ml</p>
                    </SelectionBox>
                  </div>
                </div>
                <div className='my-1'>
                  <label htmlFor="select-type" className='text-primary text-sm-body-desktop font-medium'>Loại</label>
                  <div id='select-type' className='grid grid-cols-3 gap-3 mt-2'>
                    <SelectionBox
                      isChosen={typeProduct?.type == 'not' ? true : false}
                      onClick={() => handleSelectTypeProduct({ type: 'not' })}
                    >
                      <p className="text-sm-body-desktop">Không đường</p>
                    </SelectionBox>
                    <SelectionBox
                      content='Có đường'
                      isChosen={typeProduct?.type == 'have' ? true : false}
                      onClick={() => handleSelectTypeProduct({ type: 'have' })}
                    >
                      <p className="text-sm-body-desktop">Có đường</p>
                    </SelectionBox>
                    <SelectionBox
                      content='Sữa chua'
                      isChosen={typeProduct?.type == 'sour' ? true : false}
                      onClick={() => handleSelectTypeProduct({ type: 'sour' })}
                    >
                      <p className="text-sm-body-desktop">Sữa chua</p>
                    </SelectionBox>
                  </div>
                </div>
                <Input label='Số lượng' variant='gray' type='number' onChange={(e) => setNumberOfProduct(Number(e.target.value))}/>
                <div className='flex justify-between items-center my-3'>
                  <p className='text-sm-body-desktop font-medium text-primary'>Sản phẩm phù hợp</p>
                  <p className='text-sm-body-desktop text-soft-gray bg-gray-200 rounded-md px-2 py-1'>{filterProductList.length} sản phẩm</p>
                </div>
                <ScrollArea className='h-60'>
                  { filterProductList.map((product) => (
                    <Card key={product.productId} className='border-2 border-border-primary px-5 py-3 my-3'>
                      <div className='flex gap-2 items-center'>
                        <p className='text-sm-body-desktop text-primary font-medium'>{product.name}</p>
                        <Tag className={`px-2 py-1 border ${product.category === 'sour' ? ' border-[#C27AFF] text-[#9810FA]'
                          : product.category === 'have' ? 'border-[#FF8904] text-[#F54E06]'
                            : 'border-[#00C950] text-green-accent'}`}>
                          {product.category === 'sour' ? 'Sữa chua'
                            : product.category === 'have' ? 'Có đường'
                              : 'Không đường'}
                        </Tag>
                      </div>
                      <div className='flex gap-2 my-2'>
                        {product.capacity.map((cap) => (
                          <Tag key={cap} className='bg-gray-100 border-none text-soft-gray rounded-sm font-normal'>
                            {cap}ml
                          </Tag>
                        ))}
                      </div>
                      <div className='flex gap-3'>
                        <p className='text-sm-body-desktop text-green-accent font-bold'>{product.price.toLocaleString('vi-VN')}</p>
                        <p className='text-sm-body-desktop text-soft-gray font-medium'>Tồn kho: <span className='text-primary'>{product.storage}</span></p>
                      </div>
                    </Card>
                  )) }
                </ScrollArea>
              </div>
              <Button className='w-full font-bold mt-5' onClick={handleNext}>
                  Tiếp theo
                <IoIosArrowForward/>
              </Button>
            </div>
            }
            { index == 2 &&
            <div id='index#2'>
              <div className='mt-7'>
                <TutorialBox step='Bước 3: Hạn sử dụng và ngày giao' description='Chọn lô hàng và ngày giao hàng'/>
                <div className='flex items-center gap-2 my-4'>
                  <Checkbox id='check-batch' onCheckedChange={handleChecked}/>
                  <label htmlFor="check-batch" className='text-sm-body-desktop font-semibold text-primary'>Tự động chọn lô hàng mới nhất (FIFO)</label>
                </div>
                <div>

                  { checked ?
                    <Tag variant='success' className='bg-[#F0FDF4] border border-[#D0FBDE] py-3 justify-start gap-2 my-5'>
                      <GiCheckMark className='text-sm-body-desktop text-[#1E7948]'/>
                      <p className='text-sm-body-desktop font-normal text-[#1E7948]'>Sẽ tự động chọn lô hàng: <span className='font-bold'>{batchChosen.batchId}</span> (HSD: {batchChosen.date})</p>
                    </Tag>
                    :
                    <>
                      <p className='text-sm-body-desktop text-primary font-medium mt-2'>Chọn lô hàng theo HSD</p>
                      { listBatches.map((batch) => (
                        <SelectionBox
                          id={batch.batchId}
                          className='px-4 py-3 my-2'
                          isChosen={batch.batchId == batchChosen.batchId ? true : false }
                          onClick={() => setBatchChosen(batch)}>
                          <div className='w-full flex flex-col'>
                            <div className='w-full flex items-center justify-between'>
                              <p className='text-m-body-desktop font-medium text-primary'>Lô: {batch.batchId}</p>
                              <Tag variant='success' className='py-1 flex items-center'>
                                <p className='text-[0.85rem] text-center font-medium'>Tồn:{batch.storage}</p>
                              </Tag>
                            </div>
                            <p className='text-sm-body-desktop text-soft-gray'>HSD: {batch.date}</p>
                          </div>
                        </SelectionBox>
                      )) }
                    </>
                  }
                </div>
                <Input label='Ngày giao hàng' type='date' variant='gray' onChange={(e) => setDateOfShipment(e.target.value)}/>
              </div>
              <div className='flex gap-2 mt-3'>
                <Button variant='outline' className='w-full font-bold border-2 border-border-primary text-black hover:bg-gray-100' onClick={handlePrev}>
                  Quay lại
                </Button>
                <Button className='w-full font-bold' onClick={handleNext}>
                  Tiếp theo
                  <IoIosArrowForward/>
                </Button>
              </div>
            </div>
            }
            { index == 3 &&
            <div id='index#4'>
              <div id='index#2'>
                <div className='mt-7'>
                  <TutorialBox step='Bước 4: Xác nhận đơn hàng' description='Kiểm tra lại thông tin khi tạo đơn'/>
                  <OrderReview
                    batch={batchChosen.batchId}
                    batchDate={batchChosen.date}
                    capacityProduct={capacityProduct?.capacity}
                    productName={product?.name}
                    shipDate={dateOfShipment}
                    totalPrice={30000}
                    totalProduct={numberOfProduct}
                    typeProduct={typeProduct?.type}
                  />
                </div>
                <div className='flex gap-2'>
                  <Button variant='outline' className='w-full font-bold border-2 border-border-primary text-black hover:bg-gray-100' onClick={handlePrev}>
                  Quay lại
                  </Button>
                  <Button variant='success' className='w-full font-bold items-center'>
                    <LuCircleCheckBig/>
                  Tạo đơn hàng
                  </Button>
                </div>
              </div>
            </div>
            }
          </PopupBasic>
        }
      </AnimatePresence>
    </>
  )
}

export default function SystemRecommendation({ recommends }: { recommends?: Recommendation[] }) {
  const button = (recommend: Recommendation) => {
    //     if (recommend.recommendType === 'SearchCustomerInfo')
    //       return <CustomerProfileButton customerData={recommend.data} />

    if (recommend.recommendType === 'SearchOrderHistory')
      return <OrderHistoryButton orderHistoryData={recommend.data} />

    if (recommend.recommendType === 'SearchProduct')
      return <ProductButton productData={recommend.data} />
  }
  return (
    <div className="py-2 px-3 bg-linear-to-r from-blue-100 to-[#F9F5FF] border border-border-secondary rounded-lg mb-2 min-w-90">
      <div className="flex items-center gap-2">
        <BsStars className="text-secondary"/>
        <p className="text-sm-body-desktop text-primary">Gợi ý từ hệ thống</p>
      </div>
      <div className='grid grid-cols-2 items-center justify-center mt-2'>
        { recommends?.map((data) => (
          <div key={data.recommendType} className='mt-1'>
            {button(data)}
          </div>
        )) }
        <OrderButton/>
      </div>
    </div>
  )
}
