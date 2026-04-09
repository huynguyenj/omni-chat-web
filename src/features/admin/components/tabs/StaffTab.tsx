import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import Input from '@/components/ui/input/Input'
import { STAFF_ACCOUNTS } from '@/components/admin/admin-dashboard-data'
import { CheckCircle, Edit2, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { toast } from 'react-toastify'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import type { StaffAccount } from '../../context/AdminDashboardProvider'
import { StaffApi } from '../../api/staff-api'
import type { StaffItem } from '../../types/staff-type'

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onMouseDown={onClose}>
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default function StaffTab() {
  const {
    addStaffDialogOpen,
    setAddStaffDialogOpen,
    editStaffDialogOpen,
    setEditStaffDialogOpen,
    selectedStaff,
    setSelectedStaff
  } = useAdminDashboard()
  const [apiStaffs, setApiStaffs] = useState<StaffItem[] | null>(null)
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    roleId: '',
    intentId: ''
  })
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    intentId: ''
  })

  // Staff tab: list staff accounts and manage add/edit dialogs.
  const openEdit = (staff: StaffAccount) => {
    setSelectedStaff(staff)
    const matchedStaff = apiStaffs?.find((s) => s.id === staff.id)
    setEditForm({
      name: staff.name,
      email: staff.email,
      phone: matchedStaff?.phone ?? '',
      intentId: matchedStaff?.staffIntentTypes?.[0]?.intentTypeName ?? ''
    })
    setEditStaffDialogOpen(true)
  }

  const fetchStaffs = async () => {
    try {
      const response = await StaffApi.getStaffs(1, 50)
      setApiStaffs(response.data.items)
    } catch (error) {
      console.log('Fetch staffs failed:', error)
    }
  }

  useEffect(() => {
    fetchStaffs()
  }, [])

  const parseIntentIds = (raw: string) =>
    raw
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
      .map((intentId) => ({ intentId }))

  const handleCreateStaff = async () => {
    try {
      await StaffApi.createStaff({
        name: addForm.name,
        email: addForm.email,
        phone: addForm.phone,
        roleId: addForm.roleId,
        staffIntentTypes: parseIntentIds(addForm.intentId)
      })
      setAddStaffDialogOpen(false)
      setAddForm({ name: '', email: '', phone: '', roleId: '', intentId: '' })
      toast.success('Thêm tài khoản thành công')
      await fetchStaffs()
    } catch (error) {
      console.log('Create staff failed:', error)
    }
  }

  const handleUpdateStaff = async () => {
    if (!selectedStaff) return
    try {
      await StaffApi.updateStaff(selectedStaff.id, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        staffIntentTypes: parseIntentIds(editForm.intentId)
      })
      setEditStaffDialogOpen(false)
      toast.success('Cập nhật thành công')
      await fetchStaffs()
    } catch (error) {
      console.log('Update staff failed:', error)
    }
  }

  const handleDeleteStaff = async (id: string) => {
    try {
      await StaffApi.deleteStaff(id)
      toast.success('Xóa tài khoản thành công')
      await fetchStaffs()
    } catch (error) {
      console.log('Delete staff failed:', error)
    }
  }

  const uiStaffs = useMemo<StaffAccount[]>(() => {
    if (!apiStaffs) return STAFF_ACCOUNTS

    return apiStaffs.map((staff) => ({
      id: staff.id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.staffIntentTypes.length > 0 ? 'Staff' : 'Manager',
      department: staff.staffIntentTypes.length > 0 ? staff.staffIntentTypes.map((i) => i.intentTypeName).join(', ') : 'Chưa phân loại',
      status: staff.status.toLowerCase() === 'online' ? 'active' : 'inactive',
      joinDate: '-'
    }))
  }, [apiStaffs])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#003366] text-2xl font-bold">Quản lý tài khoản</h2>
          <p className="text-sm text-gray-500 mt-1">{uiStaffs.length} tài khoản trong hệ thống</p>
        </div>
        <Button onClick={() => setAddStaffDialogOpen(true)} className="bg-[#3366CC] hover:bg-[#2952A3]">
          <Plus className="h-4 w-4 mr-2" />
          Thêm tài khoản
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uiStaffs.map((staff) => (
          <Card key={staff.id} className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 border-t-[#3366CC] bg-white group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#3366CC] text-white flex items-center justify-center text-lg font-bold shadow-sm group-hover:scale-105 transition-transform">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#003366] text-sm line-clamp-1">{staff.name}</h3>
                    <p className="text-[10px] text-gray-500 line-clamp-1 italic">{staff.email}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-1 italic">{staff.phone ?? '-'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`text-[10px] px-2 py-0 h-5 rounded text-white ${staff.role === 'Manager' ? 'bg-purple-500' : 'bg-[#3366CC]'}`}>{staff.role}</span>
                  <span className={`text-[10px] px-2 py-0 h-5 rounded text-white ${staff.status === 'active' ? 'bg-[#2ECC71]' : 'bg-gray-400'}`}>{staff.status === 'active' ? 'Hoạt động' : 'Nghỉ'}</span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-[11px] p-2 bg-gray-50 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-gray-400 uppercase font-medium">Phòng ban</span>
                    <span className="text-[#003366] font-semibold">{staff.department}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs border-[#3366CC]/30 text-[#3366CC] hover:bg-[#3366CC]/5"
                onClick={() => openEdit(staff)}
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Sửa
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleDeleteStaff(staff.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Xóa
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {addStaffDialogOpen && (
        <ModalShell onClose={() => setAddStaffDialogOpen(false)}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#003366]">Thêm tài khoản mới</h3>
            <p className="text-sm text-gray-500">Tạo tài khoản Staff hoặc Manager</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Họ và tên</label>
              <Input id="name" placeholder="Nhập họ và tên" variant="gray" value={addForm.name} onChange={(e) => setAddForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="example@omnichat.com" variant="gray" value={addForm.email} onChange={(e) => setAddForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Số điện thoại</label>
              <Input id="phone" placeholder="Nhập số điện thoại" variant="gray" value={addForm.phone} onChange={(e) => setAddForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label htmlFor="roleId" className="text-sm font-medium">Role ID</label>
              <Input id="roleId" placeholder="UUID roleId" variant="gray" value={addForm.roleId} onChange={(e) => setAddForm((prev) => ({ ...prev, roleId: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label htmlFor="intentId" className="text-sm font-medium">Intent ID(s)</label>
              <Input id="intentId" placeholder="UUID intentId, ngăn cách bởi dấu phẩy" variant="gray" value={addForm.intentId} onChange={(e) => setAddForm((prev) => ({ ...prev, intentId: e.target.value }))} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddStaffDialogOpen(false)} className="flex-1">Hủy</Button>
              <Button className="flex-1 bg-[#3366CC] hover:bg-[#2952A3]" onClick={handleCreateStaff}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Tạo tài khoản
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {editStaffDialogOpen && selectedStaff && (
        <ModalShell onClose={() => setEditStaffDialogOpen(false)}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#003366]">Sửa thông tin tài khoản</h3>
            <p className="text-sm text-gray-500">Cập nhật thông tin cho {selectedStaff.id}</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">Họ và tên</label>
              <Input id="edit-name" placeholder="Nhập họ và tên" value={editForm.name} onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))} variant="gray" />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
              <Input id="edit-email" type="email" placeholder="example@omnichat.com" value={editForm.email} onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))} variant="gray" />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-phone" className="text-sm font-medium">Số điện thoại</label>
              <Input id="edit-phone" placeholder="Nhập số điện thoại" value={editForm.phone} onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))} variant="gray" />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-intentId" className="text-sm font-medium">Intent ID(s)</label>
              <Input id="edit-intentId" placeholder="UUID intentId, ngăn cách bởi dấu phẩy" value={editForm.intentId} onChange={(e) => setEditForm((prev) => ({ ...prev, intentId: e.target.value }))} variant="gray" />
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800">
              <p className="font-semibold mb-1">Thông tin API cập nhật</p>
              <p>Role không chỉnh tại endpoint update, chỉ cập nhật name/email/phone/staffIntentTypes.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditStaffDialogOpen(false)} className="flex-1">Hủy</Button>
              <Button className="flex-1 bg-[#3366CC] hover:bg-[#2952A3]" onClick={handleUpdateStaff}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  )
}

