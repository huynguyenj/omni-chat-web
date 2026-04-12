import Tag from '@/components/ui/tag/Tag'
import { useState } from 'react'
import useGetListOrderCustomer from '../../hooks/useGetListOrderCustomer'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import NodataCard from '@/components/ui/card/NodataCard'
import OrderCard from '../order/OrderCard'


export default function CustomerOrder({ customerId }: { customerId?: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const { listOrders, loading } = useGetListOrderCustomer({ customerId: customerId, currentPage:  currentPage })

  return (
    <div className="flex flex-col">
      { loading ?
        <CardSkeleton count={3}/>
        :
        <>
          { listOrders ?
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm-body-desktop">Lịch sử đơn hàng</p>
                <Tag className="border border-gray-300">{listOrders?.meta.total_items} đơn</Tag>
              </div>
              { listOrders.items.length === 0 && <NodataCard content='Khách hàng chưa có đơn hàng'/>}
              <div className="flex flex-col gap-3">
                {listOrders?.items.map((data) => (
                  <OrderCard key={data.code} data={data}/>
                ))}
                { listOrders.meta.total_pages > 0 &&
                  <PaginationBar
                    currentPage={currentPage}
                    setPage={setCurrentPage}
                    totalPage={listOrders.meta.total_pages}
                  />
                }
              </div>
            </>
            :
            <p></p>
          }
        </>
      }
    </div>
  )
}
