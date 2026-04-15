
import { BsStars } from 'react-icons/bs'
// import type { Recommendation } from '../../types/system-recommendation-type'
import CreateOrderSection from '../order/CreateOrderSection'
import OrderHistorySection from '../order/OrderHistorySection'
import ProductStorageSection from '../product/ProductStorageSection'


// function CustomerProfileButton({ customerData }: { customerData: CustomerType }) {
//   const [isOpen, setIsOpen] = useState(false)
//   const handleOpen = () => {
//     setIsOpen((prev) => !prev)
//   }
//   return (
//     <>
//       <Button variant='outline' className='rounded-2xl py-2 border border-blue-200 hover:bg-secondary hover:text-white hover:border-none gap-2'>
//         <IoPersonCircleOutline className='text-[1.25rem]'/>
//         Thông tin khách hàng
//       </Button>
//       { isOpen &&
//         <PopupBasic title='Thông tin sản phẩm' onClose={handleOpen}>
//         </PopupBasic>
//       }
//     </>
//   )
// }

export default function SystemRecommendation() {
  // const button = (recommend: Recommendation) => {
  //   // if (recommend.recommendType === 'SearchCustomerInfo')
  //   //   return <CustomerProfileButton customerData={recommend.data} />

  //   if (recommend.recommendType === 'SearchOrderHistory')
  //     return <OrderHistorySection />

  //   if (recommend.recommendType === 'SearchProduct')
  //     return <ProductStorageSection/>
  // }
  return (
    <div className="py-2 px-3 bg-linear-to-r from-blue-100 to-[#F9F5FF] border border-border-secondary rounded-lg mb-2 min-w-90">
      <div className="flex items-center gap-2">
        <BsStars className="text-secondary"/>
        <p className="text-sm-body-desktop text-primary">Gợi ý từ hệ thống</p>
      </div>
      <div className='grid grid-cols-2 items-center justify-center mt-2 gap-2'>
        {/* { recommends?.map((data) => (
          <div key={data.recommendType} className='mt-1'>
            {button(data)}
          </div>
        )) } */}
        <OrderHistorySection/>
        <ProductStorageSection/>
        <CreateOrderSection/>
      </div>
    </div>
  )
}
