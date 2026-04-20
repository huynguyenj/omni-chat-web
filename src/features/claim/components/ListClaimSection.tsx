import Card from '@/components/ui/card/Card'
import NodataCard from '@/components/ui/card/NodataCard'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import Tag from '@/components/ui/tag/Tag'
import useGetClaimList from '@/features/claim/hooks/useGetClaimList'
import { formatDate, formatTime } from '@/utils/date-resolver'
import { useState } from 'react'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { MdOutlineCalendarToday } from 'react-icons/md'
import { CLAIM_STATUS } from '../const/claim-type'


export default function ListClaimSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const { listClaims, loading } = useGetClaimList({ currentPage: currentPage })
  return (
    <div className='flex flex-col gap-5 mt-5'>
      { loading ?
        <CardSkeleton count={2}/>
        :
        <>
          {listClaims ?
            <>
              { listClaims?.items?.map((claim) => (
                <Card key={claim.id} className='px-8 py-5 border-2 border-border-primary'>
                  <div className='flex justify-between items-center mb-9'>
                    <div className='flex gap-2 items-center'>
                      <div className='py-2 px-2 bg-[#F5F7FA] text-secondary rounded-md'>
                        <IoDocumentTextOutline className='size-8'/>
                      </div>
                      <div>
                        <p className='text-m-body-desktop text-primary'>{claim.claimType}</p>
                        <p className='flex items-center gap-2'>
                          <MdOutlineCalendarToday/>
                          <span>Ngày tạo: {formatDate(claim.submitDate)} {formatTime(claim.submitDate)}</span>
                        </p>
                      </div>
                    </div>
                    <Tag variant={ claim.status === 'Pending' ? 'warn' : claim.status === 'Approve' ? 'success' : 'primary' } className='px-2 flex items-center py-0.5 rounded-2xl'>
                      {CLAIM_STATUS[claim.status]}
                    </Tag>
                  </div>
                  <hr className='border border-border-primary my-5'/>
                  <div className='text-sm-body-desktop text-sm/7'>
                    <p className='text-soft-gray'>Mô tả:</p>
                    <p> {claim.description}</p>
                    <p className='text-soft-gray mt-2'>Lí do: </p>
                    <p>{claim.reason}</p>
                    {/* <p className='text-soft-gray mt-3'>Đã xét duyệt vào: {claim.reviewedAt ? claim.reviewedAt : 'Chưa được duyệt'}</p> */}
                  </div>
                </Card>
              )) }
              <PaginationBar
                currentPage={currentPage}
                totalPage={listClaims?.meta.total_pages}
                setPage={setCurrentPage}
              />
            </>
            :
            <NodataCard content='Chưa có đơn nào được tạo'/>
          }
        </>
      }

    </div>
  )
}
