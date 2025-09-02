"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple line chart with 4 categories"

const chartData = [
  { month: "January", window: 186, door: 80, cabinet: 120, temperedGlass: 60 },
  { month: "February", window: 305, door: 200, cabinet: 150, temperedGlass: 90 },
  { month: "March", window: 237, door: 120, cabinet: 130, temperedGlass: 70 },
  { month: "April", window: 73, door: 190, cabinet: 100, temperedGlass: 110 },
  { month: "May", window: 209, door: 130, cabinet: 140, temperedGlass: 95 },
  { month: "June", window: 214, door: 140, cabinet: 160, temperedGlass: 100 },
]

const chartConfig = {
  window: {
    label: "Window",
    color: "var(--chart-1)",
  },
  door: {
    label: "Door",
    color: "var(--chart-2)",
  },
  cabinet: {
    label: "Cabinet",
    color: "var(--chart-3)",
  },
  temperedGlass: {
    label: "Tempered Glass",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function ServiceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="aspect-auto h-[400px] w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {/* 4 categories */}
            <Line
              dataKey="window"
              type="monotone"
              stroke="var(--color-window)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="door"
              type="monotone"
              stroke="var(--color-door)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="cabinet"
              type="monotone"
              stroke="var(--color-cabinet)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="temperedGlass"
              type="monotone"
              stroke="var(--color-temperedGlass)"
              strokeWidth={2}
              dot={false}
            />
			<ChartLegend className='mt-5' content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
