import React from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const StatCard = ({
  title,
  data,
  percentage,
  trend,
  recommendation,
  description,
}: {
  title: string;
  data: string;
  percentage: string;
  trend: "up" | "down" | "neutral";
  recommendation: string;
  description: string;
}) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {data}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {trend === "up" ? (
              <IconTrendingUp />
            ) : trend === "down" ? (
              <IconTrendingDown />
            ) : null}
            {percentage}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {description}{" "}
          {trend === "up" ? (
            <IconTrendingUp className="size-4" />
          ) : trend === "down" ? (
            <IconTrendingDown className="size-4" />
          ) : null}
        </div>
        <div className="text-muted-foreground">{recommendation}</div>
      </CardFooter>
    </Card>
  );
};

export default StatCard;
