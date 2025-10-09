/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple line chart showing service demand trends";

const chartConfig = {
  window: { label: "Window", color: "var(--chart-1)" },
  door: { label: "Door", color: "var(--chart-2)" },
  cabinet: { label: "Cabinet", color: "var(--chart-3)" },
  temperedGlass: { label: "Tempered Glass", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function ServiceChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Showing the overview of the top products for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="aspect-auto h-[400px] w-full" config={chartConfig}>
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Line dataKey="window" type="monotone" stroke="var(--color-window)" strokeWidth={2} dot={false} />
            <Line dataKey="door" type="monotone" stroke="var(--color-door)" strokeWidth={2} dot={false} />
            <Line dataKey="cabinet" type="monotone" stroke="var(--color-cabinet)" strokeWidth={2} dot={false} />
            <Line dataKey="temperedGlass" type="monotone" stroke="var(--color-temperedGlass)" strokeWidth={2} dot={false} />
            <ChartLegend className="mt-5" content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
