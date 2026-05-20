import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import Input from '@/components/ui/input/Input'
import { STAFF_ACCOUNTS } from '@/components/admin/admin-dashboard-data'
import { CheckCircle, Edit2, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { toast } from 'react-toastify'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import type { StaffAccount } from '../../context/AdminDashboardContext'
import { RolesApi, type RoleItem } from '../../api/roles-api'
import { StaffApi } from '../../api/staff-api'
import { IntentTypeApi, type IntentTypeItem } from '../../api/intent-type-api'
import type { StaffItem } from '../../types/staff-type'

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onMouseDown={onClose}>
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function extractStaffItemsFromResponse(response: unknown): StaffItem[] {
  if (Array.isArray(response)) return response as StaffItem[]
  const r = response && typeof response === 'object' ? (response as Record<string, unknown>) : {}
  if (Array.isArray(r.items)) return r.items as StaffItem[]
  if (Array.isArray(r.data)) return r.data as StaffItem[]
  const data = r.data && typeof r.data === 'object' ? (r.data as Record<string, unknown>) : {}
  if (Array.isArray(data.items)) return data.items as StaffItem[]
  if (Array.isArray(data.data)) return data.data as StaffItem[]
  return []
}

function staffIntentPayloadFromIds(ids: string[]) {
  return ids.map((intentId) => ({ intentId }))
}

function IntentTypeChecklist({
  intentTypes,
  loading,
  selectedIds,
  onChange
}: {
  intentTypes: IntentTypeItem[]
  loading: boolean
  selectedIds: string[]
  onChange: (next: string[]) => void
}) {
  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])
  }

  if (loading) {
    return <p className="text-sm text-gray-500 py-2">Đang tải danh sách loại intent...</p>
  }
  if (intentTypes.length === 0) {
    return <p className="text-sm text-amber-700 py-2">Chưa có dữ liệu loại intent. Thử tải lại trang.</p>
  }
  return (
    <div className="max-h-52 overflow-y-auto rounded-md border border-gray-200 bg-gray-50/80 p-2 space-y-2">
      {intentTypes.map((it) => (
        <label
          key={it.id}
          htmlFor={`intent-${it.id}`}
          className="flex cursor-pointer items-start gap-2 rounded-md p-2 text-sm hover:bg-white"
        >
          <input
            id={`intent-${it.id}`}
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-[#3366CC] focus:ring-[#3366CC]"
            checked={selectedIds.includes(it.id)}
            onChange={() => toggle(it.id)}
          />
          <span className="min-w-0">
            <span className="font-semibold text-[#003366]">{it.typeName}</span>
            {it.description ? (
              <span className="mt-0.5 block text-xs leading-snug text-gray-600">{it.description}</span>
            ) : null}
          </span>
        </label>
      ))}
    </div>
  )
}

