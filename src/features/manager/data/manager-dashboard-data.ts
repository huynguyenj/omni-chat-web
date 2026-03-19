export type ManagerStaff = {
  id: string
  name: string
  email: string
  department: string
  status: 'active' | 'inactive'
  totalChats: number
  avgResponseTime: string
}

export const ITEMS_PER_PAGE = 6

// Mock staff list copied from your template (v1).
export const STAFF_LIST: ManagerStaff[] = [
  {
    id: 'ST001',
    name: 'Nguyễn Văn A',
    email: 'staff1@example.com',
    department: 'CSKH',
    status: 'active',
    totalChats: 145,
    avgResponseTime: '2.3 phút'
  },
  {
    id: 'ST002',
    name: 'Trần Thị B',
    email: 'staff2@example.com',
    department: 'CSKH',
    status: 'active',
    totalChats: 132,
    avgResponseTime: '1.8 phút'
  },
  {
    id: 'ST003',
    name: 'Lê Văn C',
    email: 'staff3@example.com',
    department: 'Kỹ thuật',
    status: 'inactive',
    totalChats: 98,
    avgResponseTime: '3.1 phút'
  }
]

export type ManagerKeyword = {
  id: string
  keyword: string
  priority: 'high' | 'medium' | 'low'
  assignedTo: string
  count: number
}

export const KEYWORDS_LIST: ManagerKeyword[] = [
  { id: 'KW001', keyword: 'sản phẩm', priority: 'high', assignedTo: 'Tất cả', count: 245 },
  { id: 'KW002', keyword: 'đơn hàng', priority: 'high', assignedTo: 'Tất cả', count: 189 },
  { id: 'KW003', keyword: 'giá', priority: 'medium', assignedTo: 'CSKH', count: 156 },
  { id: 'KW004', keyword: 'đổi trả', priority: 'high', assignedTo: 'CSKH', count: 98 }
]

export type ManagerBatchStatus = 'active' | 'low-stock' | 'near-expiry'
export type ManagerBatch = {
  id: string
  batch: string
  stock: number
  mfgDate: string
  expDate: string
  daysToExpire: number
  status: ManagerBatchStatus
}

export type ManagerProduct = {
  id: string
  name: string
  sku: string
  category: string
  price: string
  totalStock: number
  batches: ManagerBatch[]
}

export const PRODUCTS_WITH_BATCHES: ManagerProduct[] = [
  {
    id: 'P001',
    name: 'Sữa tươi Vinamilk không đường',
    sku: 'VNM001',
    category: 'Sữa tươi',
    price: '32.000đ',
    totalStock: 224,
    batches: [
      { id: 'B001', batch: 'LOT20260125', stock: 68, mfgDate: '25/01/2026', expDate: '25/03/2026', daysToExpire: 50, status: 'active' },
      { id: 'B002', batch: 'LOT20260115', stock: 89, mfgDate: '15/01/2026', expDate: '15/03/2026', daysToExpire: 40, status: 'active' },
      { id: 'B003', batch: 'LOT20260105', stock: 67, mfgDate: '05/01/2026', expDate: '05/03/2026', daysToExpire: 30, status: 'near-expiry' }
    ]
  },
  {
    id: 'P004',
    name: 'Sữa bột Ensure Gold 850g',
    sku: 'ENS004',
    category: 'Sữa bột',
    price: '685.000đ',
    totalStock: 15,
    batches: [
      { id: 'B007', batch: 'LOT20260101', stock: 10, mfgDate: '01/01/2026', expDate: '01/01/2028', daysToExpire: 697, status: 'active' },
      { id: 'B008', batch: 'LOT20251215', stock: 5, mfgDate: '15/12/2025', expDate: '15/12/2027', daysToExpire: 650, status: 'low-stock' }
    ]
  }
]

export type ManagerOrderProduct = { name: string; quantity: number; price: number }
export type ManagerOrderStatus = 'pending' | 'completed'
export type ManagerOrder = {
  id: string
  customer: string
  products: ManagerOrderProduct[]
  total: number
  status: ManagerOrderStatus
  date: string
  phone: string
  address: string
}

