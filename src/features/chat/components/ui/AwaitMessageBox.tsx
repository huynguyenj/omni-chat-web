import AvatarSample from '@/assets/avatar-sample.jpg'
import { formatTime } from '@/utils/date-resolver'
import { truncateText } from '@/utils/text-resolver'
type AwaitMessageBoxType = {
  customerName: string
  time: string
  avatar?: string
  message: string
  platform: string
  totalAwaitMessage: number
}

export default function AwaitMessageBox({ customerName, message, time, platform, avatar, totalAwaitMessage }: AwaitMessageBoxType) {
  return (
    <div className='px-5 py-5 flex gap-3'>
      <img src={avatar ? avatar : AvatarSample} alt="avatar" className='w-15 h-15 rounded-full' />
      <div className='w-full'>
        <div className='flex justify-between items-center'>
          <p className='text-sm-body-desktop'>{customerName}</p>
          <p className='text-[0.95rem] text-soft-gray'>{formatTime(time)}</p>
        </div>
        <p className='text-[0.95rem] text-gray-400 mt-1'>{truncateText(message, 30)}</p>
        <div className='flex items-center gap-2'>
          <div className='w-fit rounded-lg border border-light-secondary text-light-secondary font-bold text-[0.85rem] px-2 py-0.5'>
            {platform}
          </div>
          <div>
            { totalAwaitMessage > 0 &&
            <div className='w-fit bg-green-accent rounded-[10px] px-3 py-0.5 text-white text-[0.85rem]'>
              {totalAwaitMessage}
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
