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
import useUpdateClaim from '../hooks/useUpdateClaim'
import ClaimInfoSection from './ClaimInfoSection'
import Button from '@/components/ui/button/Button'
import { BiEdit } from 'react-icons/bi'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import type { ClaimType } from '../types/claim-type'
import Input from '@/components/ui/input/Input'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'


export default function ListClaimSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const { listClaims, loading, handleRefresh } = useGetClaimList({ currentPage: currentPage })
  const { errors, handleSubmit, loading: loadingUpdate, onSubmit, register, setChosenClaimId, reset } = useUpdateClaim({ onRefresh: handleRefresh })
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const handleOpenUpdate = (claim: ClaimType) => {
    setChosenClaimId(claim.id)
    setIsUpdateOpen(prevState => !prevState)
    reset({
      description: claim.description,
      reason: claim.reason
    })
  }
  return (
    <div className='flex flex-col gap-5 mt-5'>
      <div className="flex justify-between">
        <div>
          <p className="text-m-title-desktop text-primary font-bold">Quản lí đơn</p>
          <p className="text-m-body-desktop">Tạo và theo dõi các yêu câu nghỉ phép của bạn</p>
        </div>
        <ClaimInfoSection onRefresh={handleRefresh}/>
      </div>
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
                    <div className='flex gap-2'>
                      <Tag variant={ claim.status === 'Pending' ? 'warn' : claim.status === 'Approve' ? 'success' : 'primary' } className='px-2 flex items-center py-0.5 rounded-2xl'>
                        {CLAIM_STATUS[claim.status]}
                      </Tag>
                      { claim.status === 'Pending' &&
                        <Button onClick={() => handleOpenUpdate(claim)}>
                          <BiEdit/>
                        </Button>
                      }
                    </div>
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
      { isUpdateOpen &&
      <PopupBasic onClose={() => setIsUpdateOpen(false)} title='Cập nhật lại đơn'>
        <div className='mt-5 text-sm-body-desktop text-sm/9'>
          <label htmlFor="reason" className='font-medium'>Lý do</label>
          <Input {...register('reason')} id='reason' variant='gray' placeholder='Lý do cho yêu cầu này' type='text' className='pb-6' error={errors.reason?.message}/>
          <label htmlFor="description" className='font-medium'>Mô tả</label>
          <Input {...register('description')} id='description' variant='gray' placeholder='Mô tả chi tiết về yêu cầu của bạn...' type='text' className='pb-6'/>
        </div>
        <div className='flex items-center justify-end gap-2 mt-4'>
          { loadingUpdate ?
            <LoadingSpinner size='sm'/>
            :
            <>
              <Button variant='outline' className='border border-border-primary text-black px-5 hover:bg-gray-200' onClick={() => setIsUpdateOpen(false)}>
                                          Hủy
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>
                                          Lưu
              </Button>
            </>
          }
        </div>
      </PopupBasic>
      }
    </div>
  )
}
