import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

interface TimeSeriesData {
  date: string | Date
  value: number
  [key: string]: string | number | Date
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[]
  title?: string
  dataKey?: string
  color?: string
  className?: string
  formatValue?: (value: number) => string
}

export function TimeSeriesChart({ 
  data, 
  title = 'Time Series', 
  dataKey = 'value',
  color = '#8884d8',
  className,
  formatValue = (value) => value.toLocaleString()
}: TimeSeriesChartProps) {
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return format(d, 'MMM dd')
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatValue}
              fontSize={12}
            />
            <Tooltip 
              labelFormatter={(value) => formatDate(value)}
              formatter={(value: number) => [formatValue(value), dataKey]}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
