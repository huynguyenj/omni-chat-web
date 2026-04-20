import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Input from '@/components/ui/input/Input'
import Tag from '@/components/ui/tag/Tag'
import { Edit2, Search, Trash2 } from 'lucide-react'
import StaffCardSkeleton from '@/components/ui/skeleton/StaffCardSkeleton'
import useGetListStaff from '../../hooks/useGetListStaff'
import useDebounce from '@/hooks/useDebounce'
import NodataCard from '@/components/ui/card/NodataCard'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { useState } from 'react'
import { type StaffDetailType } from '../../types/staff-type'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import useGetIntentType from '@/features/tasks/hooks/useGetIntentType'
import Checkbox from '@/components/ui/input/Checkbox'
import type { IntentType } from '@/features/tasks/types/task-type'
import useUpdateStaffInfo from '../../hooks/useUpdateStaffInfo'
import { AnimatePresence } from 'motion/react'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import useDeleteStaff from '../../hooks/useDeleteStaff'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import { STAFF_LIST_SORT_BY } from '../../const/staff'


export default function StaffTab() {
  const { listStaffs, loading, setCurrentPage, setSearchText, currentPage, setOnRefresh, setSortBy, setSortType, sortBy, sortType } = useGetListStaff()
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const { checkedIntentType, errors, handleSubmit, loading: editLoading, onSubmit, register, setCheckIntentType, setStaffInfoEdit, reset } = useUpdateStaffInfo({ onRefresh: setOnRefresh })
  const { handleDelete, loading: deleteLoading, setStaffId } = useDeleteStaff({ onRefresh: setOnRefresh, onCloseModalUpdate: setIsAlertOpen })
  const { intentType } = useGetIntentType()

  const handleSearch = (text: string) => {
    setSearchText(text)
  }
  const debounce = useDebounce(handleSearch, 500)
  const handleOpenEdit = (staffInfo: StaffDetailType) => {
    const newIntentTypeCheck = new Set('')
    staffInfo.staffIntentTypes.forEach((intent) => newIntentTypeCheck.add(intent.id))
    setCheckIntentType(newIntentTypeCheck)
    setStaffInfoEdit(staffInfo)

    reset({
      name: staffInfo.name,
      email: staffInfo.email,
      phone: staffInfo.phone
    })

    setIsOpenEdit((prevState) => !prevState)
  }

  const handleCheckedIntentType = (intentType: IntentType) => {
    const checkedIntentTypeSet = new Set(checkedIntentType)
    if (checkedIntentType.has(intentType.id)) {
      checkedIntentTypeSet.delete(intentType.id)
      setCheckIntentType(checkedIntentTypeSet)
      return
    }
    checkedIntentTypeSet.add(intentType.id)
    setCheckIntentType(checkedIntentTypeSet)
  }

  const handleOpenAlert = (staffId: string) => {
    setStaffId(staffId)
    setIsAlertOpen((prev) => !prev)
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-sm-title-desktop font-semibold">Quản lý nhân viên</h2>
            <p className="text-sm-body-desktop text-soft-gray mt-1">Danh sách và thông tin nhân viên</p>
          </div>
        </div>
        <div className="mb-4">
          <Input variant='gray' icon={Search} placeholder='Tìm kiếm theo tên, gmail, số điện thoại...' onChange={(e) => debounce(e.target.value)}/>
        </div>
        { loading ?
          <StaffCardSkeleton count={3}/>
          :
          <>
            <div className='flex gap-2 items-center w-full mb-3'>
              <p className='text-nowrap'>Sắp xếp:</p>
              <AdvSelect
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chức năng'/>
                </SelectTrigger>
                <SelectContent>
                  { STAFF_LIST_SORT_BY.map((sort, i) => (
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
            {listStaffs && listStaffs.items.length > 0 ?
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                  {listStaffs.items.map((staff) => (
                    <Card
                      key={staff.id}
                      className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full text-sm-body-desktop"
                    >
                      <div className="flex flex-col gap-2">
                        <div className='flex items-center gap-3'>
                          { staff.avatarUrl ?
                            <img src={staff.avatarUrl} alt='avatar' className='shrink-0 w-12 aspect-square rounded-full'/>
                            :
                            <div className=" shrink-0 h-12 w-12 rounded-full bg-[#3366CC] text-white flex items-center justify-center font-semibold">
                              {staff.name.charAt(0)}
                            </div>
                          }
                          <div className='flex flex-col gap-1'>
                            <p className="font-semibold text-[#003366] line-clamp-1">{staff.name}</p>
                            <div>
                              <Tag
                                variant={staff.status === 'Online' ? 'success' : 'gray'}
                                className="text-[0.8rem] px-2 py-0.5 w-fit"
                              >
                                {staff.status}
                              </Tag>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm-body-desktop text-soft-gray">{staff.email}</p>
                        { staff.staffIntentTypes.length > 0 ?
                          <div className='grid sm:grid-cols-2 gap-2'>
                            {staff.staffIntentTypes.map((intent, i) => (
                              <Tag key={i} className='border-border-primary py-1'>{intent.intentTypeName}</Tag>
                            ))}
                          </div>
                          :
                          <Tag className='border-border-primary py-1'>Chưa được phân công</Tag>
                        }
                        {/* <div className="flex flex-wrap gap-2 mt-2">
                        <Tag variant="gray" size="sm" className="text-[10px] h-4 px-2">
                          {staff.id}
                        </Tag>
                      </div> */}
                        <div className="my-2">
                          <span className="flex items-center gap-1 text-[0.85rem] text-soft-gray">☎️ {staff.phone}</span>
                          {/* <span className="flex items-center gap-1">⏱️ {staff.avgResponseTime}</span> */}
                        </div>
                      </div>
                      <hr className='border border-border-primary my-3 rounded-sm'/>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant='basic' className='py-1 hover:bg-gray-200 w-full flex-17' onClick={() => handleOpenEdit(staff)}>
                          <Edit2 className="size-4" />
                          Sửa
                        </Button>
                        <Button variant="danger" className="py-2 px-3 text-white hover:text-red-500 border-border-primary hover:bg-gray-200 w-full flex-1" onClick={() => handleOpenAlert(staff.id)}
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
                    totalPage={listStaffs.meta.total_pages}
                  />
                </div>
              </div>
              :
              <NodataCard content='Không có dữ liệu nhân viên'/>
            }
          </>

        }
      </Card>
      <AnimatePresence>
        { isOpenEdit &&
        <PopupBasic title='Sửa thông tin nhân viên' onClose={() => setIsOpenEdit(false)}>
          <p className='text-sm-body-desktop text-soft-gray'>Cập nhật thông tin nhân viên</p>
          <div className='flex flex-col gap-3 my-3'>
            <Input {...register('name')} placeholder='Tên nhân viên' variant='gray' label='Tên nhân viên' error={errors.name?.message}/>
            <Input {...register('email')} placeholder='Email' variant='gray' label='Email' error={errors.email?.message}/>
            <Input {...register('phone')} placeholder='Số điện thoại' variant='gray' label='Số điện thoại' error={errors.phone?.message}/>
            <p className='text-sm-body-desktop text-primary font-medium'>Chức năng</p>
            <Card className='rounded-xl'>
              { intentType?.map((intent) => (
                <div key={intent.id} className='flex items-center gap-3'>
                  <Checkbox checked={checkedIntentType.has(intent.id)} onCheckedChange={() => handleCheckedIntentType(intent)}/>
                  <p>{intent.typeName}</p>
                </div>
              )) }
            </Card>
          </div>
          <div className='flex gap-2 items-center my-3 w-full justify-center'>
            { editLoading ?
              <LoadingSpinner size='lg'/>
              :
              <>
                <Button variant='outline' className='w-full' onClick={() => setIsOpenEdit(false)}>Hủy</Button>
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
            <p className='text-m-body-desktop font-medium my-3'>Bạn có chắc muốn xóa người dùng này</p>
            <div className='flex gap-2 items-center my-3 w-full justify-center'>
              { deleteLoading ?
                <LoadingSpinner size='lg'/>
                :
                <>
                  <Button variant='outline' className='w-full' onClick={() => setIsAlertOpen(false)}>Không</Button>
                  <Button className='w-full' variant='danger' onClick={handleDelete}>Có</Button>
                </>
              }
            </div>
          </PopupBasic>
        }
      </AnimatePresence>
    </div>
  )
}

