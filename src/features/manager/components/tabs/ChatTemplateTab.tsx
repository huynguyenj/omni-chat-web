import Card from '@/components/ui/card/Card'
import useGetChatTemplate from '../../hooks/useGetChatTemplate'
import Button from '@/components/ui/button/Button'
import { Edit, Plus, Save, Search, Trash2 } from 'lucide-react'
import Input from '@/components/ui/input/Input'
import { useState } from 'react'
import useCreateChatTemplate from '../../hooks/useCreateChatTemplate'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import useDebounce from '@/hooks/useDebounce'
import { TableSkeleton } from '@/components/ui/skeleton/TableSkeleton'
import { AnimatePresence } from 'motion/react'
import NodataCard from '@/components/ui/card/NodataCard'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import useDeleteChatTemplate from '../../hooks/useDeleteChatTemplate'
import useUpdateChatTemplate from '../../hooks/useUpdateChatTemplate'
import { IoIosCloseCircle } from 'react-icons/io'
import type { ChatTemplateType } from '../../types/chat-template-type'

export default function ChatTemplateTab() {
  const { listChatTemplate, loading, setCurrentPage, currentPage, setSearchText, handleRefresh } = useGetChatTemplate()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [chatTemplateId, setChatTemplateId] = useState('')
  const { handleDelete, loading: deleteLoading } = useDeleteChatTemplate({ onRefresh: handleRefresh })
  const { errors, handleSubmit, loading: createLoading, onSubmit, register } = useCreateChatTemplate({ onRefresh: handleRefresh })
  const { errors: updateError, handleSubmit: handleUpdateSubmit, loading: updateLoading, onSubmit: onUpdateSubmit, register: updateRegister, reset } = useUpdateChatTemplate({ onRefresh: handleRefresh, id: chatTemplateId })
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  const debounce = useDebounce(handleSearch, 400)
  const handleOpenCreatePopup = () => {
    setIsCreateOpen(prevState => !prevState)
  }

  const handleOpenAlert = (id: string) => {
    setChatTemplateId(id)
    setIsAlertOpen(prev => !prev)
  }

  const handleEditOpen = (chatTemplate: ChatTemplateType) => {
    setIsEditOpen(prev => !prev)
    setChatTemplateId(chatTemplate.id)
    reset({
      code: chatTemplate.code,
      content: chatTemplate.content
    })
  }
  return (
    <div className='space-y-6'>
      <Card className='p-6 text-sm-body-desktop'>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-sm-title-desktop font-semibold">Quản lý mẫu chat</h2>
            <p className="text-sm-body-desktop text-soft-gray mt-1">Danh sách các mẫu chat</p>
          </div>
          <Button className='text-nowrap' onClick={handleOpenCreatePopup}>
            <Plus className='size-4'/>
                  Tạo từ mẫu mới
          </Button>
        </div>
        <div className='flex flex-col sm:flex-row w-full my-2 sm:justify-between sm:items-center gap-2'>
          <Input variant='gray' placeholder='Tìm kiếm theo mã code, nội dung...' icon={Search} onChange={(e) => debounce(e.target.value)}/>
        </div>
        { loading ?
          <TableSkeleton numberOfColumn={4}/>
          :
          <>
            { listChatTemplate && listChatTemplate.items.length > 0 ?
              <div className='overflow-x-auto'>
                <table className='w-full border border-border-primary my-3 table-fixed min-w-200 '>
                  <thead className='bg-secondary'>
                    <tr className='text-white'>
                      <th className='py-2 text-start px-5 w-1/3'>Id</th>
                      <th className='py-2 text-start px-5 w-1/4'>Mã viết tắt</th>
                      <th className='py-2 text-start px-5 w-1/2'>Nội dung</th>
                      <th className='py-2 text-end px-5 w-1/6'>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listChatTemplate.items.map((template) => (
                      <tr key={template.id}>
                        <td className='py-2 px-5 w-1/3 border-r border-b-2 border-border-primary'>
                          <p>{template.id}</p>
                        </td>
                        <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                          { isEditOpen && chatTemplateId == template.id ?
                            <Input {...updateRegister('code')} variant='gray' error={updateError.code?.message}/>
                            :
                            <p>{template.code}</p>
                          }
                        </td>
                        <td className='py-2 px-5 w-1/2 wrap-break-word border-r border-b-2 border-border-primary'>
                          { isEditOpen && chatTemplateId == template.id ?
                            <Input {...updateRegister('content')} variant='gray' error={updateError.content?.message}/>
                            :
                            <p>{template.content}</p>
                          }
                        </td>
                        <td className='py-2 px-5  border-r border-b-2 border-border-primary'>
                          <div className='flex justify-end items-center gap-2 '>
                            {
                              isEditOpen && chatTemplateId == template.id ?
                                <div className='flex gap-2 items-center'>
                                  { updateLoading ?
                                    <LoadingSpinner/>
                                    :
                                    <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-70'>
                                      <Save className='text-secondary' onClick={handleUpdateSubmit(onUpdateSubmit)}/>
                                    </Button>
                                  }
                                  <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-70'>
                                    <IoIosCloseCircle className='text-red-400 size-5' onClick={() => setIsEditOpen(false)}/>
                                  </Button>
                                </div>
                                :
                                <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-70'>
                                  <Edit className='text-secondary' onClick={() => handleEditOpen(template)}/>
                                </Button>
                            }
                            <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleOpenAlert(template.id)}>
                              <Trash2 className='text-red-500'/>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationBar
                  currentPage={currentPage}
                  setPage={setCurrentPage}
                  totalPage={listChatTemplate.meta.total_pages}
                />
              </div>
              :
              <NodataCard/>
            }
          </>
        }
      </Card>
      <AnimatePresence>
        { isCreateOpen &&
            <PopupBasic onClose={handleOpenCreatePopup} title='Tạo từ mẫu mới'>
              <div className='my-2'>
                <Input {...register('code')} variant='gray' placeholder='H010' label='Mã mẫu' error={errors.code?.message}/>
                <Input {...register('content')} variant='gray' placeholder='Xin chào quý khách' label='Nội dung' error={errors.content?.message}/>
              </div>
              <div className='flex w-full gap-2 items-center justify-center my-3'>
                { createLoading ?
                  <LoadingSpinner size='lg'/>
                  :
                  <>
                    <Button variant="basic" className="py-2 px-3 hover:bg-gray-200 w-full" onClick={handleOpenCreatePopup}
                    >
                        Hủy
                    </Button>
                    <Button variant='default' className='py-2 px-3 w-full' onClick={handleSubmit(onSubmit)}>
                      <Plus className='size-4' />
                        Tạo
                    </Button>
                  </>
                }
              </div>
            </PopupBasic>
        }
      </AnimatePresence>
      <AnimatePresence>
        { isAlertOpen &&
            <PopupBasic onClose={() => setIsAlertOpen(false)} title='Xác nhận'>
              <p className='text-center font-medium'>Bạn có chắc muốn xóa mẫu chat này không?</p>
              <div className='flex w-full gap-2 items-center justify-center my-3'>
                { deleteLoading ?
                  <LoadingSpinner size='lg'/>
                  :
                  <>
                    <Button variant="basic" className="py-2 px-3 hover:bg-gray-200 w-full" onClick={() => setIsAlertOpen(false)}
                    >
                        Không
                    </Button>
                    <Button variant='danger' className='py-2 px-3 w-full' onClick={() => handleDelete(chatTemplateId)}>
                        Có
                    </Button>
                  </>
                }
              </div>
            </PopupBasic>
        }
      </AnimatePresence>
    </div>
  )
}
