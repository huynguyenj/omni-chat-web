import Alert from '@/components/ui/alert/Alert'
import Card from '@/components/ui/card/Card'
import Checkbox from '@/components/ui/input/Checkbox'
import Tag from '@/components/ui/tag/Tag'
import { RiErrorWarningLine } from 'react-icons/ri'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import useGetConversationTask from '../../hooks/useGetConversationTask'
import { TASK_STATUS } from '@/features/tasks/const/task-status'
import { formatDate, formatTime } from '@/utils/date-resolver'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import { useMemo } from 'react'

export default function TaskList() {
  const { conversationTasks, loading, handleUpdateTask } = useGetConversationTask()
  const totalTaskRemain = useMemo(() => {
    return conversationTasks?.filter((task) => task.status !== 'Done').length
  }, [conversationTasks])
  return (
    <div>
      <p className='text-sm-body-desktop font-medium text-primary'>Task được giao</p>
      <p className='text-soft-gray text[0.95rem]'>Hoàn thành tất cả tasks để có thể đóng conversation</p>
      { loading ?
        <CardSkeleton count={2}/>
        :
        <>
          <div className='flex flex-col gap-3 my-3'>
            <>
              { conversationTasks?.map((task) => (
                <Card key={task.id} variant={task.status === 'Done' ? 'secondary' : 'primary'} size='sm' className='text-sm/7'>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                      <Checkbox id='task' checked={task.status === 'Done'} onCheckedChange={() => handleUpdateTask(task.id)}/>
                      <label htmlFor="task" className={`text-sm-body-desktop font-bold text-primary ${task.status === 'Done' && 'line-through'}`}>{task.intentTypeName}</label>
                    </div>
                    <Tag variant={TASK_STATUS[task.status].tagVariant} className='py-1 px-2'>
                      {TASK_STATUS[task.status].name}
                    </Tag>
                  </div>
                  <p className='text-sm-body-desktop text-soft-gray'>Ngày giao: {formatDate(task.createdAt)}</p>
                  <p className='text-sm-body-desktop text-soft-gray'>Giờ giao: {formatTime(task.createdAt)}</p>
                  {/* <p className='text-sm-body-desktop'>{task.content}</p>
                <p className='text-sm-body-desktop text-soft-gray'>Giao bởi: {task.provider} - {task.date}</p> */}
                </Card>
              )) }
            </>
          </div>
          <Alert variant={totalTaskRemain === 0 ? 'success' : 'info'}>
            { totalTaskRemain === 0 ?
              <div className='flex items-center gap-3'>
                <IoMdCheckmarkCircleOutline className='size-7'/>
                <div>
                  <p className='text-sm-body-desktop font-medium'>Tất cả tasks đã hoàn thành</p>
                  <p className='text-[0.85rem] text-soft-gray'>Bạn có thể đóng conversation này</p>
                </div>
              </div>
              :
              <div className='flex items-center gap-3'>
                <RiErrorWarningLine className='text-secondary size-7'/>
                <div>
                  <p className='text-sm-body-desktop font-medium'>Còn {totalTaskRemain} tasks chưa hoàn thành</p>
                  <p className='text-[0.85rem] text-soft-gray'>Hoàn thành tất cả để đóng conversation</p>
                </div>
              </div>
            }
          </Alert>

        </>
      }
    </div>
  )
}
