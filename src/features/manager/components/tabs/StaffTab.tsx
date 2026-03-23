import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Edit2, Plus, Search, Trash2 } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Input from '@/components/ui/input/Input'
import Tag from '@/components/ui/tag/Tag'
import { useManagerDashboard } from '../../hooks/useManagerDashboard'
import type { ManagerStaff } from '../../data/manager-dashboard-data'
import { STAFF_LIST } from '../../data/manager-dashboard-data'

function Modal({
  open,
  onClose,
  title,
  children
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
      onMouseDown={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-[#003366] mb-4">{title}</h3>
        {children}
      </div>
    </div>
  )
}

type StaffForm = {
  name: string
  email: string
  department: string
  status: 'active' | 'inactive'
}

const emptyForm: StaffForm = {
  name: '',
  email: '',
  department: 'CSKH',
  status: 'active'
}

export default function StaffTab() {
  const {
    staffPage,
    setStaffPage,
    addStaffDialogOpen,
    setAddStaffDialogOpen,
    editStaffDialogOpen,
    setEditStaffDialogOpen,
    selectedStaff,
    setSelectedStaff,
    itemsPerPage
  } = useManagerDashboard()

  const totalPages = useMemo(() => Math.max(1, Math.ceil(STAFF_LIST.length / itemsPerPage)), [itemsPerPage])

  const pagedStaff = useMemo(() => {
    const start = (staffPage - 1) * itemsPerPage
    return STAFF_LIST.slice(start, start + itemsPerPage)
  }, [itemsPerPage, staffPage])

  const [addForm, setAddForm] = useState<StaffForm>(emptyForm)
  const [editForm, setEditForm] = useState<StaffForm>(emptyForm)

  useEffect(() => {
    if (!addStaffDialogOpen) return
    setAddForm(emptyForm)
  }, [addStaffDialogOpen])

  useEffect(() => {
    if (!editStaffDialogOpen) return
    if (!selectedStaff) return
    setEditForm({
      name: selectedStaff.name,
      email: selectedStaff.email,
      department: selectedStaff.department,
      status: selectedStaff.status
    })
  }, [editStaffDialogOpen, selectedStaff])

  const openAdd = () => {
    setSelectedStaff(null)
    setAddStaffDialogOpen(true)
  }

  const openEdit = (staff: ManagerStaff) => {
    setSelectedStaff(staff)
    setEditStaffDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Quản lý nhân viên</h2>
            <p className="text-sm text-gray-500 mt-1">Danh sách và thông tin nhân viên</p>
          </div>
          <Button
            onClick={openAdd}
            className="bg-[#3366CC] hover:bg-[#2952A3] disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm nhân viên
          </Button>
        </div>

        {/* Search (v1) - render UI, chưa filter dữ liệu */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Tìm kiếm nhân viên..."
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#3366CC]/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedStaff.map((staff) => (
            <Card
              key={staff.id}
              className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-12 w-12 rounded-full bg-[#3366CC] text-white flex items-center justify-center font-semibold flex-shrink-0">
                    {staff.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#003366] line-clamp-1">{staff.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{staff.email}</p>
                    <p className="text-sm font-medium text-gray-700 truncate mt-1">{staff.department}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Tag variant="gray" size="sm" className="text-[10px] h-4 px-2">
                        {staff.id}
                      </Tag>
                      <Tag
                        variant={staff.status === 'active' ? 'success' : 'gray'}
                        size="sm"
                        className="text-[10px] h-4 px-2"
                      >
                        {staff.status === 'active' ? 'Hoạt động' : 'Nghỉ'}
                      </Tag>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">💬 {staff.totalChats} hội thoại</span>
                      <span className="flex items-center gap-1">⏱️ {staff.avgResponseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(staff)}>
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    // v1: xóa chưa nối API
                    // TODO: confirm + call delete API
                    setSelectedStaff(staff)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={staffPage <= 1}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setStaffPage(Math.max(1, staffPage - 1))}
          >
            Prev
          </Button>
          <span className="text-sm text-gray-600">
            Page {staffPage}/{totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={staffPage >= totalPages}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setStaffPage(Math.min(totalPages, staffPage + 1))}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* Add staff dialog */}
      <Modal
        open={addStaffDialogOpen}
        onClose={() => setAddStaffDialogOpen(false)}
        title="Thêm nhân viên"
      >
        <div className="space-y-4">
          <Input
            variant="gray"
            label="Tên nhân viên"
            placeholder="VD: Nguyễn Văn A"
            value={addForm.name}
            onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            variant="gray"
            label="Email"
            placeholder="VD: staff1@example.com"
            value={addForm.email}
            onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
          />
          <div className="w-full flex flex-col gap-2">
            <p className="mb-1 text-[0.95rem] font-bold text-primary">Phòng ban</p>
            <select
              value={addForm.department}
              onChange={(e) => setAddForm(prev => ({ ...prev, department: e.target.value }))}
              className="w-full py-2 px-3 rounded-[6px] bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3366CC]/30"
            >
              <option value="CSKH">CSKH</option>
              <option value="Kỹ thuật">Kỹ thuật</option>
              <option value="Quản lý">Quản lý</option>
            </select>
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className="mb-1 text-[0.95rem] font-bold text-primary">Trạng thái</p>
            <select
              value={addForm.status}
              onChange={(e) => setAddForm(prev => ({ ...prev, status: e.target.value as StaffForm['status'] }))}
              className="w-full py-2 px-3 rounded-[6px] bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3366CC]/30"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Nghỉ</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setAddStaffDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-[#3366CC] hover:bg-[#2952A3]"
              onClick={() => setAddStaffDialogOpen(false)}
            >
              Tạo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit staff dialog */}
      <Modal
        open={editStaffDialogOpen}
        onClose={() => setEditStaffDialogOpen(false)}
        title="Sửa thông tin nhân viên"
      >
        <div className="space-y-4">
          <Input
            variant="gray"
            label="Tên nhân viên"
            placeholder="VD: Nguyễn Văn A"
            value={editForm.name}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            variant="gray"
            label="Email"
            placeholder="VD: staff1@example.com"
            value={editForm.email}
            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
          />
          <div className="w-full flex flex-col gap-2">
            <p className="mb-1 text-[0.95rem] font-bold text-primary">Phòng ban</p>
            <select
              value={editForm.department}
              onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
              className="w-full py-2 px-3 rounded-[6px] bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3366CC]/30"
            >
              <option value="CSKH">CSKH</option>
              <option value="Kỹ thuật">Kỹ thuật</option>
              <option value="Quản lý">Quản lý</option>
            </select>
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className="mb-1 text-[0.95rem] font-bold text-primary">Trạng thái</p>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as StaffForm['status'] }))}
              className="w-full py-2 px-3 rounded-[6px] bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3366CC]/30"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Nghỉ</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditStaffDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-[#3366CC] hover:bg-[#2952A3]"
              onClick={() => setEditStaffDialogOpen(false)}
            >
              Lưu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

