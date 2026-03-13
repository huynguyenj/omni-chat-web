import { RouterProvider } from 'react-router/dom'
import { router } from './router/router'
import { Slide, ToastContainer } from 'react-toastify'
import { BiSolidErrorAlt } from 'react-icons/bi'
import { BsFillInfoSquareFill } from 'react-icons/bs'
import { FaThumbsUp } from 'react-icons/fa'
import { MdOutlineWarning } from 'react-icons/md'

const contextClass = {
  success: 'bg-linear-to-r from-green-accent to-yellow-500',
  error: 'bg-linear-to-r from-[#fd5959] to-[#ffaaa5]',
  info: 'bg-linear-to-r from-[#8dc6ff] to-[#2e79ba]',
  warning: 'bg-linear-to-r from-[#f8da5b] to-[#ff9c6d]',
  default: 'bg-indigo-600',
  dark: 'bg-white-600 font-gray-300'
}

function App() {
  return (
    <>
      <ToastContainer
        toastClassName={(context) => contextClass[context?.type || 'default'] + ' relative w-fit flex item-center py-3 px-4 rounded-2xl cursor-pointer my-2'}
        icon= {({ type }) => {
          switch (type) {
          case 'success': return <FaThumbsUp className='text-[1.25rem]'/>
          case 'error': return <BiSolidErrorAlt className='text-[1.25rem]'/>
          case 'info': return <BsFillInfoSquareFill className='text-[1.25rem]'/>
          case 'warning': return <MdOutlineWarning className='text-[1.25rem]'/>
          default: return null
          }
        }}
        position='top-center'
        hideProgressBar
        autoClose={3000}
        transition={Slide}
        newestOnTop
        pauseOnHover={false}
        theme='colored'
        closeButton={false}
        closeOnClick
        stacked
      />
      <RouterProvider router={router}/>
    </>
  )
}

export default App
