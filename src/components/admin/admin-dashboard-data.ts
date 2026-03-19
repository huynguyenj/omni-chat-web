export const STAFF_ACCOUNTS = [
  { id: 'ST001', name: 'Nguyễn Văn A', email: 'staff1@omnichat.com', role: 'Staff', department: 'CSKH', status: 'active', joinDate: '15/01/2025' },
  { id: 'ST002', name: 'Trần Thị B', email: 'staff2@omnichat.com', role: 'Staff', department: 'CSKH', status: 'active', joinDate: '20/01/2025' },
  { id: 'ST003', name: 'Lê Văn C', email: 'staff3@omnichat.com', role: 'Staff', department: 'Kỹ thuật', status: 'active', joinDate: '10/02/2025' },
  { id: 'MN001', name: 'Phạm Thị D', email: 'manager1@omnichat.com', role: 'Manager', department: 'CSKH', status: 'active', joinDate: '01/01/2025' }
]

export const KEY_STATS = [
  {
    title: 'Tồn kho sản phẩm',
    value: '262',
    subtitle: 'sản phẩm',
    change: '+12 tuần này',
    trend: 'up',
    icon: 'Package',
    color: '#3366CC',
    bgColor: '#EBF1FF'
  },
  {
    title: 'Đơn hàng thành công',
    value: '148',
    subtitle: 'đơn hàng',
    change: '+23% so với tuần trước',
    trend: 'up',
    icon: 'CheckCircle',
    color: '#2ECC71',
    bgColor: '#E8F8F0'
  },
  {
    title: 'Chờ thanh toán',
    value: '37',
    subtitle: 'đơn hàng',
    change: '+8 đơn mới',
    trend: 'neutral',
    icon: 'Clock',
    color: '#FF9800',
    bgColor: '#FFF3E0'
  },
  {
    title: 'Vấn đề phổ biến',
    value: 'Sản phẩm',
    subtitle: '245 lượt đề cập',
    change: 'Tăng 15% tuần này',
    trend: 'up',
    icon: 'Tag',
    color: '#003366',
    bgColor: '#E6F0FF'
  }
]

export const ISSUES_TRENDING_DATA = [
  { date: '25/01', 'Sản phẩm': 45, 'Đơn hàng': 32, 'Giá': 28, 'Đổi trả': 15 },
  { date: '26/01', 'Sản phẩm': 52, 'Đơn hàng': 38, 'Giá': 31, 'Đổi trả': 18 },
  { date: '27/01', 'Sản phẩm': 48, 'Đơn hàng': 41, 'Giá': 29, 'Đổi trả': 22 },
  { date: '28/01', 'Sản phẩm': 61, 'Đơn hàng': 45, 'Giá': 35, 'Đổi trả': 19 },
  { date: '29/01', 'Sản phẩm': 58, 'Đơn hàng': 48, 'Giá': 38, 'Đổi trả': 25 },
  { date: '30/01', 'Sản phẩm': 67, 'Đơn hàng': 52, 'Giá': 42, 'Đổi trả': 28 },
  { date: '31/01', 'Sản phẩm': 72, 'Đơn hàng': 56, 'Giá': 45, 'Đổi trả': 31 },
  { date: '01/02', 'Sản phẩm': 69, 'Đơn hàng': 61, 'Giá': 48, 'Đổi trả': 29 }
]

export const TOP_ISSUES = [
  { keyword: 'Sản phẩm', count: 245, percentage: 32, trend: 'up', change: '+15%' },
  { keyword: 'Đơn hàng', count: 189, percentage: 25, trend: 'up', change: '+8%' },
  { keyword: 'Giá', count: 156, percentage: 21, trend: 'down', change: '-3%' },
  { keyword: 'Đổi trả', count: 98, percentage: 13, trend: 'up', change: '+12%' },
  { keyword: 'Giao hàng', count: 68, percentage: 9, trend: 'neutral', change: '0%' }
]

export const ORDER_STATUS_DATA = [
  { name: 'Hoàn thành', value: 148, color: '#2ECC71' },
  { name: 'Chờ thanh toán', value: 37, color: '#FF9800' },
  { name: 'Đang xử lý', value: 24, color: '#3366CC' },
  { name: 'Đã hủy', value: 12, color: '#F44336' }
]

export const WAREHOUSE_BY_CATEGORY = [
  { category: 'Sữa tươi', quantity: 125, value: '45.2M', trend: 'up' },
  { category: 'Sữa chua', quantity: 89, value: '38.5M', trend: 'up' },
  { category: 'Sữa đặc', quantity: 23, value: '28.7M', trend: 'down' },
  { category: 'Sữa bột', quantity: 25, value: '12.1M', trend: 'neutral' }
]