export default function StaffTab() {
  const STAFFS_PER_PAGE = 9
  const {
    addStaffDialogOpen,
    setAddStaffDialogOpen,
    editStaffDialogOpen,
    setEditStaffDialogOpen,
    selectedStaff,
    setSelectedStaff
  } = useAdminDashboard()
  const [apiStaffs, setApiStaffs] = useState<StaffItem[] | null>(null)
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [intentTypes, setIntentTypes] = useState<IntentTypeItem[]>([])
  const [intentTypesLoading, setIntentTypesLoading] = useState(false)
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    roleId: '',
    intentTypeIds: [] as string[]
  })
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    intentTypeIds: [] as string[]
  })
  const [staffPage, setStaffPage] = useState(1)

  // Staff tab: list staff accounts and manage add/edit dialogs.
  const openEdit = async (staff: StaffAccount) => {
    setSelectedStaff(staff)
    let types = intentTypes
    if (types.length === 0) {
      try {
        setIntentTypesLoading(true)
        types = await IntentTypeApi.getIntentTypes()
        setIntentTypes(types)
      } catch {
        toast.error('Không tải được danh sách loại chức năng.')
      } finally {
        setIntentTypesLoading(false)
      }
    }
    const matchedStaff = apiStaffs?.find((s) => s.id === staff.id)
    const intentTypeIds =
      types.length > 0 && matchedStaff?.staffIntentTypes?.length
        ? types
          .filter((it) => matchedStaff.staffIntentTypes.some((s) => s.intentTypeName === it.typeName))
          .map((it) => it.id)
        : []
    setEditForm({
      name: staff.name,
      email: staff.email,
      phone: matchedStaff?.phone ?? '',
      intentTypeIds
    })
    setEditStaffDialogOpen(true)
  }

  const fetchStaffs = async () => {
    try {
      const response = await StaffApi.getStaffs(1, 50)
      setApiStaffs(extractStaffItemsFromResponse(response))
    } catch (error) {
      console.log('Fetch staffs failed:', error)
    }
  }

  useEffect(() => {
    if (!addStaffDialogOpen) return
    let cancelled = false
    const loadRoles = async () => {
      setRolesLoading(true)
      try {
        const list = await RolesApi.getRoles()
        if (!cancelled) setRoles(list)
      } catch {
        if (!cancelled) {
          setRoles([])
          toast.error('Không tải được danh sách vai trò.')
        }
      } finally {
        if (!cancelled) setRolesLoading(false)
      }
    }
    void loadRoles()
    return () => {
      cancelled = true
    }
  }, [addStaffDialogOpen])

  useEffect(() => {
    let cancelled = false
    const loadInitialStaffs = async () => {
      try {
        const response = await StaffApi.getStaffs(1, 50)
        if (cancelled) return
        setApiStaffs(extractStaffItemsFromResponse(response))
      } catch (error) {
        if (cancelled) return
        console.log('Fetch staffs failed:', error)
      }
    }
    void loadInitialStaffs()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const loadIntentTypes = async () => {
      setIntentTypesLoading(true)
      try {
        const list = await IntentTypeApi.getIntentTypes()
        if (!cancelled) setIntentTypes(list)
      } catch {
        if (!cancelled) {
          setIntentTypes([])
          toast.error('Không tải được danh sách loại chức năng.')
        }
      } finally {
        if (!cancelled) setIntentTypesLoading(false)
      }
    }
    void loadIntentTypes()
    return () => {
      cancelled = true
    }
  }, [])

  const normalizePhone = (p: string) => p.replace(/\s/g, '').trim()

  const getDuplicateCreateMessage = (email: string, phone: string): string | null => {
    const emailNorm = email.trim().toLowerCase()
    const phoneNorm = normalizePhone(phone)
    if (!apiStaffs?.length) return null
    const emailTaken = apiStaffs.some((s) => s.email.trim().toLowerCase() === emailNorm)
    const phoneTaken = phoneNorm.length > 0 && apiStaffs.some((s) => normalizePhone(s.phone ?? '') === phoneNorm)
    if (emailTaken && phoneTaken) return 'Email và số điện thoại đã tồn tại trong hệ thống'
    if (emailTaken) return 'Email đã được đăng ký cho tài khoản khác'
    if (phoneTaken) return 'Số điện thoại đã được đăng ký cho tài khoản khác'
    return null
  }

  const getApiErrorToastMessage = (error: unknown, fallback: string): string => {
    if (!axios.isAxiosError(error)) return fallback
    const data = error.response?.data as { message?: string; reason?: string } | undefined
    const text = `${data?.message ?? ''} ${data?.reason ?? ''}`.toLowerCase()
    if (
      text.includes('email') &&
      (text.includes('duplicate') || text.includes('exist') || text.includes('already') || text.includes('tồn tại') || text.includes('trùng'))
    ) {
      return 'Email đã được đăng ký cho tài khoản khác'
    }
    if (
      text.includes('phone') &&
      (text.includes('duplicate') || text.includes('exist') || text.includes('already') || text.includes('tồn tại') || text.includes('trùng'))
    ) {
      return 'Số điện thoại đã được đăng ký cho tài khoản khác'
    }
    if (text.includes('duplicate') || text.includes('already exists') || text.includes('trùng') || text.includes('tồn tại')) {
      return 'Thông tin đăng ký bị trùng (email hoặc số điện thoại)'
    }
    if (data?.message) return data.message
    if (data?.reason) return data.reason
    return fallback
  }

  const handleCreateStaff = async () => {
    if (!addForm.roleId.trim()) {
      toast.error('Vui lòng chọn vai trò.')
      return
    }
    const duplicateMsg = getDuplicateCreateMessage(addForm.email, addForm.phone)
    if (duplicateMsg) {
      toast.error(duplicateMsg)
      return
    }
    try {
      await StaffApi.createStaff({
        name: addForm.name,
        email: addForm.email,
        phone: addForm.phone,
        roleId: addForm.roleId,
        staffIntentTypes: staffIntentPayloadFromIds(addForm.intentTypeIds)
      })
      setAddStaffDialogOpen(false)
      setAddForm({ name: '', email: '', phone: '', roleId: '', intentTypeIds: [] })
      toast.success('Thêm tài khoản thành công')
      await fetchStaffs()
    } catch (error) {
      console.log('Create staff failed:', error)
      toast.error(getApiErrorToastMessage(error, 'Không thể tạo tài khoản. Vui lòng thử lại.'))
    }
  }

  const handleUpdateStaff = async () => {
    if (!selectedStaff) return
    try {
      await StaffApi.updateStaff(selectedStaff.id, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        staffIntentTypes: staffIntentPayloadFromIds(editForm.intentTypeIds)
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
  const totalStaffPages = Math.max(1, Math.ceil(uiStaffs.length / STAFFS_PER_PAGE))
  const effectiveStaffPage = Math.min(staffPage, totalStaffPages)
  const paginatedStaffs = useMemo(() => {
    const start = (effectiveStaffPage - 1) * STAFFS_PER_PAGE
    return uiStaffs.slice(start, start + STAFFS_PER_PAGE)
  }, [uiStaffs, effectiveStaffPage])

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
        {paginatedStaffs.map((staff) => (
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
                onClick={() => void openEdit(staff)}
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
      <div className="mt-4 flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" disabled={effectiveStaffPage === 1} onClick={() => setStaffPage((p) => Math.max(1, p - 1))}>
          Trước
        </Button>
        <p className="text-xs text-gray-500 text-center flex-1 min-w-0">
          Trang {effectiveStaffPage}/{totalStaffPages}
        </p>
        <Button variant="outline" size="sm" disabled={effectiveStaffPage === totalStaffPages} onClick={() => setStaffPage((p) => Math.min(totalStaffPages, p + 1))}>
          Sau
        </Button>
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
              <label htmlFor="role" className="text-sm font-medium">Vai trò</label>
              <select
                id="role"
                value={addForm.roleId}
                onChange={(e) => setAddForm((prev) => ({ ...prev, roleId: e.target.value }))}
                disabled={rolesLoading}
                className="w-full py-2 px-3 rounded-[6px] bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3366CC]/30 text-sm disabled:opacity-60"
              >
                <option value="">-- Chọn vai trò --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Loại chức năng</label>
              <p className="text-xs text-gray-500">Chọn một hoặc nhiều theo tên loại; hệ thống gửi UUID tương ứng.</p>
              <IntentTypeChecklist
                intentTypes={intentTypes}
                loading={intentTypesLoading}
                selectedIds={addForm.intentTypeIds}
                onChange={(next) => setAddForm((prev) => ({ ...prev, intentTypeIds: next }))}
              />
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
            <p className="text-sm text-gray-500">Cập nhật thông tin</p>
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
              <label className="text-sm font-medium">Loại chức năng</label>
              <p className="text-xs text-gray-500">Chọn một hoặc nhiều theo tên loại; hệ thống gửi UUID tương ứng.</p>
              <IntentTypeChecklist
                intentTypes={intentTypes}
                loading={intentTypesLoading}
                selectedIds={editForm.intentTypeIds}
                onChange={(next) => setEditForm((prev) => ({ ...prev, intentTypeIds: next }))}
              />
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

