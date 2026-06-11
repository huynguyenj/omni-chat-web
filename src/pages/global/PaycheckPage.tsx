import PaycheckMainContent from '@/features/customer-paycheck/components/PaycheckMainContent'

export default function PaycheckPage() {
  return (
    <div className=" w-full min-h-screen max-h-[120vh] flex items-center justify-center py-10 bg-[#F5F7FA] overflow-x-hidden">
      <div className="w-[85%] bg-white rounded-2xl px-5 py-4 h-fit">
        <h1 className="text-sm-title-desktop font-medium text-primary">Danh sách phiếu thanh toán</h1>
        <PaycheckMainContent/>
      </div>
    </div>
  )
}
