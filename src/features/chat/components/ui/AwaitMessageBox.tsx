import AvatarSample from '@/assets/avatar-sample.jpg'
type AwaitMessageBoxType = {
  customerName: string
  time: string
  avatar?: string
  message: string
  platform: 'messenger' | 'instagram'
}

export default function AwaitMessageBox({ customerName, message, time, platform, avatar }: AwaitMessageBoxType) {
  return (
    <div className='px-5 py-5 flex gap-3'>
      <img src={avatar ? avatar : AvatarSample} alt="avatar" className='w-15 h-15 rounded-full' />
      <div className='w-full'>
        <div className='flex justify-between items-center'>
          <p className='text-sm-body-desktop'>{customerName}</p>
          <p className='text-[0.95rem] text-gray-500'>{time}</p>
        </div>
        <p className='text-[0.95rem] text-gray-400 mt-1'>{message}</p>
        <div>
          <div className='w-fit rounded-lg border border-light-secondary text-light-secondary font-bold text-[0.85rem] px-2 py-0.5'>
            {platform}
          </div>
          <div>

          </div>
        </div>
      </div>
    </div>
  )
}
