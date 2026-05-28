import { Edit, Plus, Save, Search, Trash2 } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import useGetKeywords from '../../hooks/useGetKeywords'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import NodataCard from '@/components/ui/card/NodataCard'
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
import useDebounce from '@/hooks/useDebounce'
import { LIST_SORT_BY } from '../../const/keyword'
import { formatDate, formatTime } from '@/utils/date-resolver'
import { IoIosCloseCircle } from 'react-icons/io'
import { TableSkeleton } from '@/components/ui/skeleton/TableSkeleton'


export default function KeywordsTab() {
  const { currentPage, keyWordList, loading, setCurrentPage, setOnRefresh, setSearchText, setSortType, sortType, filterIntent, handleSelectIntent, setSortBy, sortBy } = useGetKeywords()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isCreateKeywordOpen, setIsCreateKeywordOpen] = useState(false)
  const { handleSubmit, loading: updateLoading, onSubmit, register, reset, setKeywordSelected, keywordSelected, errors: updateError } = useUpdateKeyword({ onRefresh: setOnRefresh })
  const { intentType } = useGetIntentType()
  const { handleDelete, loading: deleteLoading, setKeywordId } = useDeleteKeyword({ onRefresh: setOnRefresh, onCloseModalDelete: setIsAlertOpen })
  const { control, errors, handleSubmit: handleSubmitCreate, loading:createLoading, onSubmit:onSubmitCreate, register:registerCreate, reset:resetCreate } = useCreateKeyword({ onRefresh: setOnRefresh })
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  const debounce = useDebounce(handleSearch, 500)
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-[#003366] text-sm-title-desktop font-semibold">Quản lý Keywords</h2>
            <p className="text-sm-body-desktop text-soft-gray mt-1">Cấu hình từ khóa và độ ưu tiên</p>
          </div>
          <Button className="bg-[#3366CC] hover:bg-[#2952A3]" size="sm" onClick={handleOpenCreateKeyword}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm keyword
          </Button>
        </div>
        <div className="mb-4">
          <Input variant='gray' icon={Search} placeholder='Tìm kiếm theo tên...' onChange={(e) => debounce(e.target.value)}/>
        </div>
        <div className='flex flex-col 2xl:flex-row 2xl:items-center w-full gap-5 mb-5'>
          <div className='flex items-center w-full gap-2'>
            <p className='text-nowrap'>Lọc keyword theo chức năng:</p>
            <AdvSelect
              value={filterIntent}
              onValueChange={(e) => handleSelectIntent(e)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Tất cả'/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả</SelectItem>
                { intentType?.map((intent) => (
                  <SelectItem key={intent.id} value={intent.id}>{intent.typeName}</SelectItem>
                )) }
              </SelectContent>
            </AdvSelect>
          </div>
          <div className='flex gap-2 items-center w-full'>
            <p className='text-nowrap'>Sắp xếp:</p>
            <AdvSelect
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chức năng'/>
              </SelectTrigger>
              <SelectContent>
                { LIST_SORT_BY.map((sort, i) => (
                  <SelectItem key={i} value={sort.value}>{sort.name}</SelectItem>
                )) }
              </SelectContent>
            </AdvSelect>
            <AdvSelect
              onValueChange={setSortType}
              defaultValue='false'
              value={sortType}
            >
              <SelectTrigger>
                <SelectValue placeholder='Thứ tự'/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>{ sortBy !== 'createdate' ? 'Giảm dần' : 'Mới nhất' }</SelectItem>
                <SelectItem value='false'>{ sortBy !== 'createdate' ? 'Tăng dần' : 'Cũ nhất' }</SelectItem>
              </SelectContent>
            </AdvSelect>
          </div>
        </div>
        { loading ?
          <TableSkeleton numberOfRow={5}/>
          :
          <>
            { keyWordList && keyWordList.items.length > 0 ?
              <div className='overflow-x-auto'>
                <table className='w-full border border-border-primary mb-3 table-fixed min-w-250 '>
                  <thead className='bg-secondary'>
                    <tr className='text-white'>
                      <th className='py-2 text-start px-5 w-1/3'>Id</th>
                      <th className='py-2 text-start px-5 w-1/4'>Từ khóa</th>
                      <th className='py-2 text-start px-5 w-1/4'>Chức năng</th>
                      <th className='py-2 text-start px-5 w-1/6'>Trọng số</th>
                      <th className='py-2 text-start px-5 w-1/4'>Ngày tạo</th>
                      <th className='py-2 text-end px-5 w-1/6'>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyWordList.items.map((keyword) => (
                      <tr key={keyword.id}>
                        <td className='py-2 px-5 w-1/3 border-r border-b-2 border-border-primary'>
                          <p>{keyword.id}</p>
                        </td>
                        <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                          <p>{keyword.keywordText}</p>
                        </td>
                        <td className='py-2 px-5 w-1/4 wrap-break-word border-r border-b-2 border-border-primary'>
                          <p>{keyword.intentTypeName}</p>
                        </td>
                        <td className='py-2 px-5 w-1/6 border-r border-b-2 border-border-primary'>
                          { isEditOpen && keywordSelected?.id == keyword.id ?
                            <Input {...register('weight', { valueAsNumber: true })} variant='gray' error={updateError.weight?.message}/>
                            :
                            <p>{keyword.weight}</p>
                          }
                        </td>
                        <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                          <p>{formatDate(keyword.createDate)} - {formatTime(keyword.createDate)}</p>
                        </td>
                        <td className='py-2 px-5 border-r border-b-2 border-border-primary'>
                          <div className='flex flex-col xl:flex-row justify-end items-center gap-2 '>
                            {
                              isEditOpen && keywordSelected?.id == keyword.id ?
                                <div className='flex gap-2 items-center'>
                                  { updateLoading ?
                                    <LoadingSpinner/>
                                    :
                                    <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-70'>
                                      <Save className='text-secondary' onClick={handleSubmit(onSubmit)}/>
                                    </Button>
                                  }
                                  <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-70'>
                                    <IoIosCloseCircle className='text-red-400 size-5' onClick={() => setIsEditOpen(false)}/>
                                  </Button>
                                </div>
                                :
                                <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-70'>
                                  <Edit className='text-secondary' onClick={() => handleOpenEdit(keyword)}/>
                                </Button>
                            }
                            <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleOpenAlert(keyword.id)}>
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
                  totalPage={keyWordList.meta.total_pages}
                />
              </div>
              :
              <NodataCard/>
            }
          </>

        }
      </Card>
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

