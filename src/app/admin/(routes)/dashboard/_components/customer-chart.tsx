"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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

const chartConfig = {
  newCustomers: {
    label: "New Customers",
    color: "var(--chart-1)",
  },
  repeatingCustomers: {
    label: "Repeating Customers",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface CustomerChartProps {
  data: {
    month: string;
    newCustomers: number;
    repeatingCustomers: number;
  }[];
}

export function CustomerChart({ data }: CustomerChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Growth Overview</CardTitle>
        <CardDescription>New vs Repeating Customers (Last 6 Months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-[400px] w-full aspect-auto mx-auto' config={chartConfig}>
          <AreaChart
            data={data}
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="newCustomers"
              type="natural"
              fill="var(--color-newCustomers)"
              fillOpacity={0.4}
              stroke="var(--color-newCustomers)"
              stackId="a"
            />
            <Area
              dataKey="repeatingCustomers"
              type="natural"
              fill="var(--color-repeatingCustomers)"
              fillOpacity={0.4}
              stroke="var(--color-repeatingCustomers)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
