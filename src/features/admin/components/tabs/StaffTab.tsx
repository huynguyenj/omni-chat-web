import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import Input from '@/components/ui/input/Input'
import { STAFF_ACCOUNTS } from '@/components/admin/admin-dashboard-data'
import { CheckCircle, Edit2, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import type { StaffAccount } from '../../context/AdminDashboardProvider'

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

  // Staff tab: list staff accounts and manage add/edit dialogs.
  const openEdit = (staff: StaffAccount) => {
    setSelectedStaff(staff)
    setEditStaffDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#003366] text-2xl font-bold">Quản lý tài khoản</h2>
          <p className="text-sm text-gray-500 mt-1">{STAFF_ACCOUNTS.length} tài khoản trong hệ thống</p>
        </div>
        <Button onClick={() => setAddStaffDialogOpen(true)} className="bg-[#3366CC] hover:bg-[#2952A3]">
          <Plus className="h-4 w-4 mr-2" />
          Thêm tài khoản
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAFF_ACCOUNTS.map((staff) => (
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
                  </div>
                </div>
                <span className="text-[10px] px-1 h-5 font-mono border rounded bg-white">{staff.id}</span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`text-[10px] px-2 py-0 h-5 rounded text-white ${staff.role === 'Manager' ? 'bg-purple-500' : 'bg-[#3366CC]'}`}>{staff.role}</span>
                  <span className={`text-[10px] px-2 py-0 h-5 rounded text-white ${staff.status === 'active' ? 'bg-[#2ECC71]' : 'bg-gray-400'}`}>{staff.status === 'active' ? 'Hoạt động' : 'Nghỉ'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-2 bg-gray-50 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-gray-400 uppercase font-medium">Phòng ban</span>
                    <span className="text-[#003366] font-semibold">{staff.department}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 uppercase font-medium">Ngày tham gia</span>
                    <span className="text-[#003366] font-semibold">{staff.joinDate}</span>
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
              <Input id="name" placeholder="Nhập họ và tên" variant="gray" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="example@omnichat.com" variant="gray" />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Vai trò</label>
              <select id="role" className="w-full p-2 border border-gray-200 rounded-md text-sm">
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">Phòng ban</label>
              <select id="department" className="w-full p-2 border border-gray-200 rounded-md text-sm">
                <option value="cskh">CSKH</option>
                <option value="tech">Kỹ thuật</option>
                <option value="sales">Kinh doanh</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Mật khẩu tạm thời</label>
              <Input id="password" type="password" placeholder="Nhập mật khẩu" variant="gray" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddStaffDialogOpen(false)} className="flex-1">Hủy</Button>
              <Button className="flex-1 bg-[#3366CC] hover:bg-[#2952A3]" onClick={() => setAddStaffDialogOpen(false)}>
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
              <Input id="edit-name" placeholder="Nhập họ và tên" defaultValue={selectedStaff.name} variant="gray" />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
              <Input id="edit-email" type="email" placeholder="example@omnichat.com" defaultValue={selectedStaff.email} variant="gray" />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-role" className="text-sm font-medium">Vai trò</label>
              <select id="edit-role" className="w-full p-2 border border-gray-200 rounded-md text-sm" defaultValue={selectedStaff.role.toLowerCase()}>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-department" className="text-sm font-medium">Phòng ban</label>
              <select id="edit-department" className="w-full p-2 border border-gray-200 rounded-md text-sm" defaultValue={selectedStaff.department.toLowerCase()}>
                <option value="cskh">CSKH</option>
                <option value="tech">Kỹ thuật</option>
                <option value="sales">Kinh doanh</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-status" className="text-sm font-medium">Trạng thái</label>
              <select id="edit-status" className="w-full p-2 border border-gray-200 rounded-md text-sm" defaultValue={selectedStaff.status}>
                <option value="active">Hoạt động</option>
                <option value="inactive">Nghỉ</option>
              </select>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800">
              <p className="font-semibold mb-1">📅 Thông tin tài khoản</p>
              <p>Ngày tham gia: <span className="font-semibold">{selectedStaff.joinDate}</span></p>
              <p className="mt-1 text-gray-600">Để đổi mật khẩu, vui lòng liên hệ bộ phận kỹ thuật</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditStaffDialogOpen(false)} className="flex-1">Hủy</Button>
              <Button className="flex-1 bg-[#3366CC] hover:bg-[#2952A3]" onClick={() => setEditStaffDialogOpen(false)}>
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

