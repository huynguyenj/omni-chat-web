import Button from '@/components/ui/button/Button'
import { type Dispatch, type SetStateAction } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa6'

type QuantityAddProps = {
  setQuantity: Dispatch<SetStateAction<number>>
  value: number
  min: number
  max: number
}

export default function QuantityAdd({ value, max, min, setQuantity }: QuantityAddProps) {
  const handleMinus = () => {
    if (value === min) return
    setQuantity((prevQuantity) => prevQuantity - 1)
  }
  const handleAdd = () => {
    if (value === max) return
    setQuantity((prevQuantity) => prevQuantity + 1)
  }
  return (
    <div className='flex items-center gap-3'>
      <Button variant='outline' className='py-2 px-3 text-black border-3 border-border-primary' onClick={handleMinus}>
        <FaMinus className='size-3'/>
      </Button>
      <div className='flex justify-center items-center bg-border-primary px-5 py-1'>
        <p className='text-sm-body-desktop font-medium text-black'>{value}</p>
      </div>
      <Button variant='outline' className='py-2 px-3 text-black border-3 border-border-primary' onClick={handleAdd}>
        <FaPlus className='size-3'/>
      </Button>
    </div>
  )
}
