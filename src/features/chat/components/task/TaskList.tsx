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
import { useMemo, useState } from 'react'
import Button from '@/components/ui/button/Button'
import { Edit, Trash2 } from 'lucide-react'
import useUpdateTask from '@/features/tasks/hooks/useUpdateTask'
import useDeleteTask from '@/features/tasks/hooks/useDeleteTask'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import { Controller } from 'react-hook-form'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import useGetIntentType from '@/features/tasks/hooks/useGetIntentType'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'

export default function TaskList() {
  const { conversationTasks, loading, handleUpdateTask, handleRefresh } = useGetConversationTask()
  const totalTaskRemain = useMemo(() => {
    return conversationTasks?.filter((task) => task.status !== 'Done').length
  }, [conversationTasks])
  const { errors, handleSubmit, loading: updateLoading, onSubmit, reset, setTaskId, control } = useUpdateTask({ onRefresh: handleRefresh })
  const { handleDelete, loading: deleteLoading, setTaskId: setDeleteTaskId } = useDeleteTask({ onRefresh: handleRefresh })
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const { intentType } = useGetIntentType()
  const handleEditOpen = (taskId: string) => {
    setTaskId(taskId)
    setIsEditOpen(prevState => !prevState)
    reset()
  }
  const handleDeleteOpen = (taskId: string) => {
    setDeleteTaskId(taskId)
    setDeleteOpen(prevState => !prevState)
  }
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
                  <div className='flex flex-col xl:flex-row xl:justify-between xl:items-center'>
                    <div className='flex items-center gap-2'>
                      <Checkbox id='task' checked={task.status === 'Done'} onCheckedChange={() => handleUpdateTask(task.id)}/>
                      <label htmlFor="task" className={`text-sm-body-desktop font-bold text-primary ${task.status === 'Done' && 'line-through'}`}>{task.intentTypeName}</label>
                    </div>
                    <Tag variant={TASK_STATUS[task.status].tagVariant} className='py-0.5 px-2'>
                      {TASK_STATUS[task.status].name}
                    </Tag>
                  </div>
                  <p className='text-sm-body-desktop text-soft-gray'>Ngày giao: {formatDate(task.createdAt)}</p>
                  <p className='text-sm-body-desktop text-soft-gray'>Giờ giao: {formatTime(task.createdAt)}</p>
                  {/* <p className='text-sm-body-desktop'>{task.content}</p>
                <p className='text-sm-body-desktop text-soft-gray'>Giao bởi: {task.provider} - {task.date}</p> */}
                  <div className='flex gap-2 justify-end'>
                    { task.status === 'InProgress' &&
                    <Button onClick={() => handleEditOpen(task.id)}>
                      <Edit/>
                    </Button>
                    }
                    <Button variant='danger' onClick={() => handleDeleteOpen(task.id)}>
                      <Trash2/>
                    </Button>
                  </div>
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
      { isEditOpen &&
        <PopupBasic onClose={() => setIsEditOpen(false)} title='Cập nhật nhiệm vụ'>
          <Controller
            control={control}
            name='newIntentTypeId'
            render={({ field }) => (
              <AdvSelect
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn loại đơn'/>
                </SelectTrigger>
                <SelectContent>
                  { intentType ?
                    intentType.map((intent) => (
                      <SelectItem key={intent.id} value={intent.id}>{intent.typeName}</SelectItem>
                    ))
                    :
                    <SelectItem value=''></SelectItem>
                  }
                </SelectContent>
              </AdvSelect>
            )}
          />
          { errors.newIntentTypeId?.message && <p className='text-sm-body-desktop text-red-400 mb-3 font-medium'>{errors.newIntentTypeId.message}</p> }
          <div className='flex items-center justify-end gap-2 mt-4'>
            { updateLoading ?
              <LoadingSpinner size='sm'/>
              :
              <>
                <Button variant='outline' className='border border-border-primary text-black px-5 hover:bg-gray-200' onClick={() => setIsEditOpen(false)}>
                                              Hủy
                </Button>
                <Button onClick={handleSubmit(onSubmit)}>
                                              Lưu
                </Button>
              </>
            }
          </div>
        </PopupBasic>
      }
      { isDeleteOpen &&
        <PopupBasic onClose={() => setDeleteOpen(false)} title='Bạn có chắc chắn muốn xóa nhiệm vụ'>
          <div className='flex items-center justify-end gap-2 mt-4'>
            { deleteLoading ?
              <LoadingSpinner size='sm'/>
              :
              <>
                <Button variant='outline' className='border border-border-primary text-black px-5 hover:bg-gray-200' onClick={() => setDeleteOpen(false)}>
                                    Không
                </Button>
                <Button onClick={handleDelete} variant='danger'>
                                    Có
                </Button>
              </>
            }
          </div>
        </PopupBasic>
      }
    </div>
  )
}
