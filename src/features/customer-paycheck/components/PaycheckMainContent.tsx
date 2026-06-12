import Button from '@/components/ui/button/Button'
import NodataCard from '@/components/ui/card/NodataCard'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import useGetAllInvoiceHistory from '../hooks/useGetAllInvoiceHistory'
import { useParams } from 'react-router'
import { formatDate, formatTime } from '@/utils/date-resolver'
import { formatMoney } from '@/utils/format'
import { AlertCircle, Box, Clock3, Eye, X } from 'lucide-react'
import { TableSkeleton } from '@/components/ui/skeleton/TableSkeleton'
import { payCheckStatus } from '../const/status'
import useGetInvoiceDetail from '../hooks/useGetInvoiceDetail'
import { useState } from 'react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import { ScrollArea } from '@/components/ui/scrollbar/ScrollArea'
import Card from '@/components/ui/card/Card'
import useGetCustomerWallet from '../hooks/useGetCustomerWallet'
import useAllocateWallet from '../hooks/useAllocateWallet'
import Alert from '@/components/ui/alert/Alert'
import Input from '@/components/ui/input/Input'
import { FaMoneyBill } from 'react-icons/fa6'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import useGetInvoice from '../hooks/useGetInvoice'
import { MdAttachMoney } from 'react-icons/md'
import useGetInvoiceById from '../hooks/useGetInvoiceById'
import Tag from '@/components/ui/tag/Tag'

function transactionTypeLabel(type: string) {
  const key = String(type).trim().toLowerCase()
  if (key === 'deposit') return 'Tiền vào ví'
  if (key === 'credit') return 'Tiền sử dụng'
  if (key === 'allocateforinvoice') return 'Tiền thanh toán'
  if (key === 'debit') return 'Ghi nợ'
  return type || 'Khác'
}


