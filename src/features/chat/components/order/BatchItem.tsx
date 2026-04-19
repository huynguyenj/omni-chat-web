import SelectionBox from '../ui/SelectionBox'
import { formatDate } from '@/utils/date-resolver'
import Tag from '@/components/ui/tag/Tag'
import type { BatchType } from '../../types/batch-type'
import Button from '@/components/ui/button/Button'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { useState, type Dispatch, type SetStateAction } from 'react'
import type { OrderItems } from '../../types/order-type'

type BatchItemProps = {
  batch: BatchType
  isSelected?: boolean
  showQuantity?: boolean
  isNewestBoxChecked: boolean
  indexItem: number
  onSelect: (batch: BatchType) => void
  setListOrderItems: Dispatch<SetStateAction<Map<string, OrderItems>>>
  listOrderItems: Map<string, OrderItems>
}

export default function BatchItem({
  batch,
  isSelected,
  showQuantity = false,
  onSelect,
  setListOrderItems,
  listOrderItems,
  isNewestBoxChecked = false,
  indexItem
}: BatchItemProps) {
  const [quantity, setQuantity] = useState(listOrderItems.get(batch.id)?.quantity || 1)
  const handleAdd = () => {
    const orderItem = listOrderItems.get(batch.id)
    if (orderItem) {
      if (orderItem.quantity === batch.quantity) return
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      orderItem.quantity = newQuantity
      const newListBatch = listOrderItems.set(batch.id, orderItem)
      setListOrderItems(newListBatch)
    }
  }

  const handleMinus = () => {
    const orderItem = listOrderItems.get(batch.id)
    if (orderItem) {
      if (orderItem.quantity === 1) return
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      orderItem.quantity = newQuantity
      const newListBatch = listOrderItems.set(batch.id, orderItem)
      setListOrderItems(newListBatch)
    }
  }
  return (
    <SelectionBox
      id={batch.id}
      className='flex flex-col px-4 py-5 my-2'
      isChosen={isSelected}
    >
      <div className='w-full flex flex-col mb-3'>
        <div className='w-full flex gap-3 items-center'>
          {isSelected ?
            <Button className='w-8 aspect-square rounded-full py-1 px-1' variant='danger' onClick={() => onSelect(batch)}><FaMinus className='size-4'/></Button>
            :
            <Button className='w-8 aspect-square rounded-full py-1 px-1' variant='success' onClick={() => onSelect(batch)}><FaPlus className='size-4'/></Button>
          }
          <div className='flex justify-between items-start w-full'>
            <div className='flex items-start gap-2'>
              <div>
                <p className='text-sm-body-desktop font-medium text-primary'>
                  Lô: {batch.code}
                </p>
                <p className='text-sm-body-desktop text-soft-gray'>
                  HSD: {formatDate(batch.expiryDate)}
                </p>
              </div>
              { isNewestBoxChecked && indexItem === 0 &&
              <Tag variant='primary' className='py-0.5 px-3 text-[0.85rem]'>
                Mới nhất
              </Tag>
              }
            </div>

            <Tag variant='success' className='py-0.5 px-3'>
              <p className='text-[0.85rem] font-medium'>
                Tồn: {batch.quantity}
              </p>
            </Tag>
          </div>
        </div>
      </div>

      {showQuantity && (
        <>
          <hr className='border-2 border-border-primary my-2 w-full' />
          <p className='text-sm-body-desktop text-primary mb-2'>Số lượng</p>
          <div className='flex items-center gap-3'>
            <Button variant='outline' className='py-2 px-3 text-black border-3 border-border-primary' onClick={handleMinus}>
              <FaMinus className='size-3'/>
            </Button>
            <div className='flex justify-center items-center bg-border-primary px-5 py-1'>
              <p className='text-sm-body-desktop font-medium text-black'>{quantity}</p>
            </div>
            <Button variant='outline' className='py-2 px-3 text-black border-3 border-border-primary' onClick={handleAdd}>
              <FaPlus className='size-3'/>
            </Button>
          </div>
        </>
      )}
    </SelectionBox>
  )
}