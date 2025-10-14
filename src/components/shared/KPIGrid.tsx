import { StatCard } from './StatCard'
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, CheckCircle } from 'lucide-react'

interface KPIGridProps {
  className?: string
}

export function KPIGrid({ className }: KPIGridProps) {
  const kpis = [
    {
      title: 'Total Transaction Volume',
      value: 'AED 2.5M',
      change: { value: 12.5, type: 'increase' as const },
      icon: DollarSign,
      description: 'Last 30 days'
    },
    {
      title: 'Total Transactions',
      value: '1,247',
      change: { value: 8.2, type: 'increase' as const },
      icon: Users,
      description: 'Active transactions'
    },
    {
      title: 'Success Rate',
      value: '98.7%',
      change: { value: 2.1, type: 'increase' as const },
      icon: CheckCircle,
      description: 'Settlement success'
    },
    {
      title: 'Avg Settlement Time',
      value: '2.4h',
      change: { value: 15.3, type: 'decrease' as const },
      icon: Clock,
      description: 'Time to payout'
    }
  ]

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className || ''}`}>
      {kpis.map((kpi, index) => (
        <StatCard
          key={index}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          description={kpi.description}
        />
      ))}
    </div>
  )
}
