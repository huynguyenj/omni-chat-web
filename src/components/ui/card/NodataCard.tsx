import { FaBoxOpen } from 'react-icons/fa6'

type NodataCardProps = {
  content?: string
}

export default function NodataCard({ content= 'Chưa có dữ liệu' }: NodataCardProps) {
  return (
    <div className='w-full h-100 flex flex-col items-center justify-center gap-5'>
      <FaBoxOpen size={50} className='text-soft-gray'/>
      <p className='text-m-body-desktop font-medium text-soft-gray'>{content}</p>
    </div>
  )
}
