import { useContext, useMemo } from 'react'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import useGetResolveMessage from '../hooks/useGetResolveMessage'
import { useAuthStore } from '@/features/auth/store/auth-store'
import AwaitMessageBox from './ui/AwaitMessageBox'
import { getTimeHelper } from '../utils/time-helper'


// type ProductListType = {
//   name: string
//   storage: number
//   productId: string
// }
// const listProducts: ProductListType[] = [
//   { name: 'Sữa tươi Vinamilk - Sữa tươi', storage: 286, productId: 'gojgoaehioeg1324' },
//   { name: 'Sữa chua uống TH True Milk - Sữa chua', storage: 195, productId: 'gojgoaehihow1324' },
//   { name: 'Sữa đặc Ông Thọ - Sữa đặc', storage: 142, productId: 'ahojoaaot1324' },
//   { name: 'Sữa bột Ensure Gold - Sữa bột', storage: 78, productId: 'ohaotjnahoi1324' },
//   { name: 'Sữa tươi tiệt trùng Da Lat Milk - Sữa tươi', storage: 210, productId: 'olkmvojagta1324' },
//   { name: 'Sữa chua uống Vinamilk - Sữa chua', storage: 125, productId: 'qouoiuetiouw1324' }
// ]

// function OrderButton() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [index, setIndex] = useState(1)
//   const handleOpen = () => {
//     setIsOpen((prev) => !prev)
//   }
//   const handlePrev = () => {
//     if (index == 1) return
//     setIndex((page) => page - 1)
//   }
//   const handleNext = () => {
//     if (index == 4) return
//     setIndex((page) => page + 1)
//   }
//   return (
//     <>
//       <Button variant='outline' className='rounded-2xl py-2 border border-border-secondary hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleOpen}>
//         <MdOutlineShoppingCart/>
//           Tạo đơn hàng mới
//       </Button>
//       <AnimatePresence>
//         {isOpen &&
//           <PopupBasic title='Tạo đơn hàng mới' onClose={handleOpen}>
//             <p className='text-soft-gray text-[1rem]'>Hướng dẫn tạo đơn hàng mới</p>
//             { index == 1 &&
//             <div id='index#1'>
//               <div className='mt-7'>
//                 <TutorialBox step='Bước 1: Chọn sản phẩm sữa' description='Hãy chọn sản phẩm khách hàng muốn đặt'/>
//                 <div className='my-5'>
//                   <label htmlFor="select-product" className='text-primary text-sm-body-desktop font-bold'>Tên sản phẩm</label>
//                   <Select id='select-product' className='border border-border-primary mt-2'>
//                     <option value="">Chọn sản phẩm...</option>
//                     {listProducts.map((product) => (
//                       <option id={product.productId} value={product.productId}>{product.name} <span>({product.storage})</span></option>
//                     ))}
//                   </Select>
//                 </div>
//                 <Input label='Số lượng' variant='gray' type='number'/>
//               </div>
//               <Button className='w-full font-bold mt-5' onClick={handleNext}>
//                   Tiếp theo
//                 <IoIosArrowForward/>
//               </Button>
//             </div>
//             }
//             { index == 2 &&
//             <div id='index#2'>
//               <div className='mt-7'>
//                 <TutorialBox step='Bước 2: Chọn dung tích và loại' description='Chọn phiên bản sản phẩm khách hàng mong muốn'/>
//                 <div className='my-5'>
//                   <label htmlFor="select-product" className='text-primary text-sm-body-desktop font-bold'>Tên sản phẩm</label>
//                   <Select id='select-product' className='border border-border-primary mt-2'>
//                     <option value="">Chọn sản phẩm...</option>
//                     {listProducts.map((product) => (
//                       <option id={product.productId} value={product.productId}>{product.name} <span>({product.storage})</span></option>
//                     ))}
//                   </Select>
//                 </div>
//                 <Input label='Số lượng' variant='gray' type='number'/>
//               </div>
//               <div className='flex gap-2'>
//                 <Button variant='outline' className='w-full font-bold mt-5 border-2 border-border-primary text-black hover:bg-gray-100' onClick={handlePrev}>
//                   Quay lại
//                 </Button>
//                 <Button className='w-full font-bold mt-5' onClick={handleNext}>
//                   Tiếp theo
//                   <IoIosArrowForward/>
//                 </Button>
//               </div>
//             </div>
//             }
//             { index == 3 &&
//             <div id='index#3'>

//             </div>
//             }
//             { index == 4 &&
//             <div id='index#4'>

//             </div>
//             }
//           </PopupBasic>
//         }
//       </AnimatePresence>
//     </>
//   )
// }
export default function ResolveMessage() {
  const context = useContext(SelectionMessageContext)
  const staffId = useAuthStore((state) => state.staffId)
  const { resolveMessageTab } = useGetResolveMessage(staffId)
  const platform = useMemo(() => {
    if (!context?.providerName) return 'Không xác định'
    if (context.providerName === 'Facebook') return 'messenger'
    else if (context.providerName === 'Zalo') return 'zalo'
    else return 'Không xác định'
  }, [context?.providerName])
  return (
    <div>
      <div className='border-b border-gray-200 py-4 px-5'>
        <p className='text-sm-body-desktop text-primary'>Tin nhắn được phân công</p>
        <p className='text-[0.95rem]'>{resolveMessageTab.length} cuộc hội thoại</p>
      </div>
      {resolveMessageTab ? 
        resolveMessageTab.map((data) => (
          <div key={data.conversationId} className={`${context?.conversationId === data.conversationId && 'border-l-6 border-secondary bg-[#ebf3fb]'} hover:bg-[#F9FAFB] cursor-pointer`} onClick={() => context?.handleChoose(data.conversationId)}>
            <AwaitMessageBox
              customerName={data.customerName}
              message={data.lastMessage}
              time={getTimeHelper(data.updateDate)}
              platform={platform}
              totalAwaitMessage={data.unreadMessageCount}
            />
          </div>
        ))
        :
        <p className='text-sm-body-desktop'>Chưa có tin nhắn cần được xử lí</p>
      }
    </div>
  )
}

