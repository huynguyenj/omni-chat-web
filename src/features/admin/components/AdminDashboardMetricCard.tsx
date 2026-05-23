import Card from '@/components/ui/card/Card'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type AdminDashboardMetricCardProps = {
  accentColor: string
  iconBg: string
  iconColor: string
  valueColor: string
  Icon: LucideIcon
  topRightIcon?: LucideIcon
  topRightClassName?: string
  title: string
  value: ReactNode
  unit?: string
  footer: ReactNode
  className?: string
}

export default function AdminDashboardMetricCard({
  accentColor,
  iconBg,
  iconColor,
  valueColor,
  Icon,
  topRightIcon: TopRightIcon,
  topRightClassName,
  title,
  value,
  unit,
  footer,
  className
}: AdminDashboardMetricCardProps) {
  return (
    <Card
      className={`relative overflow-hidden border-0 bg-white p-0 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] ${className ?? ''}`}
    >
      <div className="absolute inset-y-0 left-0 w-1.5 rounded-l-[20px]" style={{ backgroundColor: accentColor }} aria-hidden />
      <div className="p-5 pl-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden />
          </div>
          {TopRightIcon ? (
            <TopRightIcon className={`h-5 w-5 shrink-0 opacity-70 ${topRightClassName ?? iconColor}`} aria-hidden />
          ) : null}
        </div>

        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#003366] sm:text-sm">{title}</h3>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
          <span className={`text-3xl font-bold leading-none sm:text-4xl ${valueColor}`}>{value}</span>
          {unit ? <span className={`text-3xl font-medium leading-none sm:text-4xl ${valueColor}`}>{unit}</span> : null}
        </div>

        <div className="my-3 border-b border-dotted border-gray-300" aria-hidden />

        <div className="text-xs leading-relaxed text-gray-500">{footer}</div>
      </div>
    </Card>
  )
}
