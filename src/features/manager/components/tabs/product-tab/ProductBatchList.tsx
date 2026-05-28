import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import NodataCard from '@/components/ui/card/NodataCard'
import Input from '@/components/ui/input/Input'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import { TableSkeleton } from '@/components/ui/skeleton/TableSkeleton'
import { actionConfig, LIST_FILTER_ACTION, LIST_SORT_AUDIT_BY } from '@/features/manager/const/audit'
import useCreateBatchProduct from '@/features/manager/hooks/useCreateBatchProduct'
import useGetAuditByBatchId from '@/features/manager/hooks/useGetAuditByBatchId'
import useGetProductBatchManager from '@/features/manager/hooks/useGetProductBatchManager'
import { formatDate, formatTime } from '@/utils/date-resolver'
import { MoveRight, PlusIcon, Trash2 } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { FaEye } from 'react-icons/fa6'
import { FiCheckCircle } from 'react-icons/fi'

export default function ProductBatchList({ productId }: { productId: string }) {
  const [isOpenCreateBatch, setIsOpenCreateBatch] = useState(false)
  const { currentPage, filterAction, handleFilterAction, handleSortBy, handleSortDescending, isDescending, listBatchAudit, loading, setBatchId, setCurrentPage, sortBy } = useGetAuditByBatchId()
  const { batchCurrentPage, loading: batchLoading, productBatchList, setBatchCurrentPage, handleRefresh } = useGetProductBatchManager({ productId })
  const { handleCreateBatch, listBatchItems, loading: loadingCreateBatch, setListBatchItems, setProductChoseForBatch, handleAddBatch, handleDeleteBatch, handleSubmit, register } = useCreateBatchProduct({ onRefresh: handleRefresh })
  const [isListAuditOpen, setIsListAuditOpen] = useState(false)
  const handleOpenAudit = (batchId: string) => {
    setBatchId(batchId)
    setIsListAuditOpen(true)
  }
  const quantityText = (oldValue: number, newValue: number) => {
    const isIncrease = newValue > oldValue
    return <div className='flex gap-3'>
      <p className=''>{oldValue}</p>
      <MoveRight />
      <p className={`${isIncrease ? 'text-green-accent' : 'text-red-400'} font-medium`}>{newValue}</p>
    </div>
  }

  const handleOpenCreateBatch = () => {
    setProductChoseForBatch(productId)
    setIsOpenCreateBatch(prev => !prev)
  }
  const handleCloseCreateBatch = () => {
    setListBatchItems([])
    setIsOpenCreateBatch(prev => !prev)
  }

  return (
    <>
      <div className='flex items-center justify-end'>
        <Button className='' onClick={handleOpenCreateBatch}>
          <PlusIcon/>
                Thêm lô sản phẩm
        </Button>
      </div>
      { batchLoading ?
        <TableSkeleton numberOfColumn={5}/>
        :
        <>

          { productBatchList && productBatchList.items.length > 0 ?
            <div>
              <table className='w-full border border-border-primary my-3 table-fixed min-w-250'>
                <thead className='bg-secondary'>
                  <tr className='text-white'>
                    <th className='py-2 text-start px-5 w-1/7'>STT</th>
                    <th className='py-2 text-start px-5 w-1/4'>Code</th>
                    <th className='py-2 text-end px-5 w-1/4'>Số lượng</th>
                    <th className='py-2 text-start px-5 w-1/3'>Hạn sử dụng</th>
                    <th className='py-2 text-end px-5 w-1/6'>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  { productBatchList?.items.map((batch, i) => (
                    <tr key={batch.id}>
                      <td className='py-2 px-5 w-1/7 border-r border-b-2 border-border-primary'>
                        <p>{i+1}</p>
                      </td>
                      <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                        <p>{batch.code}</p>
                      </td>
                      <td className='py-2 text-end px-5 w-1/4 wrap-break-word border-r border-b-2 border-border-primary'>
                        <p>{batch.quantity}</p>
                      </td>
                      <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                        <p>{formatDate(batch.expiryDate)} - {formatTime(batch.expiryDate)}</p>
                      </td>
                      <td className='py-2 px-5 border-r border-b-2 border-border-primary'>
                        <div className='flex flex-col xl:flex-row justify-end items-center gap-2 '>
                          <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleOpenAudit(batch.id)}>
                            <FaEye className='text-secondary size-5'/>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationBar
                currentPage={batchCurrentPage}
                setPage={setBatchCurrentPage}
                totalPage={productBatchList.meta.total_pages}
              />
            </div>
            :
            <NodataCard/>
          }
        </>
      }
      <AnimatePresence>
        { isListAuditOpen &&
            <PopupBasic onClose={() => setIsListAuditOpen(false)} title='Lịch sử xuất nhập kho của lô' size='lg'>
              <div>
                <div className='flex justify-between items-center mt-5'>
                  <div className='flex gap-2 items-center mb-3 w-[70%]'>
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
                        <table className='w-full border border-border-primary my-3 table-fixed min-w-230'>
                          <thead className='bg-secondary'>
                            <tr className='text-white'>
                              <th className='py-2 text-start px-5 w-1/7'>STT</th>
                              <th className='py-2 text-start px-5 w-1/4'>Nhân viên</th>
                              <th className='py-2 text-start px-5 w-1/4'>Phương thức</th>
                              <th className='py-2 text-start px-5 w-1/2'> Ngày thực hiện</th>
                              <th className='py-2 text-start px-5 w-1/3'>Số lượng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listBatchAudit.items.map((audit, i) => (
                              <tr key={audit.id}>
                                <td className='py-2 px-5 w-1/3 border-r border-b-2 border-border-primary'>
                                  <p>{i+1}</p>
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

              </div>
            </PopupBasic>
        }
      </AnimatePresence>
      <AnimatePresence>
        { isOpenCreateBatch &&
        <PopupBasic title='Tạo lô sản phẩm mới' onClose={() => setIsOpenCreateBatch(false)}>
          <div className='flex items-center gap-3 my-3'>
            <Input {...register('manuFactureDate', { valueAsDate: true })} variant='gray' label='Ngày sản xuất' type='date'/>
            <Input {...register('quantity', { valueAsNumber: true })} variant='gray' label='Số lượng sản phẩm' type='number'/>
          </div>
          <Button variant='outline' onClick={handleSubmit(handleAddBatch)} className='w-full my-2'>
            <PlusIcon/>
            Thêm lô
          </Button>
          { listBatchItems.length > 0 &&
            <>
              <p className='text-sm-body-desktop font-medium text-primary'>Danh sách lô ({listBatchItems.length})</p>
              { listBatchItems.map((batch, i) => (
                <Card key={i} className='text-sm-body-desktop my-3 bg-[#EFF6FF] border-none'>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center text-white bg-secondary w-8 aspect-square rounded-full'>{i+1}</div>
                      <div>
                        <p className='text-primary font-medium'>Lô #{i+1}</p>
                        <p>Ngày sản xuất: {formatDate(batch.manuFactureDate)} - {batch.quantity}sp</p>
                      </div>
                    </div>
                    <Button className='bg-transparent border-none text-red-400 hover:bg-gray-200' onClick={() => handleDeleteBatch(batch)}>
                      <Trash2 className='size-4'/>
                    </Button>
                  </div>
                </Card>
              )) }
              <div className='flex w-full gap-2 items-center'>
                { loadingCreateBatch ?
                  <LoadingSpinner size='lg'/>
                  :
                  <>
                    <Button variant="basic" className="py-2 px-3 hover:bg-gray-200 w-full" onClick={handleCloseCreateBatch}
                    >
                    Hủy
                    </Button>
                    <Button variant='default' className='py-2 px-3 w-full' onClick={handleCreateBatch}>
                      <FiCheckCircle className='size-4' />
                                    Tạo lô ({listBatchItems.length})
                    </Button>
                  </>
                }
              </div>
            </>
          }
        </PopupBasic>
        }
      </AnimatePresence>
    </>
  )
}
