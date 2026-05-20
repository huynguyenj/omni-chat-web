import { useEffect, useMemo, useState } from 'react'
import {
  BadgeDollarSign,
  CircleDollarSign,
  Clock3,
  Search,
  SlidersHorizontal,
  Wallet,
  X
} from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { ManagerWalletApi } from '../../api/wallet-api'
import type { ManagerCustomerWalletItem, ManagerWalletInfo, ManagerWalletTransaction } from '../../types/wallet-type'

const WALLET_PAGE_SIZE = 6

function normalizeTransaction(raw: unknown): ManagerWalletTransaction {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    id: String(item.id ?? ''),
    amount: Number(item.amount ?? 0),
    createDate: String(item.createDate ?? ''),
    transactionType: String(item.transactionType ?? '')
  }
}

function normalizeWalletInfo(raw: unknown): ManagerWalletInfo {
  const walletRaw = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const txsRaw = Array.isArray(walletRaw.transactions) ? walletRaw.transactions : []
  return {
    amount: Number(walletRaw.amount ?? 0),
    totalDebt: Number(walletRaw.totalDebt ?? 0),
    netAmount: Number(walletRaw.netAmount ?? 0),
    transactions: txsRaw.map((tx) => normalizeTransaction(tx))
  }
}

function normalizeCustomerWallet(raw: unknown): ManagerCustomerWalletItem {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const walletRaw = item.getWalletResponse && typeof item.getWalletResponse === 'object'
    ? item.getWalletResponse
    : {}

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
    getWalletResponse: normalizeWalletInfo(walletRaw)
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
  if (key === 'deposit') return 'Nạp tiền vào ví'
  if (key === 'credit') return 'Hoàn tiền lại ví'
  if (key === 'debit') return 'Ghi nợ'
  return type || 'Khác'
}

