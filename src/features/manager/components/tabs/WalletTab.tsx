import { useEffect, useMemo, useState } from 'react'
import { BadgeDollarSign, CircleDollarSign, Clock3, Search, UserRound, Wallet } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { ManagerWalletApi } from '../../api/wallet-api'
import type { ManagerCustomerWalletItem, ManagerWalletTransaction } from '../../types/wallet-type'

const WALLET_PAGE_SIZE = 9

function normalizeTransaction(raw: unknown): ManagerWalletTransaction {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    id: String(item.id ?? ''),
    amount: Number(item.amount ?? 0),
    createDate: String(item.createDate ?? ''),
    transactionType: String(item.transactionType ?? '')
  }
}

function normalizeCustomerWallet(raw: unknown): ManagerCustomerWalletItem {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const walletRaw = item.getWalletResponse && typeof item.getWalletResponse === 'object'
    ? (item.getWalletResponse as Record<string, unknown>)
    : {}
  const txsRaw = Array.isArray(walletRaw.transactions) ? walletRaw.transactions : []

  return {
    id: String(item.id ?? ''),
    customerName: String(item.customerName ?? 'Khách hàng'),
    email: item.email == null ? null : String(item.email),
    phoneNumber: item.phoneNumber == null ? null : String(item.phoneNumber),
    avatarUrl: item.avatarUrl == null ? null : String(item.avatarUrl),
    zaloSenderId: item.zaloSenderId == null ? null : String(item.zaloSenderId),
    facebookSenderId: item.facebookSenderId == null ? null : String(item.facebookSenderId),
    instagramSenderId: item.instagramSenderId == null ? null : String(item.instagramSenderId),
    currentProviderName: item.currentProviderName == null ? null : String(item.currentProviderName),
    totalOrder: Number(item.totalOrder ?? 0),
    customerDate: String(item.customerDate ?? ''),
    totalPayment: Number(item.totalPayment ?? 0),
    getWalletResponse: {
      amount: Number(walletRaw.amount ?? 0),
      totalDebt: Number(walletRaw.totalDebt ?? 0),
      netAmount: Number(walletRaw.netAmount ?? 0),
      transactions: txsRaw.map((tx) => normalizeTransaction(tx))
    }
  }
}

function formatDateTime(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('vi-VN')
}

function formatMoney(amount: number) {
  return `${amount.toLocaleString('vi-VN')}đ`
}

function transactionTypeLabel(type: string) {
  const key = String(type).trim().toLowerCase()
  if (key === 'deposit') return 'Nạp tiền'
  if (key === 'credit') return 'Ghi có'
  if (key === 'debit') return 'Ghi nợ'
  return type || 'Khác'
}

