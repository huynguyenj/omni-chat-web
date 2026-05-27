import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import Input from '@/components/ui/input/Input'
import { STAFF_ACCOUNTS } from '@/components/admin/admin-dashboard-data'
import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  ClipboardList,
  CreditCard,
  Edit2,
  Layers,
  Mail,
  Package,
  Phone,
  Plus,
  Save,
  Shield,
  ShoppingBag,
  Tag,
  Trash2,
  User,
  UserPlus,
  X
} from 'lucide-react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xl sm:p-7"
        onMouseDown={(e) => e.stopPropagation()}
      >
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

const NAME_MIN_LEN = 2
const NAME_MAX_LEN = 50
const EMAIL_MIN_LEN = 5
const EMAIL_MAX_LEN = 254
const VN_PHONE_LEN_MIN = 10
const VN_PHONE_LEN_MAX = 11
const DANGEROUS_NAME_CHARS = /[<>{};]/
const NAME_ALLOWED_CHARS = /^[\p{L}\s]+$/u
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function validateStaffName(raw: string): { ok: true; value: string } | { ok: false; message: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: false, message: 'Họ và tên không được để trống.' }
  if (trimmed.length < NAME_MIN_LEN || trimmed.length > NAME_MAX_LEN) {
    return { ok: false, message: `Họ và tên phải từ ${NAME_MIN_LEN} đến ${NAME_MAX_LEN} ký tự (đã loại khoảng trắng đầu/cuối).` }
  }
  if (DANGEROUS_NAME_CHARS.test(trimmed)) {
    return { ok: false, message: 'Họ và tên không được chứa các ký tự: < > { } ;' }
  }
  if (!NAME_ALLOWED_CHARS.test(trimmed)) {
    return { ok: false, message: 'Họ và tên chỉ được phép chữ cái (có dấu tiếng Việt) và khoảng trắng.' }
  }
  return { ok: true, value: trimmed }
}

function validateStaffEmail(raw: string): { ok: true; value: string } | { ok: false; message: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: false, message: 'Email không được để trống.' }
  if (trimmed.length < EMAIL_MIN_LEN) {
    return { ok: false, message: `Email phải có ít nhất ${EMAIL_MIN_LEN} ký tự.` }
  }
  if (trimmed.length > EMAIL_MAX_LEN) {
    return { ok: false, message: `Email không được vượt quá ${EMAIL_MAX_LEN} ký tự.` }
  }
  if (!EMAIL_FORMAT.test(trimmed)) {
    return { ok: false, message: 'Email không đúng định dạng.' }
  }
  return { ok: true, value: trimmed }
}

function validateStaffPhoneDigits(digits: string): { ok: true; value: string } | { ok: false; message: string } {
  if (!digits) return { ok: false, message: 'Số điện thoại không được để trống.' }
  if (!/^\d+$/.test(digits)) return { ok: false, message: 'Số điện thoại chỉ được nhập số.' }
  if (digits.length < VN_PHONE_LEN_MIN || digits.length > VN_PHONE_LEN_MAX) {
    return {
      ok: false,
      message: `Số điện thoại phải có từ ${VN_PHONE_LEN_MIN} đến ${VN_PHONE_LEN_MAX} số.`
    }
  }
  if (!digits.startsWith('0')) {
    return { ok: false, message: 'Số điện thoại phải bắt đầu bằng số 0.' }
  }
  return { ok: true, value: digits }
}

type StaffFieldKey = 'name' | 'email' | 'phone' | 'role'
type StaffFormErrors = Partial<Record<StaffFieldKey, string>>

function getDuplicateAddFieldErrors(
  apiStaffs: StaffItem[] | null | undefined,
  emailNorm: string,
  phoneDigits: string
): Pick<StaffFormErrors, 'email' | 'phone'> {
  const errors: Pick<StaffFormErrors, 'email' | 'phone'> = {}
  if (!apiStaffs?.length) return errors
  const emailTaken = apiStaffs.some((s) => s.email.trim().toLowerCase() === emailNorm)
  const phoneTaken =
    phoneDigits.length > 0 && apiStaffs.some((s) => digitsOnly(s.phone ?? '') === phoneDigits)
  if (emailTaken) errors.email = 'Email đã được đăng ký cho tài khoản khác.'
  if (phoneTaken) errors.phone = 'Số điện thoại đã được đăng ký cho tài khoản khác.'
  return errors
}