export default function PaycheckMainContent() {
  const { customerId } = useParams()
  const [isOpen, setIsOpen] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [isAllocateOpen, setIsAllocateOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const { loading, paycheckHistory, currentPage, setCurrentPage, handleRefresh } = useGetAllInvoiceHistory({ customerId })
  const { handleGetInvoice, paycheckDetail } = useGetInvoiceDetail()
  const { wallet, loading: walletLoading } = useGetCustomerWallet({ customerId })
  const { handleSubmit, loading: allocateLoading, onSubmit, register, reset, setInvoiceId, errors } = useAllocateWallet({ onRefresh: handleRefresh })
  const { handleGetPayInvoice } = useGetInvoice()
  const { handleGetPayInvoiceId, invoice } = useGetInvoiceById()
  const handleOpenDetail = (invoiceId: string) => {
    handleGetInvoice(invoiceId)
    setIsOpen(prevState => !prevState)
  }
  const handleOpenWallet = () => {
    setIsWalletOpen(prevState => !prevState)
  }
  const handleOpenAllocate = (invoiceId: string) => {
    setInvoiceId(invoiceId)
    setIsAllocateOpen(prevState => !prevState)
    reset()
  }
  const handleOpenPayInvoice = (invoiceId: string) => {
    setIsInvoiceOpen(prevState => !prevState)
    handleGetPayInvoiceId(invoiceId)
  }
  return (
    <div>
      <Button onClick={handleOpenWallet}>
        Ví tiền
      </Button>
      { loading ?
        <TableSkeleton numberOfColumn={9} numberOfRow={10}/>
        :
        <>
          {paycheckHistory && paycheckHistory.items.length > 0 ?
            <div>
              <div className='overflow-x-auto'>
                <table className='w-full border border-border-primary my-3 table-fixed min-w-250 '>
                  <thead className='bg-secondary'>
                    <tr className='text-white'>
                      <th className='py-2 text-start px-5 w-1/3'>Ngày bắt đầu</th>
                      <th className='py-2 text-start px-5 w-1/3'>Ngày hết hạn</th>
                      <th className='py-2 text-right px-5 w-1/3'>Tổng tiền</th>
                      <th className='py-2 text-right px-5 w-1/3'>Số tiền phải trả</th>
                      <th className='py-2 text-right px-5 w-1/4'>Số tiền khấu trừ</th>
                      <th className='py-2 text-start px-5 w-1/3'>Trạng thái</th>
                      <th className='py-2 text-end px-5 w-1/3'>Phương thức</th>
                      <th className='py-2 text-end px-5 w-1/3'>Ngày hoàn thành</th>
                      <th className='py-2 text-end px-5 w-1/4'>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paycheckHistory.items.map((paycheck) => (
                      <tr key={paycheck.id}>
                        <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                          <p>{formatDate(paycheck.startedDate)}</p>
                        </td>
                        <td className='py-2 px-5 w-1/4 wrap-break-word border-r border-b-2 border-border-primary'>
                          <p>{formatDate(paycheck.endedDate)}</p>
                        </td>
                        <td className='py-2 px-5 w-1/6 border-r border-b-2 border-border-primary text-right'>
                          <p>{formatMoney(paycheck.total)}</p>
                        </td>
                        <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary text-right'>
                          <p>{formatMoney(paycheck.paidAmount)}</p>
                        </td>
                        <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary text-right'>
                          <p>{paycheck.deductedAmount ? formatMoney(paycheck.deductedAmount) : 0+'đ'}</p>
                        </td>
                        <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                          <p>{payCheckStatus(paycheck.invoiceStatus)}</p>
                        </td>
                        <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary text-end'>
                          <p>{paycheck.invoiceMethod}</p>
                        </td>
                        <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary text-end'>
                          <p>{ paycheck.completedDate ? formatDate(paycheck.completedDate) : 'N/A'}</p>
                        </td>
                        <td className='py-2 px-5 border-r border-b-2 border-border-primary'>
                          <div className='grid grid-cols-2 justify-end items-center gap-2 '>
                            <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleOpenDetail(paycheck.id)}>
                              <Eye className='text-secondary size-5'/>
                            </Button>
                            { paycheck.invoiceStatus === 'Pending' &&
                            <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleOpenAllocate(paycheck.id)}>
                              <FaMoneyBill className='text-secondary size-5'/>
                            </Button>
                            }
                            {
                              paycheck.invoiceStatus === 'Pending' &&
                              <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleGetPayInvoice(paycheck.id)}>
                                <MdAttachMoney className='text-secondary size-5'/>
                              </Button>
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationBar
                  currentPage={currentPage}
                  setPage={setCurrentPage}
                  totalPage={paycheckHistory.meta.total_pages}
                />
              </div>
            </div>
            :
            <NodataCard content='Không có dữ liệu phiếu thanh toán'/>
          }
        </>
      }
      { isOpen &&
        <PopupBasic onClose={() => setIsOpen(false)} title='Thông tin chi tiết'>
          <ScrollArea className='max-h-200 my-5'>
            {paycheckDetail?.map((p) => (
              <Card key={p.id} variant='primary' className='rounded-[12px] text-sm-body-desktop min-w-100'>
                <div className=''>
                  <p className='text-m-body-desktop font-medium text-primary'>{p.code}</p>
                  <div className=''>
                    <p className='text-soft-gray'>Ngày đặt hàng: {formatDate(p.orderDate)}</p>
                    <p className='text-soft-gray'>Ngày giao: {formatDate(p.deliveriedDate)}</p>
                  </div>
                </div>
                {/* <div className='flex justify-between my-2'>
                  <p>Trạng thái đơn:</p>
                  <Tag variant={ORDER_STATUS[p.status].tagVariant}>{ORDER_STATUS[p.status].name}</Tag>
                </div> */}
                <ScrollArea className='h-70 pr-3'>
                  {p.orderItems.map((item, idx) => (
                    <div key={`${item.productName}-${idx}`} className="rounded-xl border border-gray-200 bg-white p-3 flex gap-3 my-2">
                      <div className="h-14 w-14 shrink-0 rounded-lg bg-[#EAF3FF] flex items-center justify-center border border-[#BFD8FF]">
                        { item.imageUrl ? <img src={item.imageUrl} alt='product-image'/> : <Box className="h-6 w-6 text-[#3366CC]" /> }
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#003366] leading-snug">{item.productName}</p>
                        <p className="text-[12px] text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                        <div className="mt-2 flex flex-wrap justify-between gap-2 text-[12px]">
                          <span className="text-gray-600">Đơn giá: {formatMoney(item.singlePrice)}</span>
                          <span className="font-semibold text-green-accent">Thành tiền: {formatMoney(item.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </Card>
            )) }
          </ScrollArea>
        </PopupBasic>
      }
      { isWalletOpen &&
   <div
     className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
     onMouseDown={handleOpenWallet}
     role="presentation"
   >
     <div
       className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-lg"
       onMouseDown={e => e.stopPropagation()}
     >
       <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4">
         <h3 className="pr-2 text-lg font-semibold text-[#003366]">Lịch sử giao dịch</h3>
         <Button type="button" variant="outline" size="sm" className="h-9 w-9 shrink-0 p-0" onClick={handleOpenWallet} aria-label="Đóng">
           <X className="h-4 w-4" />
         </Button>
       </div>
       <div className="p-5">

         {walletLoading ? (
           <p className="text-sm text-gray-500">Đang tải lịch sử giao dịch...</p>
         ) : wallet ? (
           <>
             <div className="mb-4 grid grid-cols-1 gap-2 rounded-lg border border-gray-100 bg-gray-50/80 p-3 text-sm sm:grid-cols-2">
               <div>
                 <p className="text-gray-500">Ví tiền</p>
                 <p className="font-bold tabular-nums text-[#003366]">{formatMoney(wallet.amount)}</p>
               </div>
               <div>
                 <p className="text-gray-500">Tổng nợ</p>
                 <p className="font-bold tabular-nums text-[#dc2626]">{formatMoney(wallet.totalDebt)}</p>
               </div>
             </div>

             {wallet.customerTransactions.length === 0 ? (
               <p className="text-sm text-gray-500">Chưa có giao dịch.</p>
             ) : (
               <div className="space-y-3">
                 {wallet.customerTransactions.map(tx => (
                   <div key={tx.id} className="rounded-lg border border-gray-100 bg-gray-50/80 p-3 text-sm flex justify-between items-center">
                     <div>
                       <p className="font-medium text-[#003366]">{transactionTypeLabel(tx.transactionType)}</p>
                       <p className="mt-0.5 flex items-center gap-1 text-gray-500">
                         <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                         {formatDate(tx.createDate)} - {formatTime(tx.createDate)}
                       </p>
                       {(() => {
                         const isDeposit = String(tx.transactionType).trim().toLowerCase() === 'deposit'
                         return (
                           <p className={`mt-1 font-semibold  ${isDeposit ? 'text-[#16a34a]' : 'text-red-500'}`}>{isDeposit ? '+' : '-'} {formatMoney(tx.amount)}</p>
                         )
                       })()}
                     </div>
                     { tx.invoiceId !== null ?
                       <Button className='bg-white text-primary hover:text-white' onClick={() => handleOpenPayInvoice(tx.invoiceId)}><Eye/></Button>
                       :
                       <></>
                     }
                   </div>
                 ))}
               </div>
             )}
           </>
         ) :
           <NodataCard content='Không có giao dịch'/>
         }
       </div>
     </div>
   </div>
      }
      { isAllocateOpen &&
      <PopupBasic onClose={() => setIsAllocateOpen(false)} title='Sử dụng ví tiền'>
        <div className='my-2'>
          <Input {...register('deductedAmount', { valueAsNumber: true })} type={'number'} variant='gray' min={0} error={errors.deductedAmount?.message} placeholder='10.000'/>
          <Alert variant='danger' className='rounded-[10px] my-2'>
            <div className='flex gap-2 items-center'>
              <AlertCircle className='size-4'/>
              <p>Chắn chắn rằng bạn muốn sử dụng tiền cho phiếu thanh toán này</p>
            </div>
          </Alert>
          <div className='flex items-center justify-center'>
            { allocateLoading ?
              <LoadingSpinner/>
              :
              <Button onClick={handleSubmit((data) => onSubmit(data, wallet?.id))} className='w-full'>
              Xác nhận
              </Button>
            }
          </div>
        </div>
      </PopupBasic>
      }
      { isInvoiceOpen &&
        <PopupBasic onClose={() => setIsInvoiceOpen(false)} title='Hóa đơn'>
          <Card className="p-6 text-sm-body-desktop">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-primary">
      Chi tiết hóa đơn
              </h2>
              <p className="text-soft-gray">
      Mã hóa đơn: {invoice?.id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-primary mb-3">
        Thông tin khách hàng
                </h3>

                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Họ tên:</span>{' '}
                    {invoice?.customerName}
                  </p>

                  <p>
                    <span className="font-medium">Số điện thoại:</span>{' '}
                    {invoice?.customerPhoneNumber}
                  </p>

                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    {invoice?.customerEmail}
                  </p>

                  <p>
                    <span className="font-medium">Địa chỉ:</span>{' '}
                    {invoice?.customerAddress}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-3">
        Thông tin hóa đơn
                </h3>

                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Ngày bắt đầu:</span>{' '}
                    {invoice?.startedDate ? formatDate(invoice.startedDate) : 'N/A'}
                  </p>

                  <p>
                    <span className="font-medium">Ngày kết thúc:</span>{' '}
                    {invoice?.endedDate ? formatDate(invoice.endedDate) : 'N/A'}
                  </p>

                  <p>
                    <span className="font-medium">Phương thức:</span>{' '}
                    {invoice?.invoiceMethod}
                  </p>

                  <p>
                    <span className="font-medium">Trạng thái:</span>{' '}
                    <Tag
                      variant={
                        invoice?.invoiceStatus === 'Completed'
                          ? 'success'
                          : invoice?.invoiceStatus === 'Pending'
                            ? 'warn'
                            : 'danger'
                      }
                    >
                      {payCheckStatus(invoice?.invoiceStatus)}
                    </Tag>
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-6 border-border-primary" />

            <div>
              <h3 className="font-semibold text-primary mb-4">
      Thông tin thanh toán
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Tổng tiền hóa đơn</span>
                  <span className="font-medium">
                    {formatMoney(invoice?.total ?? 0) }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Đã thanh toán</span>
                  <span className="text-green-600 font-medium">
                    {formatMoney(invoice?.paidAmount ?? 0) }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Khấu trừ ví</span>
                  <span className="text-blue-600 font-medium">
                    {formatMoney(invoice?.deductedAmount ?? 0) }

                  </span>
                </div>

                <hr />
              </div>
            </div>
          </Card>
        </PopupBasic>
      }
    </div>
  )
}
