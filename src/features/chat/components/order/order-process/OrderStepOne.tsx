import TutorialBox from '../../ui/TutorialBox'
import Select from '@/components/ui/select/Select'
import SelectionBox from '../../ui/SelectionBox'
import Tag from '@/components/ui/tag/Tag'
import Card from '@/components/ui/card/Card'
import { ScrollArea, ScrollBar } from '@/components/ui/scrollbar/ScrollArea'
import Button from '@/components/ui/button/Button'
import useGetAllBrand from '@/features/chat/hooks/useGetAllBrand'
import useGetProductForOrderProcess from '@/features/chat/hooks/useGetProductForOrderProcess'
import NodataCard from '@/components/ui/card/NodataCard'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { PRODUCT_TYPE } from '@/features/chat/const/product-type'
import { IoIosArrowForward, IoMdCheckmarkCircleOutline, IoMdClose } from 'react-icons/io'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import type { ProductDetailType } from '@/features/chat/types/product-type'
import { FaMinus, FaPlus } from 'react-icons/fa6'

type OrderStepOneProps = {
   onNextStep: () => void
   listProductSelected: ProductDetailType[]
   setListProductSelected: Dispatch<SetStateAction<ProductDetailType[]>>
}

export default function OrderStepOne({ onNextStep, setListProductSelected, listProductSelected }: OrderStepOneProps) {
  const { listBrand } = useGetAllBrand()
  const { loading, productList, productKind, productVolume, setProductBrand, setProductKind, setProductVolume } = useGetProductForOrderProcess()
  const [listProductChose, setListProductChose] = useState<Map<string, ProductDetailType>>(() => {
    const map = new Map<string, ProductDetailType>()
    listProductSelected.forEach(product => {
      map.set(product.id, product)
    })
    return map
  })
  const handleSelectedProduct = (product: ProductDetailType) => {
    const newListProductId = new Map(listProductChose)
    if (listProductChose.has(product.id)) {
      newListProductId.delete(product.id)
      setListProductChose(newListProductId)
      return
    }
    newListProductId.set(product.id, product)
    setListProductChose(newListProductId)
    setListProductSelected(Array.from(newListProductId.values()))
  }

  return (
    <div id='index#1'>
      <div className='mt-7'>
        <TutorialBox step='Bước 1: Chọn sản phẩm sữa' description='Hãy chọn sản phẩm khách hàng muốn đặt'/>
        <p className='text-primary font-medium'>Sản phẩm đã chọn</p>
        { listProductChose.size > 0 &&
        <ScrollArea className='w-160 mb-5 h-18'>
          <div className='flex gap-2'>
            { Array.from(listProductChose.values()).map((product) => (
              <Button key={product.id} className='flex items-center justify-between gap-3 border border-secondary rounded-3xl bg-[#EFF6FF] text-primary mt-2 whitespace-nowrap hover:bg-[#EFF6FF]'>
                {product.brand} - {product.name}
                <IoMdClose className='hover:text-red-500' onClick={() => handleSelectedProduct(product)}/>
              </Button>
            )) }
          </div>
          <ScrollBar orientation='horizontal' className='bg-gray-50'/>
        </ScrollArea>
        }
        <div className='my-5'>
          <label htmlFor="select-product" className='text-primary text-sm-body-desktop font-medium'>Tên hãng</label>
          <Select id='select-product' className='border border-border-primary mt-2' onChange={(e) => setProductBrand(e.target.value)}>
            <option value="">Tất cả các hãng</option>
            {listBrand.map((brand) => (
              <option id={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </Select>
        </div>
        <div className='my-5'>
          <label htmlFor="select-capacity" className='text-primary text-sm-body-desktop font-medium'>Dung tích / Khối lượng</label>
          <div className='grid grid-cols-4 gap-3 mt-2' id='select-capacity'>
            <SelectionBox
              isChosen={Number(productVolume) == 180 ? true : false}
              onClick={() => setProductVolume(180)}
            >
              <p className="text-sm-body-desktop">180ml</p>
            </SelectionBox>
            <SelectionBox
              isChosen={Number(productVolume) == 490 ? true : false}
              onClick={() => setProductVolume(490)}
            >
              <p className="text-sm-body-desktop">490 ml</p>
            </SelectionBox>
            <SelectionBox
              isChosen={Number(productVolume) == 880 ? true : false}
              onClick={() => setProductVolume(880)}
            >
              <p className="text-sm-body-desktop">880 ml</p>
            </SelectionBox>
            <SelectionBox
              isChosen={Number(productVolume) == 1760 ? true : false}
              onClick={() => setProductVolume(1760)}
            >
              <p className="text-sm-body-desktop">1760 ml</p>
            </SelectionBox>
          </div>
        </div>
        <div className='my-1'>
          <label htmlFor="select-type" className='text-primary text-sm-body-desktop font-medium'>Loại</label>
          <div id='select-type' className='grid grid-cols-3 gap-3 mt-2'>
            <SelectionBox
              isChosen={productKind == 'NoSugar' ? true : false}
              onClick={() => setProductKind('NoSugar')}
            >
              <p className="text-sm-body-desktop">Không đường</p>
            </SelectionBox>
            <SelectionBox
              content='Có đường'
              isChosen={productKind == 'Sugar' ? true : false}
              onClick={() => setProductKind('Sugar')}
            >
              <p className="text-sm-body-desktop">Có đường</p>
            </SelectionBox>
            <SelectionBox
              content='Sữa chua'
              isChosen={productKind == 'Yogurt' ? true : false}
              onClick={() => setProductKind('Yogurt')}
            >
              <p className="text-sm-body-desktop">Sữa chua</p>
            </SelectionBox>
          </div>
        </div>
        {/* <Input label='Số lượng' variant='gray' type='number' onChange={(e) => setNumberOfProduct(Number(e.target.value))}/> */}
        <div className='flex justify-between items-center my-3'>
          <p className='text-sm-body-desktop font-medium text-primary'>Sản phẩm phù hợp</p>
          <p className='text-sm-body-desktop text-soft-gray bg-gray-200 rounded-md px-2 py-1'>{productList?.length} sản phẩm</p>
        </div>
        { loading ?
          <CardSkeleton count={2}/>
          :
          <>
            { productList && productList.length > 0 ?
              <>
                <ScrollArea className='h-60'>
                  { productList.map((product) => (
                    <Card key={product.id} className={`border-4 border-border-primary px-5 py-3 my-3 ${ listProductChose.has(product.id) && 'border-3 border-secondary bg-[#EFF6FF]'}`}>
                      <div className='flex items-center justify-between'>
                        <div className='flex flex-col gap-1'>
                          <div className='flex items-center gap-3 text-sm-body-desktop'>
                            <p className='text-primary font-medium'>{product.brand}</p>
                            <Tag className={`bg-transparent px-2 py-1 border ${PRODUCT_TYPE[product.productKind].style}`}>
                              {PRODUCT_TYPE[product.productKind].name}
                            </Tag>
                            { listProductChose.has(product.id) &&
                              <Tag variant='success'>Đã thêm</Tag>
                            }
                          </div>
                          <p>{product.name}</p>
                        </div>

                        { listProductChose.has(product.id) ?
                          <div className='flex items-center gap-2'>
                            <Tag className='bg-[#DBFCE7] border-none w-fit aspect-square rounded-full'>
                              <IoMdCheckmarkCircleOutline className='size-5 text-green-accent'/>
                            </Tag>
                            <Button className='bg-transparent hover:bg-red-200 aspect-square rounded-full' onClick={() => handleSelectedProduct(product)}>
                              <FaMinus className='size-5 text-red-500'/>
                            </Button>
                          </div>
                          :
                          <Button className='rounded-full aspect-square' onClick={() => handleSelectedProduct(product)}>
                            <FaPlus />
                          </Button>
                        }
                      </div>
                      <div className='flex gap-2 my-2'>
                        <Tag className='border-none rounded-sm font-normal py-1 px-2 bg-[#DBEAFE] text-secondary'>
                          {product.volumeMl}ml
                        </Tag>
                      </div>
                      <div className='flex gap-3'>
                        {/* <p className='text-sm-body-desktop text-green-accent font-bold'>{product.price.toLocaleString()}đ</p> */}
                        <p className='text-sm-body-desktop text-soft-gray font-medium'>Tồn kho: <span className='text-primary'>{product.quantity}</span></p>
                      </div>
                    </Card>
                  )) }
                </ScrollArea>
              </>
              :
              <NodataCard/>
            }
          </>
        }
      </div>
      <Button className={`w-full font-bold mt-5 ${listProductChose.size === 0 && 'opacity-50'}`} onClick={onNextStep} disabled={listProductChose.size === 0 ? true : false}>
                  Tiếp theo
        <IoIosArrowForward/>
      </Button>
    </div>
  )
}
