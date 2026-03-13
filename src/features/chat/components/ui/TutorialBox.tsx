import { BsStars } from 'react-icons/bs'

type TutorialBoxType = {
  step: string
  description?: string
}
export default function TutorialBox({ step, description }: TutorialBoxType) {
  return (
    <div className='bg-[#F5F7FA] py-4 px-5 rounded-xl'>
      <div className='flex items-center gap-3 text-secondary font-bold text-sm/10 text-[1.15rem]'>
        <BsStars/>
        <p className=''>{step}</p>
      </div>
      {description &&
            <p className='text-soft-gray text-[1rem]'>{description}</p>
      }
    </div>
  )
}
