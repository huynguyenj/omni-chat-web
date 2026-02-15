import Card from '@/components/ui/card/Card'
import Tag from '@/components/ui/tag/Tag'

type CustomerOrderType = {
  id: string
  date: string
  status: string
  product: string
  quantity: number
  total: string
}

const CustomerOrderData: CustomerOrderType[] = [
  {
    id: 'ORD001',
    date: '15/01/2026',
    product: 'Sữa tươi Vinamilk không đường + 1 sản phẩm khác',
    quantity: 5,
    total: '148.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD002',
    date: '10/01/2026',
    product: 'Sữa đặc có đường Ông Thọ',
    quantity: 1,
    total: '42.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD003',
    date: '28/12/2025',
    product: 'Sữa bột Ensure Gold 850g + 1 sản phẩm khác',
    quantity: 3,
    total: '755.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD004',
    date: '20/12/2025',
    product: 'Sữa chua uống Vinamilk có đường',
    quantity: 5,
    total: '150.000đ',
    status: 'Đang giao'
  },
  {
    id: 'ORD005',
    date: '15/12/2025',
    product: 'Sữa bột Grow Plus+ 900g',
    quantity: 2,
    total: '900.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD006',
    date: '08/12/2025',
    product: 'Sữa tươi Vinamilk không đường + 1 sản phẩm khác',
    quantity: 10,
    total: '296.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD007',
    date: '01/12/2025',
    product: 'Sữa đặc có đường Ông Thọ',
    quantity: 3,
    total: '126.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD008',
    date: '25/11/2025',
    product: 'Sữa tươi tiệt trùng Dalat Milk + 1 sản phẩm khác',
    quantity: 9,
    total: '295.000đ',
    status: 'Đã giao'
  }
]

function OrderCard({ data }: { data: CustomerOrderType }) {
  const tag = (status: string) => {
    switch (status) {
    case 'Đã giao': return <Tag className="text-[0.75rem] text-white font-bold" variant='success'>Đã giao </Tag>
    case 'Đang giao': return <Tag className="text-[0.75rem] text-white font-bold" variant='primary'>Đang giao</Tag>

    }
  }
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-m-body-desktop text-primary font-bold">{data.id}</p>
        {tag(data.status)}
      </div>
      <p className="text-sm-body-desktop text-gray-500">{data.date}</p>
      <div className="bg-gray-100 py-1 px-3 rounded-[5px] my-10">
        <p className="text-sm-body-desktop text-gray-600">{data.product}</p>
      </div>
      <hr className="text-gray-200 mb-3"/>
      <div className="flex justify-between items-center">
        <p className="text-sm-body-desktop text-gray-500">Số lượng: {data.quantity}</p>
        <p className="text-sm-body-desktop text-green-accent">{data.total}</p>
      </div>
    </Card>
  )
}

export default function CustomerOrder() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm-body-desktop">Lịch sử đơn hàng</p>
        <Tag className="border border-gray-300">{CustomerOrderData.length} đơn</Tag>
      </div>
      <div className="flex flex-col gap-3">
        {CustomerOrderData.map((data) => (
          <OrderCard data={data}/>
        ))}
      </div>
    </div>
  )
}