function WalletTransactionModal({
  open,
  customer,
  wallet,
  loading,
  error,
  onClose
}: {
  open: boolean
  customer: ManagerCustomerWalletItem | null
  wallet: ManagerWalletInfo | null
  loading: boolean
  error: string | null
  onClose: () => void
}) {
  if (!open || !customer) return null
  const txs = wallet?.transactions ?? []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-lg"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4">
          <h3 className="pr-2 text-lg font-semibold text-[#003366]">Lịch sử giao dịch — {customer.customerName}</h3>
          <Button type="button" variant="outline" size="sm" className="h-9 w-9 shrink-0 p-0" onClick={onClose} aria-label="Đóng">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-5">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-gray-500">Đang tải lịch sử giao dịch...</p>
          ) : wallet ? (
            <>
              <div className="mb-4 grid grid-cols-1 gap-2 rounded-lg border border-gray-100 bg-gray-50/80 p-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-gray-500">Số dư ví</p>
                  <p className="font-bold tabular-nums text-[#003366]">{formatMoney(wallet.amount)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tổng nợ</p>
                  <p className="font-bold tabular-nums text-[#dc2626]">{formatMoney(wallet.totalDebt)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Đã thanh toán</p>
                  <p
                    className={`font-bold tabular-nums ${
                      wallet.netAmount >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'
                    }`}
                  >
                    {formatMoney(wallet.netAmount)}
                  </p>
                </div>
              </div>

              {txs.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có giao dịch.</p>
              ) : (
                <div className="space-y-3">
                  {txs.map(tx => (
                    <div key={tx.id} className="rounded-lg border border-gray-100 bg-gray-50/80 p-3 text-sm">
                      <p className="font-medium text-[#003366]">{transactionTypeLabel(tx.transactionType)}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-gray-500">
                        <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {formatDateTime(tx.createDate)}
                      </p>
                      <p className="mt-1 font-semibold text-[#16a34a]">{formatMoney(tx.amount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : !error ? (
            <p className="text-sm text-gray-500">Không có dữ liệu ví.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function customerInitial(name: string) {
  const t = name.trim()
  if (!t) return '?'
  return t.charAt(0).toUpperCase()
}

export default function WalletTab() {
  const [walletPage, setWalletPage] = useState(1)
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletError, setWalletError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [allCustomers, setAllCustomers] = useState<ManagerCustomerWalletItem[]>([])
  const [historyCustomer, setHistoryCustomer] = useState<ManagerCustomerWalletItem | null>(null)
  const [historyWallet, setHistoryWallet] = useState<ManagerWalletInfo | null>(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const openTransactionHistory = async (customer: ManagerCustomerWalletItem) => {
    setHistoryCustomer(customer)
    setHistoryWallet(null)
    setHistoryError(null)
    setHistoryLoading(true)
    try {
      const body = await ManagerWalletApi.getWalletByCustomerId(customer.id)
      if (body.is_success === false || body.data == null) {
        throw new Error(body.message || 'Không thể tải lịch sử giao dịch.')
      }
      setHistoryWallet(normalizeWalletInfo(body.data))
    } catch {
      setHistoryError('Không thể tải lịch sử giao dịch.')
    } finally {
      setHistoryLoading(false)
    }
  }

  const closeTransactionHistory = () => {
    setHistoryCustomer(null)
    setHistoryWallet(null)
    setHistoryError(null)
    setHistoryLoading(false)
  }

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
    <div className="space-y-4 rounded-xl bg-[#F8F9FA] p-3 md:p-4">
      <Card className="border border-gray-200/90 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#003366]">Ví khách hàng</h2>
          <p className="mt-1 text-sm text-gray-500">Quản lý ví và công nợ khách hàng</p>
        </div>

        {walletError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {walletError}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-5">
            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-sky-900/70">Tổng ví</p>
              <p className="text-2xl font-bold tabular-nums text-[#003366] sm:text-3xl">{formatMoney(totalWalletAmount)}</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#3366CC] shadow-sm">
              <Wallet className="h-7 w-7" aria-hidden />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-5">
            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-rose-900/70">Tổng công nợ</p>
              <p className="text-2xl font-bold tabular-nums text-[#dc2626] sm:text-3xl">{formatMoney(totalDebtAmount)}</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
              <BadgeDollarSign className="h-7 w-7" aria-hidden />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-900/70">Đã thanh toán</p>
              <p
                className={`text-2xl font-bold tabular-nums sm:text-3xl ${
                  totalNetAmount >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'
                }`}
              >
                {formatMoney(totalNetAmount)}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <CircleDollarSign className="h-7 w-7" aria-hidden />
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo tên, email, SĐT hoặc ID..."
              className="h-11 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-[#003366] outline-none transition-colors placeholder:text-gray-400 focus:border-[#3366CC] focus:ring-2 focus:ring-[#3366CC]/15"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={walletLoading}
            className="h-11 shrink-0 rounded-2xl border-gray-200 px-5 text-[#003366] hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Lọc
          </Button>
        </div>

        {walletLoading && (
          <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50/80 px-3 py-2.5 text-sm text-blue-800">
            Đang tải danh sách ví khách hàng...
          </div>
        )}

        <div className="space-y-4">
          {!walletLoading && pagedCustomers.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-3 py-12 text-center text-sm text-gray-600">
              Chưa có dữ liệu ví khách hàng.
            </div>
          )}

          {pagedCustomers.map(customer => (
            <Card
              key={customer.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
                <div className="flex w-full shrink-0 gap-4 lg:w-80">
                  {customer.avatarUrl ? (
                    <img
                      src={customer.avatarUrl}
                      alt={customer.customerName}
                      className="h-14 w-14 shrink-0 rounded-full border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-base font-bold text-[#3366CC]">
                      {customerInitial(customer.customerName)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p
                      className="line-clamp-2 text-lg font-bold leading-tight text-[#003366] break-words"
                      title={customer.customerName}
                    >
                      {customer.customerName}
                    </p>
                    <p className="mt-1 truncate text-sm text-gray-500" title={customer.email ?? undefined}>
                      {customer.email || '—'}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-gray-500">{customer.phoneNumber || '—'}</p>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] px-4 py-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Hoạt động khác</p>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Tổng đơn: </span>
                        <span className="font-bold text-[#003366] tabular-nums">
                          {customer.totalOrder.toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Tổng thanh toán: </span>
                        <span className="font-bold tabular-nums text-[#003366]">{formatMoney(customer.totalPayment)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-stretch justify-center border-t border-gray-100 pt-4 lg:w-52 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <Button
                    type="button"
                    className="h-11 w-full rounded-xl border border-[#BFD8FF] bg-[#EAF3FF] font-semibold text-[#1E5BB8] hover:bg-[#DCEBFF]"
                    onClick={() => void openTransactionHistory(customer)}
                    disabled={historyLoading && historyCustomer?.id === customer.id}
                  >
                      Lịch sử giao dịch
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-center text-sm font-medium text-gray-600">
            Trang {walletPage} / {totalPages}
          </p>
          <PaginationBar currentPage={walletPage} setPage={setWalletPage} totalPage={totalPages} />
        </div>
      </Card>

      <WalletTransactionModal
        open={historyCustomer != null}
        customer={historyCustomer}
        wallet={historyWallet}
        loading={historyLoading}
        error={historyError}
        onClose={closeTransactionHistory}
      />
    </div>
  )
}
