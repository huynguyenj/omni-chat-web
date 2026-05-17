import Card from '@/components/ui/card/Card'
import { TableSkeleton } from '@/components/ui/skeleton/TableSkeleton'
import { useState } from 'react'
import useGetProductBatchAudit from '../../hooks/useGetProductBatchAudit'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import NodataCard from '@/components/ui/card/NodataCard'
import { AnimatePresence } from 'motion/react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import { actionConfig, LIST_FILTER_ACTION, LIST_SORT_AUDIT_BY } from '../../const/audit'
import { formatDate, formatTime } from '@/utils/date-resolver'
import { ArrowDownRight, ArrowUpRight, Eye, MoveRight } from 'lucide-react'
import Button from '@/components/ui/button/Button'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import useGetDetailAudit from '../../hooks/useGetDetailAudit'
import { PRODUCT_PACKAGE_TYPE } from '../../const/product'

export default function ProductBatchAuditTab() {
  const { currentPage, filterAction, isDescending, listBatchAudit, sortBy, loading, setCurrentPage, handleFilterAction, handleSortBy, handleSortDescending } = useGetProductBatchAudit()
  const { auditDetail, handleGetAuditDetail } = useGetDetailAudit()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const handleDetailOpen = (auditId: string) => {
    handleGetAuditDetail(auditId)
    setIsDetailOpen(prevState => !prevState)
  }
  const quantityText = (oldValue: number, newValue: number) => {
    const isIncrease = newValue > oldValue
    return <div className='flex gap-3'>
      <p className=''>{oldValue}</p>
      <MoveRight />
      <p className={`${isIncrease ? 'text-green-accent' : 'text-red-400'} font-medium`}>{newValue}</p>
    </div>
  }
  return (
    <div className='space-y-6 text-sm-body-desktop'>
      <Card className='p-6 text-sm-body-desktop'>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-sm-title-desktop font-semibold">Quản lý xuất nhập kho</h2>
            <p className="text-sm-body-desktop text-soft-gray mt-1">Danh sách lịch sử xuất nhập kho từ hệ thống</p>
          </div>
        </div>
        <div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex gap-2 items-center mb-3 w-[40%]'>
            <p className='text-nowrap'>Sắp xếp:</p>
            <AdvSelect
              value={sortBy}
              onValueChange={handleSortBy}
            >
              <SelectTrigger>
                <SelectValue placeholder='Sắp xếp theo'/>
              </SelectTrigger>
              <SelectContent>
                {LIST_SORT_AUDIT_BY.map((sort, i) => (
                  <SelectItem key={i} value={sort.value}>{sort.label}</SelectItem>
                )) }
              </SelectContent>
            </AdvSelect>
            <AdvSelect
              onValueChange={handleSortDescending}
              value={String(isDescending)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Thứ tự'/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>{ sortBy !== 'createDate' ? 'Giảm dần' : 'Mới nhất' }</SelectItem>
                <SelectItem value='false'>{ sortBy !== 'createDate' ? 'Tăng dần' : 'Cũ nhất' }</SelectItem>
              </SelectContent>
            </AdvSelect>
          </div>
          <div className='flex gap-2 items-center mb-3 '>
            <AdvSelect
              value={filterAction}
              onValueChange={handleFilterAction}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chức năng'/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'all'}>Tất cả</SelectItem>
                {LIST_FILTER_ACTION.map((action, i) => (
                  <SelectItem key={i} value={action.value}>{action.label}</SelectItem>
                )) }
              </SelectContent>
            </AdvSelect>
          </div>
        </div>
        { loading ?
          <TableSkeleton numberOfColumn={6} />
          :
          <>
            { listBatchAudit && listBatchAudit.items.length > 0 ?
              <div className='overflow-x-auto'>
                <table className='w-full border border-border-primary my-3 table-fixed min-w-120 '>
                  <thead className='bg-secondary'>
                    <tr className='text-white'>
                      <th className='py-2 text-start px-5 w-1/3'>Id</th>
                      <th className='py-2 text-start px-5 w-1/4'>Nhân viên</th>
                      <th className='py-2 text-start px-5 w-1/4'>Phương thức</th>
                      <th className='py-2 text-start px-5 w-1/2'> Ngày thực hiện</th>
                      <th className='py-2 text-start px-5 w-1/4'>Số lượng</th>
                      <th className='py-2 text-end px-5 w-1/5'>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listBatchAudit.items.map((audit) => (
                      <tr key={audit.id}>
                        <td className='py-2 px-5 w-1/3 border-r border-b-2 border-border-primary'>
                          <p>{audit.id}</p>
                        </td>
                        <td className='py-2 px-5  border-r border-b-2 border-border-primary'>
                          <p>{audit.staffName}</p>
                        </td>
                        <td className='py-2 px-5  border-r border-b-2 border-border-primary'>
                          <p>{actionConfig[audit.action].label}</p>
                        </td>
                        <td className='py-2 px-5  border-r border-b-2 border-border-primary'>
                          <p>{formatDate(audit.createDate)} - {formatTime(audit.createDate)}</p>
                        </td>
                        <td className='py-2 px-5  border-r border-b-2 border-border-primary'>
                          <p>{quantityText(audit.oldValue, audit.newValue)}</p>
                        </td>
                        <td className='py-2 w-1/5 px-5 border-r border-b-2 border-border-primary'>
                          <Button className='py-2 px-2' onClick={() => handleDetailOpen(audit.id)}>
                            <Eye className='size-5'/>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationBar
                  currentPage={currentPage}
                  setPage={setCurrentPage}
                  totalPage={listBatchAudit.meta.total_pages}
                />
              </div>
              :
              <NodataCard/>
            }
          </>
        }
      </Card>
      <AnimatePresence>
        { isDetailOpen &&
            <PopupBasic onClose={() => setIsDetailOpen(false)} title='Thông tin chi tiết'>
              { auditDetail ?
                <>
                  <Card className='rounded-[10px] text-sm-body-desktop mt-4'>
                    <p className='font-bold mb-3'>{auditDetail?.productName} - {auditDetail?.productCode}</p>
                    <div className='flex justify-between'>
                      <p className='font-medium'>Hãng</p>
                      <p>{auditDetail?.brandName}</p>
                    </div>
                    <hr className='border-border-primary border my-2'/>
                    <div className='flex justify-between'>
                      <p className='font-medium'>Dung tích</p>
                      <p>{auditDetail?.volumeML}ml</p>
                    </div>
                    <hr className='border-border-primary border my-2'/>
                    <div className='flex justify-between'>
                      <p className='font-medium'>Kiểu hộp</p>
                      <p>{PRODUCT_PACKAGE_TYPE[auditDetail.packagingType]}</p>
                    </div>
                    <hr className='border-border-primary border my-2'/>
                    <div className='flex justify-between'>
                      <p className='font-medium'>Hãng</p>
                      <p>{auditDetail?.brandName}</p>
                    </div>
                    <hr className='border-border-primary border my-2'/>
                    <div className='flex justify-between'>
                      <p className='font-medium'>Giá</p>
                      <p className='text-green-accent font-bold'>{auditDetail.price.toLocaleString()}đ</p>
                    </div>
                    <hr className='border-border-primary border my-2'/>
                  </Card>
                  <Card className={`border-2 ${auditDetail.newValue > auditDetail.oldValue ? 'border-green-accent' : 'border-red-400'} my-3 rounded-[10px]`}>
                    <p className='font-medium'>Lô: #{auditDetail.batchCode} (ngày tạo: {formatDate(auditDetail.batchCreateDate)})</p>
                    <p className='flex gap-2 items-center font-medium'>Số lượng:
                      <span className='font-medium text-m-body-desktop'>{auditDetail.oldValue}</span>
                      {auditDetail.newValue > auditDetail.oldValue ?
                        <ArrowUpRight className='text-green-accent size-5'/>
                        :
                        <ArrowDownRight className='text-red-500 size-5'/>
                      }
                      <span className={`${auditDetail.newValue > auditDetail.oldValue ? 'text-green-accent' : 'text-red-500'} font-bold text-m-body-desktop`}>{auditDetail.newValue}</span>
                      <span className='text-soft-gray'>({formatDate(auditDetail.createDate)} - {formatTime(auditDetail.createDate)})</span>
                    </p>
                  </Card>
                </>
                :
                <NodataCard/>
              }
            </PopupBasic>
        }
      </AnimatePresence>
    </div>
  )
}
