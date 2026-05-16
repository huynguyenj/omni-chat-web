import Card from '@/components/ui/card/Card'
import Input from '@/components/ui/input/Input'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import { CiFilter } from 'react-icons/ci'
import { CiCalendar } from 'react-icons/ci'
import { IoSearch } from 'react-icons/io5'
import { LuClock } from 'react-icons/lu'
import { ScrollArea } from '@/components/ui/scrollbar/ScrollArea'
import useGetIntentType from '../hooks/useGetIntentType'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { useState } from 'react'
import useGetListTasks from '../hooks/useGetListTasks'
import useDebounce from '@/hooks/useDebounce'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import NodataCard from '@/components/ui/card/NodataCard'
import { formatDate, formatTime } from '@/utils/date-resolver'
import Tag from '@/components/ui/tag/Tag'
import { TASK_STATUS } from '../const/task-status'

export default function ListTasksSection() {
  const { intentType } = useGetIntentType()
  const [currentPage, setCurrentPage] = useState(1)
  const { handleFilterByDate, handleFilterByType, loading, setFilter, listTasks } = useGetListTasks({ currentPage: currentPage })

  const handleSearch = (value: string) => {
    setFilter((prevVal) => {
      return { ...prevVal, taskName: value }
    })
  }

  const debouncedSearch = useDebounce(handleSearch, 500)

  return (
    <div className='w-full flex flex-col gap-5'>
      <Card className='grid grid-cols-1 xl:flex gap-3 rounded-2xl border-2 border-border-primary py-4'>
        <div className='flex-4'>
          <Input onChange={(e) => debouncedSearch(e.target.value)} variant='gray' placeholder='Tìm kiếm task' icon={IoSearch}/>
        </div>
        <div className='flex flex-col sm:flex-row flex-2 items-center gap-3'>
          <AdvSelect onValueChange={(value) => handleFilterByType(value) }>
            <SelectTrigger>
              <CiFilter className='size-5'/>
              <SelectValue placeholder="Loại công việc" />
            </SelectTrigger>
            <SelectContent>
              { intentType ?
                <>
                  <SelectItem value='all'>Tất cả</SelectItem>
                  { intentType.map((i) => (
                    <SelectItem key={i.id} value={i.id}>{i.typeName}</SelectItem>
                  ))}
                </>
                :
                <SelectItem value='not-thing'></SelectItem>
              }

            </SelectContent>
          </AdvSelect>
          <AdvSelect onValueChange={(value) => handleFilterByDate(value) }>
            <SelectTrigger>
              <CiCalendar className='size-5'/>
              <SelectValue placeholder='Thời gian'/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="90days">3 tháng qua</SelectItem>
            </SelectContent>
          </AdvSelect>
        </div>
      </Card>
      <Card className='flex flex-col gap-3 rounded-2xl  border-2 border-border-primary py-4 px-0 overflow-y-auto'>
        <p className='text-sm-body-desktop text-primary font-medium px-4'>Danh sách tasks</p>
        <hr className='border border-border-primary w-full'/>
        <ScrollArea className='h-125'>
          { loading ?
            <CardSkeleton count={5}/>
            :
            <>
              { listTasks ?
                <>
                  <div className='px-5'>
                    { listTasks.items.map((task) => (
                      <Card key={task.id} className='flex flex-col xl:flex-row gap-3 py-4 text-sm/7 my-4'>
                        <div>
                          <Tag variant={TASK_STATUS[task.status].tagVariant} className='py-0.5'>
                            {TASK_STATUS[task.status].name}
                          </Tag>
                        </div>
                        <div>
                          <p className='text-m-body-desktop font-medium'>{task.intentTypeName}</p>
                          <div className="flex flex-col xl:flex-row xl:items-center gap-4 text-[0.85rem] text-soft-gray">
                            {/* <span>Conversation: {task.}</span> */}
                            <span>• Khách hàng: {task.customerName}</span>
                            <span>• Hoàn thành: {formatDate(task.completedAt)}</span>
                            <span className="flex items-center gap-1">
                              •
                              <LuClock className="size-3" />
                              {formatTime(task.completedAt)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    )) }
                  </div>
                  <PaginationBar
                    currentPage={currentPage}
                    setPage={setCurrentPage}
                    totalPage={listTasks.meta.total_pages}
                  />
                </>
                :
                <NodataCard content='Không có dữ liệu của task'/>
              }

            </>
          }
        </ScrollArea>
      </Card>
    </div>
  )
}
