import Card from '@/components/ui/card/Card'
import Tag from '@/components/ui/tag/Tag'
import { GoPerson } from 'react-icons/go'
import useGetTicket from '../../hooks/useGetTicket'
import type { TicketType } from '../../types/ticket-type'
import { formatDate } from '@/utils/date-resolver'
import { TICKET_CONVERSATION_STATUS } from '../../const/ticket-conversation-type'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import NodataCard from '@/components/ui/card/NodataCard'


function TicketCard({ data }: { data: TicketType}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-m-body-desktop text-primary font-bold">{data.keywordType}</p>
        <Tag variant={TICKET_CONVERSATION_STATUS[data.status].tagVariant}>
          {TICKET_CONVERSATION_STATUS[data.status].name}
        </Tag>
      </div>
      <p className="text-sm-body-desktop text-gray-500">{formatDate(data.completeDate)}</p>
      <p className="text-sm-body-desktop text-gray-600 my-7">{data.keywordType}</p>
      <div className="flex gap-2 items-center">
        <GoPerson className='text-gray-500 text-[0.95rem]'/>
        <p className="text-[0.85rem] text-gray-500">{data.staffName}</p>
      </div>
    </Card>
  )
}
export default function Ticket({ customerId }: { customerId?: string }) {
  const { listTickets, loading } = useGetTicket({ customerId: customerId })
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm-body-desktop">Lịch sử tickets</p>
        <Tag className="border border-gray-300">{listTickets?.length} tickets</Tag>
      </div>
      { loading ?
        <CardSkeleton count={3}/>
        :
        <>
          { listTickets && listTickets?.length > 0 ?
            <div className="flex flex-col gap-3">
              {listTickets?.map((data, index) => (
                <TicketCard key={index} data={data}/>
              ))}
            </div>
            :
            <NodataCard content='Không có ticket nào của khách hàng này'/>
          }
        </>
      }
    </div>
  )
}
