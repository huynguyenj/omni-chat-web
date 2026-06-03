// import Button from '@/components/ui/button/Button'
// import useAutoCreateOrder from '../../hooks/useAutoCreateOrder'
// import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'

// type AutoCreateOrderProps = {
//    message: string
// }

// export default function AutoCreateOrderButton({ message }: AutoCreateOrderProps) {
//   const { handleAutoOrder, loading } = useAutoCreateOrder()
//   return (
//     <>
//       <Button disabled={ loading } variant='outline' className='rounded-2xl py-2 border border-border-secondary hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={() => handleAutoOrder(message)}>
//         { loading ?
//           <LoadingSpinner/>
//           :
//           'Tự động tạo đơn'
//         }
//       </Button>
//     </>
//   )
// }
