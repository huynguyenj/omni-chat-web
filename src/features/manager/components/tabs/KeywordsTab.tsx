import { Edit2, Plus, Trash2 } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import useGetKeywords from '../../hooks/useGetKeywords'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import NodataCard from '@/components/ui/card/NodataCard'
import StaffCardSkeleton from '@/components/ui/skeleton/StaffCardSkeleton'
import { FaTags } from 'react-icons/fa6'
import { AnimatePresence } from 'motion/react'
import useUpdateKeyword from '../../hooks/useUpdateKeyword'
import type { KeywordDetailType } from '../../types/keyword-type'
import { useState } from 'react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import Input from '@/components/ui/input/Input'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import useDeleteKeyword from '../../hooks/useDeleteKeyword'
import useGetIntentType from '@/features/tasks/hooks/useGetIntentType'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import useCreateKeyword from '../../hooks/useCreateKeyword'
import { Controller } from 'react-hook-form'


export default function KeywordsTab() {
  const { currentPage, keyWordList, loading, setCurrentPage, setOnRefresh } = useGetKeywords()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isCreateKeywordOpen, setIsCreateKeywordOpen] = useState(false)
  const { handleSubmit, loading: updateLoading, onSubmit, register, reset, setKeywordSelected } = useUpdateKeyword({ onRefresh: setOnRefresh })
  const { intentType } = useGetIntentType()
  const { handleDelete, loading: deleteLoading, setKeywordId } = useDeleteKeyword({ onRefresh: setOnRefresh, onCloseModalDelete: setIsAlertOpen })
  const { control, errors, handleSubmit: handleSubmitCreate, loading:createLoading, onSubmit:onSubmitCreate, register:registerCreate, reset:resetCreate } = useCreateKeyword({ onRefresh: setOnRefresh })
  // const debounce = useDebounce(handleSearch, 500)
  const handleOpenEdit = (keyword: KeywordDetailType) => {
    setKeywordSelected(keyword)
    setIsEditOpen((prev) => !prev)
    reset({
      weight: keyword.weight
    })
  }

  const handleOpenAlert = (keywordId: string) => {
    setKeywordId(keywordId)
    setIsAlertOpen((prev) => !prev)
  }

  const handleOpenCreateKeyword = () => {
    setIsCreateKeywordOpen(prev => !prev)
    resetCreate({
      intentTypeId: '',
      keywordText: '',
      weight: 0
    })
  }
  return (
    <div className="space-y-4">
      <Card className="p-6 text-sm-body-desktop">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-sm-title-desktop font-semibold">Quản lý Keywords</h2>
            <p className="text-sm-body-desktop text-soft-gray mt-1">Cấu hình từ khóa và độ ưu tiên</p>
          </div>
          <Button className="bg-[#3366CC] hover:bg-[#2952A3]" size="sm" onClick={handleOpenCreateKeyword}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm keyword
          </Button>
        </div>

        {/* <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm keyword..."
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#3366CC]/30"
            />
          </div>
        </div> */}

        { loading ?
          <StaffCardSkeleton count={3}/>
          :
          <>
            {keyWordList && keyWordList.items.length > 0 ?
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {keyWordList.items.map((keyword) => (
                    <Card
                      key={keyword.id}
                      className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full text-sm-body-desktop"
                    >
                      <div className="flex flex-col gap-2">
                        <div className='flex items-center gap-3'>
                          <FaTags className='size-4 text-secondary'/>
                          <p className="font-semibold text-[#003366] line-clamp-1">{keyword.keywordText}</p>
                        </div>
                        <div className='flex justify-between items-center w-full'>
                          <p>Độ ưu tiên: </p>
                          <Tag
                            variant={keyword.weight >= 70 ? 'danger' : keyword.weight >= 40 ? 'warn' : 'gray'}
                            className="text-[0.8rem] px-2 py-0.5 w-fit"
                          >
                            {keyword.weight}
                          </Tag>
                        </div>
                        <div className="my-2">
                          <span className="flex items-center gap-1 text-[0.85rem] text-soft-gray font-medium">Chức năng: {keyword.intentTypeName}</span>
                        </div>
                      </div>
                      <hr className='border border-border-primary my-3 rounded-sm'/>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant='basic' className='py-1 hover:bg-gray-200 w-full flex-17' onClick={() => handleOpenEdit(keyword)}>
                          <Edit2 className="size-4" />
                          Sửa
                        </Button>
                        <Button variant="danger" className="py-2 px-3 text-white hover:text-red-500 border-border-primary hover:bg-gray-200 w-full flex-1" onClick={() => handleOpenAlert(keyword.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className='w-full flex justify-center mt-4'>
                  <PaginationBar
                    currentPage={currentPage}
                    setPage={setCurrentPage}
                    totalPage={keyWordList.meta.total_pages}
                  />
                </div>
              </div>
              :
              <NodataCard content='Không có dữ liệu keywords'/>
            }
          </>

        }
      </Card>
      <AnimatePresence>
        { isEditOpen &&
        <PopupBasic title='Sửa keyword' onClose={() => setIsEditOpen(false)}>
          <p className='text-sm-body-desktop text-soft-gray'>Cập nhật thông tin từ khóa</p>
          <div className='flex flex-col gap-3 my-3'>
            <Input {...register('weight', { valueAsNumber: true })} type='number' placeholder='Độ ưu tiên' variant='gray' label='Độ ưu tiên'/>
          </div>
          <div className='flex gap-2 items-center my-3 w-full justify-center'>
            { updateLoading ?
              <LoadingSpinner size='lg'/>
              :
              <>
                <Button variant='outline' className='w-full' onClick={() => setIsEditOpen(false)}>Hủy</Button>
                <Button className='w-full' onClick={handleSubmit(onSubmit)}>Lưu thay đổi</Button>
              </>
            }
          </div>
        </PopupBasic>
        }
      </AnimatePresence>
      <AnimatePresence>
        { isAlertOpen &&
                <PopupBasic onClose={() => setIsAlertOpen(false)} title='Xác nhận'>
                  <p className='text-m-body-desktop font-medium my-3'>Bạn có chắc muốn xóa keyword này</p>
                  <div className='flex gap-2 items-center my-3 w-full justify-center'>
                    { deleteLoading ?
                      <LoadingSpinner size='lg'/>
                      :
                      <>
                        <Button variant='outline' className='w-full border-3 border-border-primary text-black hover:bg-gray-200' onClick={() => setIsAlertOpen(false)}>Không</Button>
                        <Button className='w-full' variant='danger' onClick={handleDelete}>Có</Button>
                      </>
                    }
                  </div>
                </PopupBasic>
        }
      </AnimatePresence>
      <AnimatePresence>
        { isCreateKeywordOpen &&
          <PopupBasic onClose={handleOpenCreateKeyword} title='Thêm keyword mới'>
            <div className='flex flex-col gap-3 my-5'>
              <Input {...registerCreate('keywordText')} variant='gray' placeholder='Nhập từ khóa...' label='Từ khóa' error={errors.keywordText?.message}/>
              <Input {...registerCreate('weight', { valueAsNumber: true })} type='number' variant='gray' placeholder='Nhập mức độ ưu tiên' label='Độ ưu tiên' error={errors.weight?.message}/>
              <label htmlFor="intent-select" className='text-primary font-medium'>Chọn chức năng</label>
              <Controller
                control={control}
                name='intentTypeId'
                render={({ field }) => (
                  <AdvSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn chức năng'/>
                    </SelectTrigger>
                    <SelectContent>
                      { intentType?.map((intent) => (
                        <SelectItem key={intent.id} value={intent.id}>{intent.typeName}</SelectItem>
                      )) }
                    </SelectContent>
                  </AdvSelect>
                )}
              />
              { errors.intentTypeId?.message && <p className='text-sm-body-desktop text-red-400 mb-3 font-medium'>{errors.intentTypeId.message}</p> }

            </div>
            <div className='flex gap-2 items-center my-3 w-full justify-center'>
              { createLoading ?
                <LoadingSpinner size='lg'/>
                :
                <>
                  <Button variant='outline' className='w-full border-3 border-border-primary text-black hover:bg-gray-200' onClick={handleOpenCreateKeyword} >Hủy</Button>
                  <Button className='w-full' onClick={handleSubmitCreate(onSubmitCreate)}>Thêm keyword</Button>
                </>
              }
            </div>
          </PopupBasic>
        }
      </AnimatePresence>
    </div>
  )
}

