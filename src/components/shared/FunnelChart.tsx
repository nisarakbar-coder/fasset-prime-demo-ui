import { Funnel, FunnelChart as RechartsFunnelChart, LabelList, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FunnelData {
  name: string
  value: number
  fill?: string
}

interface FunnelChartProps {
  data: FunnelData[]
  title?: string
  className?: string
}

export function FunnelChart({ data, title = 'Conversion Funnel', className }: FunnelChartProps) {
  const colors = [
    '#8884d8',
    '#82ca9d', 
    '#ffc658',
    '#ff7300',
    '#8dd1e1',
    '#d084d0'
  ]

  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: item.fill || colors[index % colors.length]
  }))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsFunnelChart>
            <Tooltip 
              formatter={(value: number, name: string) => [
                value.toLocaleString(), 
                name
              ]}
            />
            <Funnel
              dataKey="value"
              data={dataWithColors}
              isAnimationActive
            >
              <LabelList 
                position="center" 
                fill="#fff" 
                stroke="none" 
                fontSize={12}
                formatter={(value: number) => value.toLocaleString()}
              />
            </Funnel>
          </RechartsFunnelChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
