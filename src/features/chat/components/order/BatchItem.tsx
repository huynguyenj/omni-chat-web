import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import SelectionBox from '../ui/SelectionBox'
import { formatDate } from '@/utils/date-resolver'
import Tag from '@/components/ui/tag/Tag'
import QuantityAdd from '../ui/QuantityAdd'
import type { Dispatch, SetStateAction } from 'react'
import type { BatchType } from '../../types/batch-type'

type BatchItemProps = {
  batch: BatchType
  isSelected?: boolean
  showQuantity?: boolean
  quantity: number
  onSelect: (batch: BatchType) => void
  onChangeQuantity: Dispatch<SetStateAction<number>>
}

export default function BatchItem({
  batch,
  isSelected,
  showQuantity = false,
  quantity,
  onSelect,
  onChangeQuantity
}: BatchItemProps) {
  return (
    <SelectionBox
      id={batch.id}
      className='flex flex-col px-4 py-5 my-2'
      isChosen={isSelected}
      onClick={() => onSelect(batch)}
    >
      <div className='w-full flex flex-col mb-3'>
        <div className='w-full flex gap-3'>
          {isSelected && <IoMdCheckmarkCircleOutline className='size-6' />}

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

              <Tag variant='primary' className='py-0.5 px-3 text-[0.85rem]'>
                Mới nhất
              </Tag>
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
          <QuantityAdd
            max={batch.quantity}
            min={1}
            value={quantity || 1}
            setQuantity={onChangeQuantity}
          />
        </>
      )}
    </SelectionBox>
  )
}