
import { BsStars } from 'react-icons/bs'
// import type { Recommendation } from '../../types/system-recommendation-type'
import CreateOrderSection from '../order/CreateOrderSection'
import OrderHistorySection from '../order/OrderHistorySection'
import ProductStorageSection from '../product/ProductStorageSection'
import type { Recommendation } from '../../types/system-recommendation-type'


export default function SystemRecommendation({ recommends }: { recommends: Recommendation[] | [], message: string }) {
  const button = (recommend: Recommendation) => {
    // if (recommend.recommendType === 'SearchCustomerInfo')
    //   return <CustomerProfileButton customerData={recommend.data} />

    if (recommend.recommendType === 'SearchOrderHistory')
      return <OrderHistorySection />

    if (recommend.recommendType === 'SearchProduct')
      return <ProductStorageSection/>

    // if (recommend.recommendType === 'AutoCreateOrder')
    //   return <AutoCreateOrderButton message={message}/>
    if (recommend.recommendType === 'CreateOrder')
      return <CreateOrderSection/>
  }
  return (
    <div className="py-2 px-3 bg-linear-to-r from-blue-100 to-[#F9F5FF] border border-border-secondary rounded-lg mb-2 min-w-90 w-fit">
      <div className="flex items-center gap-2">
        <BsStars className="text-secondary"/>
        <p className="text-sm-body-desktop text-primary">Gợi ý từ hệ thống</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 items-center justify-center mt-2 gap-2'>
        { recommends?.map((data) => (
          <div key={data.recommendType} className='mt-1'>
            {button(data)}
          </div>
        )) }
      </div>
    </div>
  )
}
