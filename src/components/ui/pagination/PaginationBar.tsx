import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import Button from '../button/Button'

type PaginationBarProps = {
   totalPage: number
   currentPage: number
   setPage: (page: number) => void
}

export default function PaginationBar({ currentPage, totalPage, setPage }: PaginationBarProps) {
  const pages = Array.from({ length: totalPage }, (_, i) => ({
    page: i + 1,
    isActive: i + 1 === currentPage,
    label: String(i + 1)
  }))
  const listPages = () => {
    if (totalPage - currentPage < 5) {
      return pages.slice(totalPage - 5, totalPage)
    } else {
      return pages.slice(currentPage - 1, 5 + currentPage - 1)
    }
  }

  const handleGoToFirstPage = () => {
    setPage(1)
  }

  const handleGoToFinalPage = () => {
    setPage(totalPage)
  }

  const handleGoToNextPage = () => {
    if (currentPage + 1 <= totalPage) setPage(currentPage + 1)
  }

  const handleGoToPreviousPage = () => {
    if (currentPage - 1 > 0) setPage(currentPage - 1)
  }

  return (
    <div className='flex justify-center gap-10'>
      <div className='flex gap-2 items-center'>
        <Button variant={currentPage == 1 ? 'outline' : 'default'} className='w-10 h-10 rounded-full' onClick={handleGoToFirstPage}><MdKeyboardDoubleArrowLeft /></Button>
        <Button variant={currentPage == 1 ? 'outline' : 'default'} className='w-10 h-10 rounded-full' onClick={handleGoToPreviousPage}><MdKeyboardArrowLeft /></Button>
      </div>
      <div className='flex items-center'>
        <div className="w-full justify-center items-center">
          <div className="flex gap-5">
            { listPages().map((page, index) => (
              <p className={`text-sm-body-desktop ${currentPage === page.page && 'underline'}`} key={index}>{page.page}</p>
            )) }
          </div>
        </div>
      </div>
      <div className='flex gap-2 items-center'>
        <Button variant={currentPage == totalPage ? 'outline' : 'default'} className='w-10 h-10 rounded-full' onClick={handleGoToNextPage}><MdKeyboardArrowRight /></Button>
        <Button variant={currentPage == totalPage ? 'outline' : 'default'} className='w-10 h-10 rounded-full' onClick={handleGoToFinalPage}><MdKeyboardDoubleArrowRight /></Button>
      </div>
    </div>
  )
}