export const ORDERS_LIST: ManagerOrder[] = [
  {
    id: 'ORD001',
    customer: 'Nguyễn Văn A',
    products: [
      { name: 'Sữa tươi Vinamilk không đường', quantity: 2, price: 32000 },
      { name: 'Sữa chua uống TH True Milk', quantity: 3, price: 28000 }
    ],
    total: 148000,
    status: 'pending',
    date: '01/02/2026',
    phone: '0901234567',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM'
  },
  {
    id: 'ORD002',
    customer: 'Trần Thị B',
    products: [{ name: 'Sữa đặc có đường Ông Thọ', quantity: 1, price: 42000 }],
    total: 42000,
    status: 'completed',
    date: '01/02/2026',
    phone: '0912345678',
    address: '456 Lê Lợi, Q.3, TP.HCM'
  }
]

export type ManagerClaimStatus = 'pending' | 'approved' | 'rejected'
export type ManagerClaim = {
  id: string
  staff: string
  type: string
  reason: string
  startDate: string
  endDate: string
  status: ManagerClaimStatus
}

export const CLAIMS_LIST: ManagerClaim[] = [
  { id: 'CLM001', staff: 'Nguyễn Văn A', type: 'Nghỉ phép', reason: 'Ốm đau', startDate: '05/02/2026', endDate: '07/02/2026', status: 'pending' },
  { id: 'CLM002', staff: 'Trần Thị B', type: 'Nghỉ phép', reason: 'Việc gia đình', startDate: '10/02/2026', endDate: '12/02/2026', status: 'approved' },
  { id: 'CLM003', staff: 'Lê Văn C', type: 'WFH', reason: 'Công tác xa', startDate: '03/02/2026', endDate: '03/02/2026', status: 'rejected' }
]

export type ManagerWarningSeverity = 'high' | 'medium'
export type ManagerWarning = {
  id: string
  staff: string
  customer: string
  issue: string
  severity: ManagerWarningSeverity
  messageCount?: number
  waitTime?: string
  time: string
  details: string
}

export const WARNING_CONVERSATIONS: ManagerWarning[] = [
  { id: 'WARN001', staff: 'Nguyễn Văn A', customer: 'Khách hàng #123', issue: 'Spam tin nhắn', severity: 'high', messageCount: 15, time: '10:30 AM', details: 'Staff gửi 15 tin nhắn liên tiếp trong 2 phút' },
  { id: 'WARN002', staff: 'Lê Văn C', customer: 'Khách hàng #456', issue: 'Không phản hồi', severity: 'medium', waitTime: '25 phút', time: '09:15 AM', details: 'Khách hàng đợi phản hồi quá 20 phút' }
]

export type ManagerShipperStatus = 'active' | 'offline'
export type ManagerShipper = {
  id: string
  name: string
  phone: string
  status: ManagerShipperStatus
  currentOrders: number
  todayDelivered: number
  totalDelivered: number
}

export const SHIPPERS_LIST: ManagerShipper[] = [
  { id: 'SHP001', name: 'Phan Văn D', phone: '0967123456', status: 'active', currentOrders: 2, todayDelivered: 5, totalDelivered: 128 },
  { id: 'SHP002', name: 'Đỗ Thị E', phone: '0978234567', status: 'active', currentOrders: 3, todayDelivered: 7, totalDelivered: 215 },
  { id: 'SHP003', name: 'Lý Văn F', phone: '0989345678', status: 'offline', currentOrders: 0, todayDelivered: 4, totalDelivered: 98 }
]

export type ManagerShippingOrderStatus = 'pending' | 'shipping' | 'delivered'
export type ManagerShippingOrder = {
  id: string
  customer: string
  phone: string
  address: string
  total: number
  status: ManagerShippingOrderStatus
  shipper: string | null
  orderDate: string
  assignedDate?: string
  deliveredDate?: string
}

export const ALL_SHIPPING_ORDERS: ManagerShippingOrder[] = [
  { id: 'ORD0125', customer: 'Nguyễn Văn A', phone: '0901234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM', total: 148000, status: 'pending', shipper: null, orderDate: '04/02/2026 10:30' },
  { id: 'ORD0126', customer: 'Trần Thị B', phone: '0912345678', address: '456 Lê Lợi, Q.3, TP.HCM', total: 42000, status: 'shipping', shipper: 'Phan Văn D', orderDate: '04/02/2026 11:15', assignedDate: '04/02/2026 11:20' },
  { id: 'ORD0120', customer: 'Phạm Văn D', phone: '0934567890', address: '321 Võ Văn Tần, Q.3, TP.HCM', total: 160000, status: 'delivered', shipper: 'Phan Văn D', orderDate: '03/02/2026 14:20', deliveredDate: '03/02/2026 16:45' }
]