export const ORDERS_OVER_TIME = [
  { date: '25/01', 'Thành công': 18, 'Chờ thanh toán': 5, 'Đã hủy': 2 },
  { date: '26/01', 'Thành công': 22, 'Chờ thanh toán': 7, 'Đã hủy': 1 },
  { date: '27/01', 'Thành công': 19, 'Chờ thanh toán': 4, 'Đã hủy': 3 },
  { date: '28/01', 'Thành công': 25, 'Chờ thanh toán': 6, 'Đã hủy': 1 },
  { date: '29/01', 'Thành công': 21, 'Chờ thanh toán': 5, 'Đã hủy': 2 },
  { date: '30/01', 'Thành công': 23, 'Chờ thanh toán': 6, 'Đá hủy': 1 },
  { date: '31/01', 'Thành công': 20, 'Chờ thanh toán': 4, 'Đã hủy': 2 }
]

export const REVENUE_ORDERS = [
  { id: 'ORD0125', date: '25/01/2026', time: '10:30', customer: 'Nguyễn Văn A', product: 'Áo thun nam premium', quantity: 2, value: 498000, status: 'completed', staff: 'Trần Thị B' },
  { id: 'ORD0126', date: '25/01/2026', time: '14:15', customer: 'Lê Thị C', product: 'Quần jean slim fit', quantity: 1, value: 599000, status: 'completed', staff: 'Nguyễn Văn A' },
  { id: 'ORD0127', date: '26/01/2026', time: '09:20', customer: 'Phạm Văn D', product: 'Áo khoác hoodie', quantity: 1, value: 799000, status: 'completed', staff: 'Lê Văn C' },
  { id: 'ORD0128', date: '26/01/2026', time: '11:45', customer: 'Trần Thị E', product: 'Giày da nam', quantity: 1, value: 1299000, status: 'pending', staff: 'Trần Thị B' },
  { id: 'ORD0129', date: '27/01/2026', time: '15:30', customer: 'Hoàng Văn F', product: 'Áo thun nữ cao cấp', quantity: 3, value: 687000, status: 'completed', staff: 'Nguyễn Văn A' },
  { id: 'ORD0130', date: '28/01/2026', time: '08:50', customer: 'Vũ Thị G', product: 'Quần jean slim fit', quantity: 2, value: 1198000, status: 'completed', staff: 'Lê Văn C' },
  { id: 'ORD0131', date: '28/01/2026', time: '16:20', customer: 'Đỗ Văn H', product: 'Áo khoác hoodie', quantity: 1, value: 799000, status: 'pending', staff: 'Trần Thị B' },
  { id: 'ORD0132', date: '29/01/2026', time: '10:10', customer: 'Bùi Thị I', product: 'Giày da nam', quantity: 1, value: 1299000, status: 'completed', staff: 'Nguyễn Văn A' },
  { id: 'ORD0133', date: '29/01/2026', time: '13:40', customer: 'Ngô Văn K', product: 'Áo thun nam premium', quantity: 4, value: 996000, status: 'completed', staff: 'Lê Văn C' },
  { id: 'ORD0134', date: '30/01/2026', time: '11:25', customer: 'Đinh Thị L', product: 'Áo thun nữ cao cấp', quantity: 2, value: 458000, status: 'completed', staff: 'Trần Thị B' },
  { id: 'ORD0135', date: '31/01/2026', time: '14:55', customer: 'Lý Văn M', product: 'Quần jean slim fit', quantity: 1, value: 599000, status: 'pending', staff: 'Nguyễn Văn A' },
  { id: 'ORD0136', date: '31/01/2026', time: '09:30', customer: 'Mai Thị N', product: 'Giày da nam', quantity: 2, value: 2598000, status: 'completed', staff: 'Lê Văn C' }
]

export const REVENUE_OVER_TIME = [
  { date: '25/01', revenue: 1097000, orders: 2, avgOrder: 548500 },
  { date: '26/01', revenue: 2098000, orders: 2, avgOrder: 1049000 },
  { date: '27/01', revenue: 687000, orders: 1, avgOrder: 687000 },
  { date: '28/01', revenue: 1997000, orders: 2, avgOrder: 998500 },
  { date: '29/01', revenue: 2295000, orders: 2, avgOrder: 1147500 },
  { date: '30/01', revenue: 458000, orders: 1, avgOrder: 458000 },
  { date: '31/01', revenue: 3197000, orders: 2, avgOrder: 1598500 }
]

