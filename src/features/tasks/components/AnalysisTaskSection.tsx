import Card from '@/components/ui/card/Card'
import TaskAnalysisBox from './ui/TaskAnalysisBox'
import { LuCircleCheckBig } from 'react-icons/lu'
import { HiOutlineArrowTrendingUp } from 'react-icons/hi2'
import { FiClock } from 'react-icons/fi'
import { FiAward } from 'react-icons/fi'
import useGetDashboardTask from '../hooks/useGetDashboardTask'
import StatisticCardSkeleton from '@/components/ui/skeleton/StatisticCardSkeleton'


export default function AnalysisTaskSection() {
  const { dashboardTask, loading } = useGetDashboardTask()
  return (
    <>
      { loading ?
        <StatisticCardSkeleton count={4}/>
        :
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-center w-full'>
            <Card className='flex items-center w-full gap-3 py-5 rounded-2xl border-2 border-border-primary'>
              <TaskAnalysisBox variant='default'>
                <LuCircleCheckBig className='size-6'/>
              </TaskAnalysisBox>
              <div className='text-sm/7'>
                <p className='text-sm-body-desktop text-soft-gray'>Tổng tasks</p>
                <p className='text-[1.6rem] font-bold'>{dashboardTask ? dashboardTask.totalDoneTask : 0}</p>
              </div>
            </Card>
            <Card className='flex items-center w-full gap-3 py-5 rounded-2xl border-2 border-border-primary'>
              <TaskAnalysisBox variant='success'>
                <HiOutlineArrowTrendingUp className='size-6'/>
              </TaskAnalysisBox>
              <div className='text-sm/7'>
                <p className='text-sm-body-desktop text-soft-gray'>Tạo đơn hàng</p>
                <p className='text-[1.6rem] font-bold'>{dashboardTask ? dashboardTask.totalCreateOrder : 0}</p>
              </div>
            </Card>
            <Card className='flex items-center w-full gap-3 py-5 rounded-2xl border-2 border-border-primary'>
              <TaskAnalysisBox variant='purple'>
                <FiClock className='size-6'/>
              </TaskAnalysisBox>
              <div className='text-sm/7'>
                <p className='text-sm-body-desktop text-soft-gray'>Thời gian TB</p>
                <p className='text-[1.6rem] font-bold'>{dashboardTask ? dashboardTask.afferageResolveTime : 0}p</p>
              </div>
            </Card>
            <Card className='flex items-center w-full gap-3 py-5 rounded-2xl border-2 border-border-primary'>
              <TaskAnalysisBox variant='yellow'>
                <FiAward className='size-6'/>
              </TaskAnalysisBox>
              <div className='text-sm/7'>
                <p className='text-sm-body-desktop text-soft-gray'>Hiệu suất</p>
                <p className='text-[1.6rem] font-bold'>{dashboardTask ? dashboardTask.staffPerformance : 0}%</p>
              </div>
            </Card>
          </div>
        </>
      }
    </>
  )
}
