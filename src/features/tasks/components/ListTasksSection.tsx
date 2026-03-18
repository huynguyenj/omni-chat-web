import Card from '@/components/ui/card/Card'
import Input from '@/components/ui/input/Input'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import { CiFilter } from 'react-icons/ci'
import { CiCalendar } from 'react-icons/ci'
import { IoSearch } from 'react-icons/io5'
import TaskAnalysisBox from './ui/TaskAnalysisBox'
import { LuCircleCheckBig } from 'react-icons/lu'
import { RiErrorWarningLine } from 'react-icons/ri'
import { LuClock } from 'react-icons/lu'
import { ScrollArea } from '@/components/ui/scrollbar/ScrollArea'

interface Task {
  id: string;
  conversationId: string;
  customerName: string;
  title: string;
  description: string;
  type: 'lookup' | 'create-order' | 'support' | 'follow-up';
  status: 'completed' | 'pending';
  createdDate: string;
  completedDate?: string;
  duration?: number; // minutes
}
const MOCK_TASKS: Task[] = [
  {
    id: 'T001',
    conversationId: 'C001',
    customerName: 'Nguyễn Văn A',
    title: 'Tra cứu thông tin sản phẩm',
    description: 'Tra cứu thông tin sữa tươi Vinamilk không đường',
    type: 'lookup',
    status: 'completed',
    createdDate: '2026-03-01 10:25',
    completedDate: '2026-03-01 10:28',
    duration: 3
  },
  {
    id: 'T002',
    conversationId: 'C001',
    customerName: 'Nguyễn Văn A',
    title: 'Kiểm tra tồn kho',
    description: 'Kiểm tra tồn kho sữa tươi theo size và màu',
    type: 'lookup',
    status: 'completed',
    createdDate: '2026-03-01 10:30',
    completedDate: '2026-03-01 10:32',
    duration: 2
  },
  {
    id: 'T003',
    conversationId: 'C001',
    customerName: 'Nguyễn Văn A',
    title: 'Tạo đơn hàng',
    description: 'Tạo đơn hàng 5 hộp sữa tươi Vinamilk không đường 1L',
    type: 'create-order',
    status: 'completed',
    createdDate: '2026-03-01 10:35',
    completedDate: '2026-03-01 10:42',
    duration: 7
  },
  {
    id: 'T004',
    conversationId: 'C002',
    customerName: 'Trần Thị B',
    title: 'Hỗ trợ đổi trả hàng',
    description: 'Hướng dẫn chính sách đổi trả sản phẩm sữa',
    type: 'support',
    status: 'completed',
    createdDate: '2026-02-28 14:15',
    completedDate: '2026-02-28 14:25',
    duration: 10
  },
  {
    id: 'T005',
    conversationId: 'C003',
    customerName: 'Lê Văn C',
    title: 'Tra cứu lịch sử đơn hàng',
    description: 'Xem lịch sử mua hàng của khách để tư vấn',
    type: 'lookup',
    status: 'completed',
    createdDate: '2026-02-28 09:40',
    completedDate: '2026-02-28 09:43',
    duration: 3
  },
  {
    id: 'T006',
    conversationId: 'C004',
    customerName: 'Phạm Thị D',
    title: 'Follow-up đơn hàng',
    description: 'Kiểm tra trạng thái giao hàng và thông báo khách',
    type: 'follow-up',
    status: 'completed',
    createdDate: '2026-02-27 16:20',
    completedDate: '2026-02-27 16:28',
    duration: 8
  },
  {
    id: 'T007',
    conversationId: 'C005',
    customerName: 'Hoàng Văn E',
    title: 'Tạo đơn hàng combo',
    description: 'Tạo đơn combo sữa bột cho bé',
    type: 'create-order',
    status: 'completed',
    createdDate: '2026-02-27 11:10',
    completedDate: '2026-02-27 11:20',
    duration: 10
  },
  {
    id: 'T008',
    conversationId: 'C006',
    customerName: 'Vũ Thị F',
    title: 'Tư vấn sản phẩm',
    description: 'Tư vấn loại sữa phù hợp cho người tiểu đường',
    type: 'support',
    status: 'completed',
    createdDate: '2026-02-26 15:30',
    completedDate: '2026-02-26 15:45',
    duration: 15
  },
  {
    id: 'T009',
    conversationId: 'C007',
    customerName: 'Đặng Văn G',
    title: 'Kiểm tra khuyến mãi',
    description: 'Tra cứu các chương trình khuyến mãi hiện hành',
    type: 'lookup',
    status: 'completed',
    createdDate: '2026-02-25 10:05',
    completedDate: '2026-02-25 10:08',
    duration: 3
  },
  {
    id: 'T010',
    conversationId: 'C008',
    customerName: 'Bùi Thị H',
    title: 'Tạo đơn hàng',
    description: 'Đơn hàng sữa chua uống TH True Milk',
    type: 'create-order',
    status: 'completed',
    createdDate: '2026-02-24 14:50',
    completedDate: '2026-02-24 15:00',
    duration: 10
  }
]

export default function ListTasksSection() {
  const handleStatusIconColor = (status: string) => {
    switch (status) {
    case 'completed': return <TaskAnalysisBox variant='success' className='p-2'><LuCircleCheckBig className='size-5'/></TaskAnalysisBox>
    case 'pending': return <TaskAnalysisBox variant='yellow' className='p-2'><RiErrorWarningLine className='size-5'/></TaskAnalysisBox>
    }
  }
  return (
    <div className='w-full flex flex-col gap-5'>
      <Card className='flex gap-3 rounded-2xl  border-2 border-border-primary py-4'>
        <div className='flex-4'>
          <Input variant='gray' placeholder='Tìm kiếm task' icon={IoSearch}/>
        </div>
        <div className='flex flex-2 items-center gap-3'>
          <AdvSelect>
            <SelectTrigger>
              <CiFilter className='size-5'/>
              <SelectValue placeholder="Loại công việc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="lookup">Tra cứu</SelectItem>
              <SelectItem value="create-order">Tạo đơn</SelectItem>
              <SelectItem value="support">Hỗ trợ</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
            </SelectContent>
          </AdvSelect>
          <AdvSelect>
            <SelectTrigger>
              <CiCalendar className='size-5'/>
              <SelectValue placeholder='Thời gian'/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="90days">3 tháng qua</SelectItem>
              <SelectItem value="all">Tất cả</SelectItem>
            </SelectContent>
          </AdvSelect>
        </div>
      </Card>
      <Card className='flex flex-col gap-3 rounded-2xl  border-2 border-border-primary py-4 px-0 overflow-y-auto'>
        <p className='text-sm-body-desktop text-primary font-medium px-4'>Danh sách tasks</p>
        <hr className='border border-border-primary w-full'/>
        <ScrollArea className='h-125'>
          <div className='px-5'>
            { MOCK_TASKS.map((task) => (
              <Card key={task.id} className='flex gap-3 py-4 text-sm/7 my-4'>
                <div>
                  {handleStatusIconColor(task.status)}
                </div>
                <div>
                  <p className='text-m-body-desktop font-medium'>{task.title}</p>
                  <p className='text-sm-body-desktop'>{task.description}</p>
                  <div className="flex items-center gap-4 text-[0.85rem] text-soft-gray">
                    <span>Conversation: {task.conversationId}</span>
                    <span>•</span>
                    <span>Khách hàng: {task.customerName}</span>
                    <span>•</span>
                    <span>Hoàn thành: {task.completedDate}</span>
                    {task.duration && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <LuClock className="size-3" />
                          {task.duration} phút
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )) }
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
