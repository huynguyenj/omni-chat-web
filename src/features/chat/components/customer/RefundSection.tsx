// import { AnimatePresence } from 'motion/react'
// import type { OrderType } from '../../types/order-type'
// import PopupBasic from '@/components/ui/popup/PopupBasic'
// import Card from '@/components/ui/card/Card'
// import Alert from '@/components/ui/alert/Alert'
// import Button from '@/components/ui/button/Button'
// import { FiRotateCcw } from 'react-icons/fi'

// export default function RefundSection({ orderData }: OrderType) {
//   return (
//     <AnimatePresence>
//       <PopupBasic title='Yêu cầu hoàn tiền' onClose={handleOpen}>
//         <p className='text-sm-body-desktop text-soft-gray mb-3'>Đơn hàng {data.code} - {data.totalAmount}</p>
//         <Card className='my-3 bg-[#F5F7FA] rounded-[10px]'>
//           <div className="flex items-center justify-between my-2">
//             <p className='text-sm-body-desktop text-primary font-bold'>{data.code}</p>
//             <Tag variant={DELIVERY_STATUS[data.deliveryStatus].tagVariant}>
//               {DELIVERY_STATUS[data.deliveryStatus].name}
//             </Tag>
//           </div>
//           {/* <p className='text-sm-body-desktop text-soft-gray'>{data.product}</p> */}
//           <p className='text-sm-body-desktop text-soft-gray'>Ngày đặt: {formatDate(data.orderDate)}</p>
//           <p className='text-sm-body-desktop text-primary font-bold'>Tổng tiền: <span className='text-green-accent'>{data.totalAmount.toLocaleString()} VND</span></p>
//         </Card>
//         <div className='flex flex-col gap-3 my-5'>
//           <Card variant='default'>

//           </Card>
//         </div>
//         <Alert variant='danger'>
//           <p className='text-[0.9rem]'>Yêu cầu hoàn tiền sẽ được gửi cho quản lí để xem xét và phê duyệt. Vui lòng điền đầy đủ thông tin</p>
//         </Alert>
//         <div className='flex items-center gap-3 my-3'>
//           <Button variant='outline'>
//                       Hủy
//           </Button>
//           <Button className='bg-orange-600 hover:bg-orange-700 text-white'>
//             <FiRotateCcw className='size-4'/>
//                       Yêu cầu hoàn tiền
//           </Button>
//         </div>
//       </PopupBasic>
//     </AnimatePresence>
//   )
// }
