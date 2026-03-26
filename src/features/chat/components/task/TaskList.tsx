import Alert from '@/components/ui/alert/Alert'
import Card from '@/components/ui/card/Card'
import Checkbox from '@/components/ui/input/Checkbox'
import Tag from '@/components/ui/tag/Tag'
import { RiErrorWarningLine } from 'react-icons/ri'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

type TaskType = {
  id: string
  title: string
  content: string
  provider: string
  date: string
  type: 'search' | 'support' | 'create-order'
}

const taskList: TaskType[] = [
  { id: 'gagojoga', title: 'Tra cứu thông tin sản phẩm', content: 'Khách hỏi về sữa tươi Vinamilk không đường', provider: 'System', date: '2026-03-02 10:25', type: 'search' },
  { id: 'agtwhh', title: 'Tạo đơn hàng', content: 'Tạo đơn hàng 5 hộp sữa tươi Vinamilk 1L', provider: 'System', date: '2026-03-02 10:30', type: 'create-order' }
]

export default function TaskList() {
  return (
    <div>
      <p className='text-sm-body-desktop font-medium text-primary'>Task được giao</p>
      <p className='text-soft-gray text[0.95rem]'>Hoàn thành tất cả tasks để có thể đóng conversation</p>
      <div className='flex flex-col gap-3 my-3'>
        { taskList.map((task) => (
          <Card id={task.id} variant={'primary'} size='sm' className='text-sm/7'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <Checkbox id='task'/>
                <label htmlFor="task" className='text-sm-body-desktop font-bold text-primary'>{task.title}</label>
              </div>
              <Tag variant={
                task.type === 'create-order' ? 'success'
                  : task.type === 'search' ? 'primary'
                    : task.type === 'support' ? 'warn': 'default'
              } className='py-1 px-2'>
                {task.type}
              </Tag>
            </div>
            <p className='text-sm-body-desktop'>{task.content}</p>
            <p className='text-sm-body-desktop text-soft-gray'>Giao bởi: {task.provider} - {task.date}</p>
          </Card>
        )) }
      </div>
      <Alert variant={taskList.length === 0 ? 'success' : 'info'}>
        { taskList.length === 0 ?
          <div>
            <RiErrorWarningLine size={3} className='text-secondary'/>
            <div className='flex items-center gap-3'>
              <p className='text-sm-body-desktop font-medium'>Còn {taskList.length} tasks chưa hoàn thành</p>
              <p className='text-[0.85rem] text-soft-gray'>Hoàn thành tất cả để đóng conversation</p>
            </div>
          </div>
          :
          <div className='flex items-center gap-3'>
            <IoMdCheckmarkCircleOutline size={3}/>
            <div>
              <p className='text-sm-body-desktop font-medium'>Tất cả tasks đã hoàn thành</p>
              <p className='text-[0.85rem] text-soft-gray'>Bạn có thể đóng conversation này</p>
            </div>
          </div>
        }
      </Alert>
    </div>
  )
}
