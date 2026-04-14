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

export const MONTH_OPTIONS = [
  { value: '2026-01', label: 'Tháng 01/2026', shortLabel: 'T01/2026' },
  { value: '2026-02', label: 'Tháng 02/2026', shortLabel: 'T02/2026' },
  { value: '2026-03', label: 'Tháng 03/2026', shortLabel: 'T03/2026' }
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

export const MILK_CHART_COLORS = {
  'Có đường': '#3366CC',
  'Không đường': '#2ECC71',
  'Yogurt': '#FF9800'
}

export const MILK_QUANTITY_BY_MONTH = {
  '180ml': [
    { month: 'T01/26', 'Có đường': 45, 'Không đường': 38, Yogurt: 22 },
    { month: 'T02/26', 'Có đường': 52, 'Không đường': 43, Yogurt: 28 },
    { month: 'T03/26', 'Có đường': 48, 'Không đường': 40, Yogurt: 25 },
    { month: 'T04/26', 'Có đường': 61, 'Không đường': 50, Yogurt: 33 },
    { month: 'T05/26', 'Có đường': 57, 'Không đường': 47, Yogurt: 30 },
    { month: 'T06/26', 'Có đường': 65, 'Không đường': 54, Yogurt: 36 }
  ],
  '490ml': [
    { month: 'T01/26', 'Có đường': 62, 'Không đường': 55, Yogurt: 31 },
    { month: 'T02/26', 'Có đường': 71, 'Không đường': 63, Yogurt: 38 },
    { month: 'T03/26', 'Có đường': 68, 'Không đường': 59, Yogurt: 35 },
    { month: 'T04/26', 'Có đường': 80, 'Không đường': 70, Yogurt: 44 },
    { month: 'T05/26', 'Có đường': 75, 'Không đường': 66, Yogurt: 41 },
    { month: 'T06/26', 'Có đường': 88, 'Không đường': 78, Yogurt: 50 }
  ],
  '880ml': [
    { month: 'T01/26', 'Có đường': 48, 'Không đường': 42, Yogurt: 25 },
    { month: 'T02/26', 'Có đường': 55, 'Không đường': 48, Yogurt: 30 },
    { month: 'T03/26', 'Có đường': 51, 'Không đường': 45, Yogurt: 27 },
    { month: 'T04/26', 'Có đường': 63, 'Không đường': 56, Yogurt: 35 },
    { month: 'T05/26', 'Có đường': 59, 'Không đường': 52, Yogurt: 32 },
    { month: 'T06/26', 'Có đường': 70, 'Không đường': 61, Yogurt: 39 }
  ],
  '1760ml': [
    { month: 'T01/26', 'Có đường': 35, 'Không đường': 28, Yogurt: 18 },
    { month: 'T02/26', 'Có đường': 41, 'Không đường': 33, Yogurt: 22 },
    { month: 'T03/26', 'Có đường': 38, 'Không đường': 30, Yogurt: 20 },
    { month: 'T04/26', 'Có đường': 47, 'Không đường': 38, Yogurt: 26 },
    { month: 'T05/26', 'Có đường': 44, 'Không đường': 35, Yogurt: 24 },
    { month: 'T06/26', 'Có đường': 53, 'Không đường': 42, Yogurt: 30 }
  ]
}

export const SERVICE_STATS_BY_MONTH = {
  '2026-01': [
    { name: 'PRE_SALE', value: 150, color: '#3366CC' },
    { name: 'ORDER_CREATION', value: 185, color: '#2ECC71' },
    { name: 'ORDER_STATUS', value: 165, color: '#FF9800' },
    { name: 'POST_SALE', value: 95, color: '#9C27B0' },
    { name: 'PAYMENT', value: 160, color: '#F44336' }
  ],
  '2026-02': [
    { name: 'PRE_SALE', value: 165, color: '#3366CC' },
    { name: 'ORDER_CREATION', value: 205, color: '#2ECC71' },
    { name: 'ORDER_STATUS', value: 180, color: '#FF9800' },
    { name: 'POST_SALE', value: 105, color: '#9C27B0' },
    { name: 'PAYMENT', value: 175, color: '#F44336' }
  ],
  '2026-03': [
    { name: 'PRE_SALE', value: 182, color: '#3366CC' },
    { name: 'ORDER_CREATION', value: 225, color: '#2ECC71' },
    { name: 'ORDER_STATUS', value: 195, color: '#FF9800' },
    { name: 'POST_SALE', value: 115, color: '#9C27B0' },
    { name: 'PAYMENT', value: 192, color: '#F44336' }
  ]
}

export const ORDER_STATS_BY_MONTH = {
  '2026-01': {
    successful: 148,
    pending: 37,
    cancelled: 12,
    chartData: [
      { name: 'Thành công', value: 148, color: '#2ECC71' },
      { name: 'Chưa thanh toán', value: 37, color: '#FF9800' },
      { name: 'Bị hủy', value: 12, color: '#F44336' }
    ]
  },
  '2026-02': {
    successful: 165,
    pending: 42,
    cancelled: 15,
    chartData: [
      { name: 'Thành công', value: 165, color: '#2ECC71' },
      { name: 'Chưa thanh toán', value: 42, color: '#FF9800' },
      { name: 'Bị hủy', value: 15, color: '#F44336' }
    ]
  },
  '2026-03': {
    successful: 182,
    pending: 38,
    cancelled: 18,
    chartData: [
      { name: 'Thành công', value: 182, color: '#2ECC71' },
      { name: 'Chưa thanh toán', value: 38, color: '#FF9800' },
      { name: 'Bị hủy', value: 18, color: '#F44336' }
    ]
  }
}

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

export const REVENUE_BY_MONTH = {
  '2026-01': {
    totalRevenue: 11829000,
    pendingRevenue: 2697000,
    cancelledRevenue: 1850000,
    completedOrders: 9,
    pendingOrders: 3,
    cancelledOrders: 5,
    chartData: [
      { date: '01/01', revenue: 1200000 },
      { date: '03/01', revenue: 1450000 },
      { date: '05/01', revenue: 980000 },
      { date: '08/01', revenue: 1680000 },
      { date: '11/01', revenue: 1320000 },
      { date: '14/01', revenue: 1550000 },
      { date: '17/01', revenue: 890000 },
      { date: '20/01', revenue: 1759000 }
    ]
  },
  '2026-02': {
    totalRevenue: 14520000,
    pendingRevenue: 3180000,
    cancelledRevenue: 2100000,
    completedOrders: 11,
    pendingOrders: 4,
    cancelledOrders: 6,
    chartData: [
      { date: '02/02', revenue: 1580000 },
      { date: '04/02', revenue: 1720000 },
      { date: '07/02', revenue: 1200000 },
      { date: '10/02', revenue: 1890000 },
      { date: '13/02', revenue: 1650000 },
      { date: '16/02', revenue: 1980000 },
      { date: '19/02', revenue: 1320000 },
      { date: '22/02', revenue: 2180000 }
    ]
  },
  '2026-03': {
    totalRevenue: 16780000,
    pendingRevenue: 2890000,
    cancelledRevenue: 1650000,
    completedOrders: 13,
    pendingOrders: 3,
    cancelledOrders: 4,
    chartData: [
      { date: '01/03', revenue: 1980000 },
      { date: '04/03', revenue: 2150000 },
      { date: '07/03', revenue: 1680000 },
      { date: '10/03', revenue: 2280000 },
      { date: '13/03', revenue: 1890000 },
      { date: '16/03', revenue: 2100000 },
      { date: '19/03', revenue: 1450000 },
      { date: '22/03', revenue: 2250000 }
    ]
  }
}

