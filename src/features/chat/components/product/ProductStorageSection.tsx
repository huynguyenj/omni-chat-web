import { useState } from 'react'
import Button from '@/components/ui/button/Button'
import { LuPackage } from 'react-icons/lu'
import { AnimatePresence } from 'motion/react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import useGetAllBrand from '../../hooks/useGetAllBrand'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import useGetProductStorageByBrandId from '../../hooks/useGetProductStorageByBrandId'
import Card from '@/components/ui/card/Card'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import NodataCard from '@/components/ui/card/NodataCard'
import { PRODUCT_TYPE } from '../../const/product-type'
import Tag from '@/components/ui/tag/Tag'

export default function ProductStorageSection() {
  const [isOpen, setIsOpen] = useState(false)
  const { listBrand } = useGetAllBrand()
  const { loading, productStorage, setBrandId } = useGetProductStorageByBrandId()
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
              <div className='my-5'>
                <label htmlFor="list-brand" className='text-primary text-sm-body-desktop font-medium'>Danh sách hãng sữa</label>
                <AdvSelect
                  onValueChange={setBrandId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hãng"/>
                  </SelectTrigger>
                  <SelectContent>
                    { listBrand.length > 0 &&
                    listBrand.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))
                    }
                  </SelectContent>
                </AdvSelect>
              </div>
              { loading ?
                <CardSkeleton/>
                :
                <>
                  { productStorage?
                    <>
                      <Card variant='default' className='rounded-xl bg-border-primary border-none'>
                        <p className='text-sm-body-desktop text-soft-gray'>Tổng tồn kho</p>
                        <p className='text-m-title-desktop text-primary font-bold'>{productStorage.totalProduct} sản phẩm</p>
                      </Card>
                      <hr className='border-1 border-border-primary my-5'/>
                      { productStorage.productKinds.map((kind) => (
                        <div key={kind.kindName} className='text-m-body-desktop'>
                          <p className='font-medium text-primary'>{PRODUCT_TYPE[kind.kindName].name}</p>
                          { kind.volumes.map((volume) => (
                            <Card key={volume.volume} className='my-3 rounded-sm bg-border-primary border-none'>
                              <div className='flex justify-between items-center'>
                                <p>{volume.volume}ml</p>
                                <Tag variant='success' className=''>{volume.quantity}sp</Tag>
                              </div>
                            </Card>
                          )) }
                        </div>
                      )) }
                    </>
                    :
                    <NodataCard content='Không có dữ liệu tồn kho'/>
                  }
                </>
              }

            </PopupBasic>
        }
      </AnimatePresence>
    </>
  )
}
