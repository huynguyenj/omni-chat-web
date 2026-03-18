import Card from '@/components/ui/card/Card'
import TaskAnalysisBox from './ui/TaskAnalysisBox'
import { LuCircleCheckBig } from 'react-icons/lu'
import { HiOutlineArrowTrendingUp } from 'react-icons/hi2'
import { FiClock } from 'react-icons/fi'
import { FiAward } from 'react-icons/fi'

type AnalysisTaskType = {
  totalTask: number
  totalOrder: number
  avgTime: number
  performRate: number
}

const analysisTask: AnalysisTaskType = {
  avgTime: 7.1,
  performRate: 95,
  totalOrder: 3,
  totalTask: 10
}

export default function AnalysisTaskSection() {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 items-center w-full'>
      <Card className='flex items-center w-full gap-3 py-5 rounded-2xl border-2 border-border-primary'>
        <TaskAnalysisBox variant='default'>
          <LuCircleCheckBig className='size-6'/>
        </TaskAnalysisBox>
        <div className='text-sm/7'>
          <p className='text-sm-body-desktop text-soft-gray'>Tổng tasks</p>
          <p className='text-[1.6rem] font-bold'>{analysisTask.totalTask}</p>
        </div>
      </Card>
      <Card className='flex items-center w-full gap-3 py-5 rounded-2xl border-2 border-border-primary'>
        <TaskAnalysisBox variant='success'>
          <HiOutlineArrowTrendingUp className='size-6'/>
        </TaskAnalysisBox>
        <div className='text-sm/7'>
          <p className='text-sm-body-desktop text-soft-gray'>Tạo đơn hàng</p>
          <p className='text-[1.6rem] font-bold'>{analysisTask.totalOrder}</p>
        </div>
      </Card>
      <Card className='flex items-center w-full gap-3 py-5 rounded-2xl border-2 border-border-primary'>
        <TaskAnalysisBox variant='purple'>
          <FiClock className='size-6'/>
        </TaskAnalysisBox>
        <div className='text-sm/7'>
          <p className='text-sm-body-desktop text-soft-gray'>Thời gian TB</p>
          <p className='text-[1.6rem] font-bold'>{analysisTask.avgTime}p</p>
        </div>
      </Card>
      <Card className='flex items-center w-full gap-3 py-5 rounded-2xl border-2 border-border-primary'>
        <TaskAnalysisBox variant='yellow'>
          <FiAward className='size-6'/>
        </TaskAnalysisBox>
        <div className='text-sm/7'>
          <p className='text-sm-body-desktop text-soft-gray'>Hiệu suất</p>
          <p className='text-[1.6rem] font-bold'>{analysisTask.performRate}%</p>
        </div>
      </Card>
    </div>
  )
}
