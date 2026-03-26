import Card from '@/components/ui/card/Card'
import Tag from '@/components/ui/tag/Tag'
import { GoPerson } from 'react-icons/go'

type TicketType = {
  id: string
  date: string
  subject: string
  status: string
  assignee: string
}
const TicketDatas: TicketType[] = [
  { id: 'TKT001', date: '20/01/2026', subject: 'Hỏi về sản phẩm sữa', status: 'Đã giải quyết', assignee: 'Nhân viên B' },
  { id: 'TKT002', date: '15/01/2026', subject: 'Yêu cầu đổi hàng', status: 'Đã giải quyết', assignee: 'Nhân viên A' },
  { id: 'TKT003', date: '10/01/2026', subject: 'Tra cứu đơn hàng', status: 'Đã giải quyết', assignee: 'Nhân viên C' },
  { id: 'TKT004', date: '08/01/2026', subject: 'Sản phẩm hết hạn', status: 'Đã giải quyết', assignee: 'Nhân viên A' },
  { id: 'TKT005', date: '05/01/2026', subject: 'Khuyến mãi tháng 1', status: 'Đã giải quyết', assignee: 'Nhân viên B' },
  { id: 'TKT006', date: '28/12/2025', subject: 'Giao hàng trễ', status: 'Đã giải quyết', assignee: 'Nhân viên C' },
  { id: 'TKT007', date: '20/12/2025', subject: 'Hỏi về bảo quản sữa', status: 'Đã giải quyết', assignee: 'Nhân viên A' },
  { id: 'TKT008', date: '15/12/2025', subject: 'Yêu cầu hóa đơn đỏ', status: 'Đã giải quyết', assignee: 'Nhân viên B' }
]
function TicketCard({ data }: { data: TicketType}) {
  const tag = (status: string) => {
    switch (status) {
    case 'Đã giải quyết': return <Tag className="text-[0.75rem] text-white font-bold" variant='success'>Đã giải quyết</Tag>
    case 'Chưa giải quyết': return <Tag className="text-[0.75rem] text-white font-bold" variant='danger'>Chưa giải quyết</Tag>

    }
  }
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-m-body-desktop text-primary font-bold">{data.id}</p>
        {tag(data.status)}
      </div>
      <p className="text-sm-body-desktop text-gray-500">{data.date}</p>
      <p className="text-sm-body-desktop text-gray-600 my-7">{data.subject}</p>
      <div className="flex gap-2 items-center">
        <GoPerson className='text-gray-500 text-[0.95rem]'/>
        <p className="text-[0.85rem] text-gray-500">{data.assignee}</p>
      </div>
    </Card>
  )
}
export default function Ticket() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm-body-desktop">Lịch sử tickets</p>
        <Tag className="border border-gray-300">{TicketDatas.length} tickets</Tag>
      </div>
      <div className="flex flex-col gap-3">
        {TicketDatas.map((data) => (
          <TicketCard data={data}/>
        ))}
      </div>
    </div>
  )
}