function getDuplicateEditFieldErrors(
  apiStaffs: StaffItem[] | null | undefined,
  excludeStaffId: string,
  emailNorm: string,
  phoneDigits: string
): Pick<StaffFormErrors, 'email' | 'phone'> {
  const errors: Pick<StaffFormErrors, 'email' | 'phone'> = {}
  if (!apiStaffs?.length) return errors
  const emailTaken = apiStaffs.some(
    (s) => s.id !== excludeStaffId && s.email.trim().toLowerCase() === emailNorm
  )
  const phoneTaken =
    phoneDigits.length > 0 &&
    apiStaffs.some((s) => s.id !== excludeStaffId && digitsOnly(s.phone ?? '') === phoneDigits)
  if (emailTaken) errors.email = 'Email đã được đăng ký cho tài khoản khác.'
  if (phoneTaken) errors.phone = 'Số điện thoại đã được đăng ký cho tài khoản khác.'
  return errors
}

const INTENT_DECOR_ICONS: LucideIcon[] = [Tag, ClipboardList, CreditCard, ShoppingBag, Package, Layers]

function AccountFormField({
  icon: Icon,
  label,
  helper,
  error,
  children
}: {
  icon: LucideIcon
  label: string
  helper: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EBF1FF] text-[#3366CC]">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 space-y-1.5">
        <span className="block text-sm font-bold text-[#003366]">{label}</span>
        {children}
        {error ? <p className="text-xs font-medium leading-relaxed text-red-500">{error}</p> : null}
        <p className="text-xs leading-relaxed text-gray-500">{helper}</p>
      </div>
    </div>
  )
}

