import Card from '@/components/ui/card/Card'
import Tag from '@/components/ui/tag/Tag'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { MdOutlineCalendarToday } from 'react-icons/md'

interface Claim {
  id: string;
  type: string;
  description: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
}

const LIST_CLAIM: Claim[] = [
  {
    id: '1',
    type: 'Nghỉ phép',
    description: 'Xin nghỉ phép 2 ngày để đi du lịch',
    reason: 'Đã lên kế hoạch từ trước',
    status: 'approved',
    createdAt: '2025-11-20',
    reviewedAt: '2025-11-21'
  },
  {
    id: '2',
    type: 'Nghỉ ốm',
    description: 'Xin nghỉ ốm 1 ngày',
    reason: 'Bị cảm nặng',
    status: 'pending',
    createdAt: '2025-11-24'
  }
]

export default function ListClaimSection() {
  return (
    <div className='flex flex-col gap-5 mt-5'>
      { LIST_CLAIM.map((claim) => (
        <Card key={claim.id} className='px-8 py-5 border-2 border-border-primary'>
          <div className='flex justify-between items-center mb-9'>
            <div className='flex gap-2 items-center'>
              <div className='py-2 px-2 bg-[#F5F7FA] text-secondary rounded-md'>
                <IoDocumentTextOutline className='size-8'/>
              </div>
              <div>
                <p className='text-m-body-desktop text-primary'>{claim.type}</p>
                <p className='flex items-center gap-2'><MdOutlineCalendarToday/> <span>Ngày tạo: {claim.createdAt}</span></p>
              </div>
            </div>
            <Tag variant={ claim.status === 'pending' ? 'warn' : claim.status === 'approved' ? 'success' : 'primary' } className='px-2 flex items-center py-0.5 rounded-2xl'>
              {claim.status}
            </Tag>
          </div>
          <hr className='border border-border-primary my-5'/>
          <div className='text-sm-body-desktop text-sm/7'>
            <p className='text-soft-gray'>Mô tả:</p>
            <p> {claim.description}</p>
            <p className='text-soft-gray mt-2'>Lí do: </p>
            <p>{claim.reason}</p>
            <p className='text-soft-gray mt-3'>Đã xét duyệt vào: {claim.reviewedAt ? claim.reviewedAt : 'Chưa được duyệt'}</p>
          </div>
        </Card>
      )) }
    </div>
  )
}