export default function WalletTab() {
  const [walletPage, setWalletPage] = useState(1)
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletError, setWalletError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [allCustomers, setAllCustomers] = useState<ManagerCustomerWalletItem[]>([])

  useEffect(() => {
    const fetchAllCustomers = async () => {
      setWalletLoading(true)
      setWalletError(null)
      try {
        const merged: ManagerCustomerWalletItem[] = []
        let pageNumber = 1
        let totalPages = 1

        while (pageNumber <= totalPages) {
          const response = await ManagerWalletApi.getCustomerWalletPaging({
            pageNumber,
            pageSize: 100
          })
          const body = response
          if (body.is_success === false || body.data == null) {
            throw new Error(body.message || 'Không thể tải danh sách ví khách hàng.')
          }

          const items = Array.isArray(body.data.items)
            ? body.data.items.map((entry) => normalizeCustomerWallet(entry))
            : []
          merged.push(...items)
          totalPages = Math.max(1, Number(body.data.meta?.total_pages ?? 1))
          pageNumber += 1
        }

        const uniqueById = new Map<string, ManagerCustomerWalletItem>()
        for (const item of merged) uniqueById.set(item.id, item)
        setAllCustomers([...uniqueById.values()])
      } catch {
        setWalletError('Không thể tải danh sách ví khách hàng.')
        setAllCustomers([])
      } finally {
        setWalletLoading(false)
      }
    }

    void fetchAllCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()
    if (!keyword) return allCustomers
    return allCustomers.filter((customer) => {
      return (
        customer.customerName.toLowerCase().includes(keyword) ||
        customer.id.toLowerCase().includes(keyword) ||
        String(customer.email ?? '').toLowerCase().includes(keyword) ||
        String(customer.phoneNumber ?? '').toLowerCase().includes(keyword)
      )
    })
  }, [allCustomers, searchText])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredCustomers.length / WALLET_PAGE_SIZE)),
    [filteredCustomers]
  )

  useEffect(() => {
    setWalletPage(1)
  }, [searchText])

  useEffect(() => {
    if (walletPage > totalPages) setWalletPage(totalPages)
  }, [walletPage, totalPages])

  const pagedCustomers = useMemo(() => {
    const start = (walletPage - 1) * WALLET_PAGE_SIZE
    return filteredCustomers.slice(start, start + WALLET_PAGE_SIZE)
  }, [filteredCustomers, walletPage])

  const totalWalletAmount = useMemo(
    () => filteredCustomers.reduce((sum, customer) => sum + customer.getWalletResponse.amount, 0),
    [filteredCustomers]
  )

  const totalDebtAmount = useMemo(
    () => filteredCustomers.reduce((sum, customer) => sum + customer.getWalletResponse.totalDebt, 0),
    [filteredCustomers]
  )

  const totalNetAmount = useMemo(
    () => filteredCustomers.reduce((sum, customer) => sum + customer.getWalletResponse.netAmount, 0),
    [filteredCustomers]
  )

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-[#003366] text-2xl font-semibold">Wallet khách hàng</h2>
          <p className="text-sm text-gray-500 mt-1">Dữ liệu từ API customer profile paging</p>
        </div>

        {walletError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {walletError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <Card className="p-4 bg-gradient-to-br from-[#EAF3FF] to-[#DCEBFF] border-[#BFD8FF]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1 uppercase">Tổng ví</p>
                <p className="text-2xl font-bold text-[#003366]">{formatMoney(totalWalletAmount)}</p>
              </div>
              <Wallet className="h-8 w-8 text-[#3366CC]/70" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1 uppercase">Tổng công nợ</p>
                <p className="text-2xl font-bold text-[#dc2626]">{formatMoney(totalDebtAmount)}</p>
              </div>
              <BadgeDollarSign className="h-8 w-8 text-red-500/70" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1 uppercase">Số dư ròng</p>
                <p className={`text-2xl font-bold ${totalNetAmount >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                  {formatMoney(totalNetAmount)}
                </p>
              </div>
              <CircleDollarSign className="h-8 w-8 text-slate-500/70" />
            </div>
          </Card>
        </div>

        <div className="mb-5">
          <div className="relative w-full xl:max-w-xl">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo tên, email, số điện thoại hoặc customer id..."
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-[#003366] outline-none focus:border-[#3366CC]"
            />
          </div>
        </div>

        {walletLoading && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Đang tải danh sách ví khách hàng...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {!walletLoading && pagedCustomers.length === 0 && (
            <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-600">
              Chưa có dữ liệu ví khách hàng.
            </div>
          )}

          {pagedCustomers.map((customer) => (
            <Card key={customer.id} className="p-4 hover:shadow-md transition-shadow border-t-4 border-t-[#3366CC]">
              <div className="flex items-start gap-3 mb-3">
                {customer.avatarUrl ? (
                  <img src={customer.avatarUrl} alt={customer.customerName} className="h-12 w-12 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-[#EAF3FF] border border-[#BFD8FF] flex items-center justify-center">
                    <UserRound className="h-6 w-6 text-[#3366CC]" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-[#003366] line-clamp-1">{customer.customerName}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{customer.email || 'Không có email'}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{customer.phoneNumber || 'Không có số điện thoại'}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs mb-3">
                <p><span className="text-gray-500">Customer ID:</span> <span className="text-[#003366]">{customer.id}</span></p>
                <p><span className="text-gray-500">Provider:</span> <span className="text-[#003366]">{customer.currentProviderName || '—'}</span></p>
                <p><span className="text-gray-500">Facebook Sender:</span> <span className="text-[#003366]">{customer.facebookSenderId || '—'}</span></p>
                <p><span className="text-gray-500">Zalo Sender:</span> <span className="text-[#003366]">{customer.zaloSenderId || '—'}</span></p>
                <p><span className="text-gray-500">Instagram Sender:</span> <span className="text-[#003366]">{customer.instagramSenderId || '—'}</span></p>
                <p><span className="text-gray-500">Ngày tạo:</span> <span className="text-[#003366]">{formatDateTime(customer.customerDate)}</span></p>
                <p><span className="text-gray-500">Tổng đơn:</span> <span className="text-[#003366]">{customer.totalOrder.toLocaleString('vi-VN')}</span></p>
                <p><span className="text-gray-500">Tổng thanh toán:</span> <span className="text-[#16a34a] font-semibold">{formatMoney(customer.totalPayment)}</span></p>
              </div>

              <div className="rounded-lg bg-[#F8FAFC] border border-gray-100 p-3 mb-3">
                <p className="text-[11px] font-semibold text-[#003366] mb-2">Thông tin ví</p>
                <div className="space-y-1 text-xs">
                  <p className="flex justify-between"><span className="text-gray-500">Số dư ví</span><span className="font-semibold text-[#003366]">{formatMoney(customer.getWalletResponse.amount)}</span></p>
                  <p className="flex justify-between"><span className="text-gray-500">Tổng nợ</span><span className="font-semibold text-[#dc2626]">{formatMoney(customer.getWalletResponse.totalDebt)}</span></p>
                  <p className="flex justify-between"><span className="text-gray-500">Số dư ròng</span><span className={`font-semibold ${customer.getWalletResponse.netAmount >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>{formatMoney(customer.getWalletResponse.netAmount)}</span></p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-[#003366] mb-2">Giao dịch ({customer.getWalletResponse.transactions.length})</p>
                {customer.getWalletResponse.transactions.length === 0 ? (
                  <p className="text-xs text-gray-500">Chưa có giao dịch.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {customer.getWalletResponse.transactions.map((tx) => (
                      <div key={tx.id} className="rounded-md border border-gray-100 p-2 text-xs">
                        <p className="font-medium text-[#003366]">{transactionTypeLabel(tx.transactionType)}</p>
                        <p className="text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock3 className="h-3 w-3" />
                          {formatDateTime(tx.createDate)}
                        </p>
                        <p className="mt-1 font-semibold text-[#16a34a]">{formatMoney(tx.amount)}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{tx.id}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <PaginationBar
            currentPage={walletPage}
            setPage={setWalletPage}
            totalPage={totalPages}
          />
        </div>
      </Card>
    </div>
  )
}