function IntentTypeChecklist({
  intentTypes,
  loading,
  selectedIds,
  onChange,
  heightMode = 'auto'
}: {
  intentTypes: IntentTypeItem[]
  loading: boolean
  selectedIds: string[]
  onChange: (next: string[]) => void
  heightMode?: 'auto' | 'fill'
}) {
  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])
  }

  const fill = heightMode === 'fill'

  if (loading) {
    return (
      <p
        className={`rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-center text-sm text-gray-500 ${fill ? 'flex min-h-[12rem] flex-1 items-center justify-center' : ''}`}
      >
        Đang tải danh sách loại chức năng...
      </p>
    )
  }
  if (intentTypes.length === 0) {
    return (
      <p
        className={`rounded-xl border border-dashed border-amber-200 bg-amber-50/80 px-3 py-4 text-center text-sm text-amber-800 ${fill ? 'flex min-h-[12rem] flex-1 items-center justify-center' : ''}`}
      >
        Chưa có dữ liệu loại chức năng. Thử tải lại trang.
      </p>
    )
  }
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-[#F8FAFC] p-3 sm:p-4 ${fill ? 'flex min-h-0 flex-1 flex-col' : ''}`}
    >
      <div className="mb-3 flex shrink-0 gap-2.5 sm:mb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EBF1FF] text-[#3366CC]">
          <Shield className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-[#003366] sm:text-sm">Loại chức năng</p>
          <p className="mt-0.5 text-[11px] leading-snug text-gray-500 sm:text-xs">
            Chọn một hoặc nhiều theo tên loại; hệ thống gửi UUID tương ứng.
          </p>
        </div>
      </div>
      <div
        className={
          fill
            ? 'min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5'
            : 'max-h-52 space-y-2 overflow-y-auto pr-0.5 sm:max-h-56 lg:max-h-[min(28rem,calc(92vh-16rem))]'
        }
      >
        {intentTypes.map((it, index) => {
          const Decor = INTENT_DECOR_ICONS[index % INTENT_DECOR_ICONS.length]
          return (
            <label
              key={it.id}
              htmlFor={`intent-${it.id}`}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm transition-colors hover:border-[#3366CC]/40 hover:shadow-md sm:p-3"
            >
              <input
                id={`intent-${it.id}`}
                type="checkbox"
                className="h-4 w-4 shrink-0 rounded border-gray-300 text-[#3366CC] focus:ring-[#3366CC]"
                checked={selectedIds.includes(it.id)}
                onChange={() => toggle(it.id)}
              />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                <Decor className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#003366]">{it.typeName}</span>
                {it.description ? (
                  <span className="mt-0.5 block text-[11px] leading-snug text-gray-500 sm:text-xs">{it.description}</span>
                ) : null}
              </span>
            </label>
          )
        })}
      </div>
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
  const [addFormErrors, setAddFormErrors] = useState<StaffFormErrors>({})
  const [editFormErrors, setEditFormErrors] = useState<StaffFormErrors>({})

  // Staff tab: list staff accounts and manage add/edit dialogs.
  const openEdit = async (staff: StaffAccount) => {
    setEditFormErrors({})
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
          .filter((it) =>
            matchedStaff.staffIntentTypes.some(
              (s) => s.id === it.id || s.intentTypeName === it.typeName
            )
          )
          .map((it) => it.id)
        : []
    setEditForm({
      name: staff.name,
      email: staff.email,
      phone: digitsOnly(matchedStaff?.phone ?? staff.phone ?? ''),
      intentTypeIds
    })
    setEditStaffDialogOpen(true)
  }

  const fetchStaffs = async () => {
    try {
      const data = await StaffApi.getStaffs({ pageNumber: 1, pageSize: 100, descending: false })
      setApiStaffs(extractStaffItemsFromResponse(data))
    } catch {
      // Failed to refresh list; existing data unchanged
    }
  }

  useEffect(() => {
    if (!addStaffDialogOpen) return
    setAddFormErrors({})
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
    if (editStaffDialogOpen) setEditFormErrors({})
  }, [editStaffDialogOpen])

  useEffect(() => {
    let cancelled = false
    const loadInitialStaffs = async () => {
      try {
        const data = await StaffApi.getStaffs({ pageNumber: 1, pageSize: 100, descending: false })
        if (cancelled) return
        setApiStaffs(extractStaffItemsFromResponse(data))
      } catch {
        if (cancelled) return
        toast.error('Không tải được danh sách nhân viên.')
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
    const errors: StaffFormErrors = {}

    const nameResult = validateStaffName(addForm.name)
    if (!nameResult.ok) errors.name = nameResult.message

    const emailResult = validateStaffEmail(addForm.email)
    if (!emailResult.ok) errors.email = emailResult.message

    const phoneResult = validateStaffPhoneDigits(digitsOnly(addForm.phone))
    if (!phoneResult.ok) errors.phone = phoneResult.message

    if (!addForm.roleId.trim()) errors.role = 'Vui lòng chọn vai trò.'

    if (nameResult.ok && emailResult.ok && phoneResult.ok) {
      const dup = getDuplicateAddFieldErrors(apiStaffs, emailResult.value.toLowerCase(), phoneResult.value)
      if (dup.email) errors.email = dup.email
      if (dup.phone) errors.phone = dup.phone
    }

    if (Object.keys(errors).length > 0) {
      setAddFormErrors(errors)
      toast.error('Vui lòng kiểm tra lại thông tin đã nhập.')
      return
    }
    setAddFormErrors({})

    if (!nameResult.ok || !emailResult.ok || !phoneResult.ok) return

    try {
      await StaffApi.createStaff({
        name: nameResult.value,
        email: emailResult.value,
        phone: phoneResult.value,
        roleId: addForm.roleId,
        staffIntentTypes: staffIntentPayloadFromIds(addForm.intentTypeIds)
      })
      setAddStaffDialogOpen(false)
      setAddForm({ name: '', email: '', phone: '', roleId: '', intentTypeIds: [] })
      toast.success('Thêm tài khoản thành công')
      await fetchStaffs()
    } catch (error) {
      toast.error(getApiErrorToastMessage(error, 'Không thể tạo tài khoản. Vui lòng thử lại.'))
    }
  }

  const handleUpdateStaff = async () => {
    if (!selectedStaff) return

    const errors: StaffFormErrors = {}

    const nameResult = validateStaffName(editForm.name)
    if (!nameResult.ok) errors.name = nameResult.message

    const emailResult = validateStaffEmail(editForm.email)
    if (!emailResult.ok) errors.email = emailResult.message

    const phoneResult = validateStaffPhoneDigits(digitsOnly(editForm.phone))
    if (!phoneResult.ok) errors.phone = phoneResult.message

    if (nameResult.ok && emailResult.ok && phoneResult.ok) {
      const dup = getDuplicateEditFieldErrors(
        apiStaffs,
        selectedStaff.id,
        emailResult.value.toLowerCase(),
        phoneResult.value
      )
      if (dup.email) errors.email = dup.email
      if (dup.phone) errors.phone = dup.phone
    }

    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors)
      toast.error('Vui lòng kiểm tra lại thông tin đã nhập.')
      return
    }
    setEditFormErrors({})

    if (!nameResult.ok || !emailResult.ok || !phoneResult.ok) return

    try {
      await StaffApi.updateStaff(selectedStaff.id, {
        name: nameResult.value,
        email: emailResult.value,
        phone: phoneResult.value,
        staffIntentTypes: staffIntentPayloadFromIds(editForm.intentTypeIds)
      })
      setEditStaffDialogOpen(false)
      toast.success('Cập nhật thành công')
      await fetchStaffs()
    } catch (error) {
      toast.error(getApiErrorToastMessage(error, 'Không thể cập nhật tài khoản. Vui lòng thử lại.'))
    }
  }

  const handleDeleteStaff = async (id: string) => {
    try {
      await StaffApi.deleteStaff(id)
      toast.success('Xóa tài khoản thành công')
      await fetchStaffs()
    } catch (error) {
      toast.error(getApiErrorToastMessage(error, 'Không thể xóa tài khoản. Vui lòng thử lại.'))
    }
  }

  const uiStaffs = useMemo<StaffAccount[]>(() => {
    if (!apiStaffs) return STAFF_ACCOUNTS

    return apiStaffs.map((staff) => ({
      id: staff.id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.roleName,
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
          <h2 className="text-[#003366] text-3xl font-bold">Quản lý tài khoản</h2>
          <p className="text-base text-gray-500 mt-1.5">{uiStaffs.length} tài khoản trong hệ thống</p>
        </div>
        <Button onClick={() => setAddStaffDialogOpen(true)} className="bg-[#3366CC] hover:bg-[#2952A3] text-base px-4 py-2.5">
          <Plus className="h-5 w-5 mr-2" />
          Thêm tài khoản
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedStaffs.map((staff) => (
          <Card key={staff.id} className="p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 border-t-[#3366CC] bg-white group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-[#3366CC] text-white flex items-center justify-center text-xl font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0">
                    {staff.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#003366] text-base sm:text-lg leading-snug line-clamp-1">{staff.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 italic mt-0.5">{staff.email}</p>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 italic">{staff.phone ?? '-'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`text-xs sm:text-sm px-2.5 py-1 min-h-[26px] inline-flex items-center rounded-md text-white font-medium ${
                      staff.role === 'Manager'
                        ? 'bg-purple-500'
                        : staff.role === 'Shipper'
                          ? 'bg-amber-600'
                          : 'bg-[#3366CC]'
                    }`}
                  >
                    {staff.role}
                  </span>
                  <span
                    className={`text-xs sm:text-sm px-2.5 py-1 min-h-[26px] inline-flex items-center rounded-md text-white font-medium ${staff.status === 'active' ? 'bg-[#2ECC71]' : 'bg-gray-400'}`}
                  >
                    {staff.status === 'active' ? 'Hoạt động' : 'Nghỉ'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 p-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 uppercase font-semibold tracking-wide text-xs sm:text-sm">Loại chức năng</span>
                    <span className="text-[#003366] font-semibold leading-snug">{staff.department}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 text-sm border-[#3366CC]/30 text-[#3366CC] hover:bg-[#3366CC]/5"
                onClick={() => void openEdit(staff)}
              >
                <Edit2 className="h-4 w-4 mr-1.5 shrink-0" />
                Sửa
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 text-sm text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleDeleteStaff(staff.id)}
              >
                <Trash2 className="h-4 w-4 mr-1.5 shrink-0" />
                Xóa
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" className="text-sm min-h-10 px-4" disabled={effectiveStaffPage === 1} onClick={() => setStaffPage((p) => Math.max(1, p - 1))}>
          Trước
        </Button>
        <p className="text-sm text-gray-500 text-center flex-1 min-w-0">
          Trang {effectiveStaffPage}/{totalStaffPages}
        </p>
        <Button variant="outline" size="sm" className="text-sm min-h-10 px-4" disabled={effectiveStaffPage === totalStaffPages} onClick={() => setStaffPage((p) => Math.min(totalStaffPages, p + 1))}>
          Sau
        </Button>
      </div>

      {addStaffDialogOpen && (
        <ModalShell onClose={() => setAddStaffDialogOpen(false)}>
          <div className="relative mb-6 flex items-start justify-between gap-3 pr-14 sm:pr-16">
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold uppercase leading-tight tracking-wide text-[#003366] sm:text-base">Thêm tài khoản mới</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">Tạo tài khoản Staff hoặc Manager và gán loại chức năng phù hợp.</p>
            </div>
            <span
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF1FF] text-[#3366CC] sm:h-12 sm:w-12"
              aria-hidden
            >
              <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5">
                <AccountFormField
                  icon={User}
                  label="Họ và tên"
                  helper={`${NAME_MIN_LEN}–${NAME_MAX_LEN} ký tự; chỉ chữ cái (có dấu) và khoảng trắng; không dùng ký tự < > { } ; — khoảng trắng đầu/cuối sẽ được loại khi lưu.`}
                  error={addFormErrors.name}
                >
                  <Input
                    id="name"
                    placeholder="Nhập họ và tên"
                    variant="gray"
                    value={addForm.name}
                    onChange={(e) => {
                      setAddFormErrors((prev) => ({ ...prev, name: undefined }))
                      setAddForm((prev) => ({ ...prev, name: e.target.value }))
                    }}
                    className="rounded-xl border border-gray-200 !bg-white shadow-sm focus-within:border-[#3366CC] focus-within:shadow-[0_0_0_3px_rgba(51,102,204,0.15)]"
                  />
                </AccountFormField>
                <AccountFormField
                  icon={Mail}
                  label="Email"
                  helper={`Đúng định dạng email; ${EMAIL_MIN_LEN}–${EMAIL_MAX_LEN} ký tự; không trùng tài khoản khác.`}
                  error={addFormErrors.email}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@omnichat.com"
                    variant="gray"
                    value={addForm.email}
                    onChange={(e) => {
                      setAddFormErrors((prev) => ({ ...prev, email: undefined }))
                      setAddForm((prev) => ({ ...prev, email: e.target.value }))
                    }}
                    className="rounded-xl border border-gray-200 !bg-white shadow-sm focus-within:border-[#3366CC] focus-within:shadow-[0_0_0_3px_rgba(51,102,204,0.15)]"
                  />
                </AccountFormField>
                <AccountFormField
                  icon={Phone}
                  label="Số điện thoại"
                  helper={`Chỉ nhập số; ${VN_PHONE_LEN_MIN}–${VN_PHONE_LEN_MAX} số; bắt đầu bằng 0; không trùng tài khoản khác.`}
                  error={addFormErrors.phone}
                >
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="0912345678"
                    variant="gray"
                    value={addForm.phone}
                    onChange={(e) => {
                      setAddFormErrors((prev) => ({ ...prev, phone: undefined }))
                      const v = digitsOnly(e.target.value).slice(0, VN_PHONE_LEN_MAX)
                      setAddForm((prev) => ({ ...prev, phone: v }))
                    }}
                    className="rounded-xl border border-gray-200 !bg-white shadow-sm focus-within:border-[#3366CC] focus-within:shadow-[0_0_0_3px_rgba(51,102,204,0.15)]"
                  />
                </AccountFormField>
                <AccountFormField icon={Briefcase} label="Vai trò" helper="Chọn vai trò cho tài khoản này" error={addFormErrors.role}>
                  <select
                    id="role"
                    value={addForm.roleId}
                    onChange={(e) => {
                      setAddFormErrors((prev) => ({ ...prev, role: undefined }))
                      setAddForm((prev) => ({ ...prev, roleId: e.target.value }))
                    }}
                    disabled={rolesLoading}
                    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-medium text-[#003366] shadow-sm focus:border-[#3366CC] focus:outline-none focus:ring-[3px] focus:ring-[#3366CC]/15 disabled:opacity-60 ${addFormErrors.role ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-200'}`}
                  >
                    <option value="">-- Chọn vai trò --</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </AccountFormField>
              </div>
              <aside className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-gray-100 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <IntentTypeChecklist
                  heightMode="fill"
                  intentTypes={intentTypes}
                  loading={intentTypesLoading}
                  selectedIds={addForm.intentTypeIds}
                  onChange={(next) => setAddForm((prev) => ({ ...prev, intentTypeIds: next }))}
                />
              </aside>
            </div>
            <div className="flex gap-3 border-t border-gray-100 pt-5">
              <Button
                variant="outline"
                onClick={() => setAddStaffDialogOpen(false)}
                className="flex-1 min-h-11 border-[#3366CC] text-[#3366CC] hover:bg-[#EBF1FF]"
              >
                <X className="h-4 w-4 shrink-0" aria-hidden />
                Hủy
              </Button>
              <Button className="flex-1 min-h-11 bg-[#3366CC] hover:bg-[#2952A3] text-white" onClick={handleCreateStaff}>
                <Save className="h-4 w-4 shrink-0" aria-hidden />
                Tạo tài khoản
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {editStaffDialogOpen && selectedStaff && (
        <ModalShell onClose={() => setEditStaffDialogOpen(false)}>
          <div className="relative mb-6 flex items-start justify-between gap-3 pr-14 sm:pr-16">
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold uppercase leading-tight tracking-wide text-[#003366] sm:text-base">Sửa thông tin tài khoản</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">Cập nhật và thay đổi thông tin tài khoản của bạn</p>
            </div>
            <span
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF1FF] text-[#3366CC] sm:h-12 sm:w-12"
              aria-hidden
            >
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5">
                <AccountFormField
                  icon={User}
                  label="Họ và tên"
                  helper={`${NAME_MIN_LEN}–${NAME_MAX_LEN} ký tự; chỉ chữ cái (có dấu) và khoảng trắng; không dùng ký tự < > { } ; — khoảng trắng đầu/cuối sẽ được loại khi lưu.`}
                  error={editFormErrors.name}
                >
                  <Input
                    id="edit-name"
                    placeholder="Nhập họ và tên"
                    value={editForm.name}
                    onChange={(e) => {
                      setEditFormErrors((prev) => ({ ...prev, name: undefined }))
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }}
                    variant="gray"
                    className="rounded-xl border border-gray-200 !bg-white shadow-sm focus-within:border-[#3366CC] focus-within:shadow-[0_0_0_3px_rgba(51,102,204,0.15)]"
                  />
                </AccountFormField>
                <AccountFormField
                  icon={Mail}
                  label="Email"
                  helper={`Đúng định dạng email; ${EMAIL_MIN_LEN}–${EMAIL_MAX_LEN} ký tự; không trùng tài khoản khác.`}
                  error={editFormErrors.email}
                >
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="example@omnichat.com"
                    value={editForm.email}
                    onChange={(e) => {
                      setEditFormErrors((prev) => ({ ...prev, email: undefined }))
                      setEditForm((prev) => ({ ...prev, email: e.target.value }))
                    }}
                    variant="gray"
                    className="rounded-xl border border-gray-200 !bg-white shadow-sm focus-within:border-[#3366CC] focus-within:shadow-[0_0_0_3px_rgba(51,102,204,0.15)]"
                  />
                </AccountFormField>
                <AccountFormField
                  icon={Phone}
                  label="Số điện thoại"
                  helper={`Chỉ nhập số; ${VN_PHONE_LEN_MIN}–${VN_PHONE_LEN_MAX} số; bắt đầu bằng 0; không trùng tài khoản khác.`}
                  error={editFormErrors.phone}
                >
                  <Input
                    id="edit-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="0912345678"
                    value={editForm.phone}
                    onChange={(e) => {
                      setEditFormErrors((prev) => ({ ...prev, phone: undefined }))
                      const v = digitsOnly(e.target.value).slice(0, VN_PHONE_LEN_MAX)
                      setEditForm((prev) => ({ ...prev, phone: v }))
                    }}
                    variant="gray"
                    className="rounded-xl border border-gray-200 !bg-white shadow-sm focus-within:border-[#3366CC] focus-within:shadow-[0_0_0_3px_rgba(51,102,204,0.15)]"
                  />
                </AccountFormField>
              </div>
              <aside className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-gray-100 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <IntentTypeChecklist
                  heightMode="fill"
                  intentTypes={intentTypes}
                  loading={intentTypesLoading}
                  selectedIds={editForm.intentTypeIds}
                  onChange={(next) => setEditForm((prev) => ({ ...prev, intentTypeIds: next }))}
                />
              </aside>
            </div>
            <div className="flex gap-3 border-t border-gray-100 pt-5">
              <Button
                variant="outline"
                onClick={() => setEditStaffDialogOpen(false)}
                className="flex-1 min-h-11 border-[#3366CC] text-[#3366CC] hover:bg-[#EBF1FF]"
              >
                <X className="h-4 w-4 shrink-0" aria-hidden />
                Hủy
              </Button>
              <Button className="flex-1 min-h-11 bg-[#3366CC] hover:bg-[#2952A3] text-white" onClick={handleUpdateStaff}>
                <Save className="h-4 w-4 shrink-0" aria-hidden />
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  )
}

