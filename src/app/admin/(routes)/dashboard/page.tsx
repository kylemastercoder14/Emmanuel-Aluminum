import React from "react";
import StatCard from "./_components/stat-card";
import { ServiceChart } from "./_components/service-chart";
import db from "@/lib/db";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { CustomerChart } from "./_components/customer-chart";

const Page = async () => {
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);
  const startOfLastMonth = startOfMonth(subMonths(now, 1));

  // 🧾 Fetch data
  const thisMonthOrders = await db.orders.findMany({
    where: {
      status: "Completed",
      createdAt: { gte: startOfThisMonth },
    },
  });

  const lastMonthOrders = await db.orders.findMany({
    where: {
      status: "Completed",
      createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
    },
  });

  // 💰 Revenue
  const totalRevenueThisMonth = thisMonthOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );
  const totalRevenueLastMonth = lastMonthOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  const revenueChange =
    totalRevenueLastMonth > 0
      ? ((totalRevenueThisMonth - totalRevenueLastMonth) /
          totalRevenueLastMonth) *
        100
      : 100;
  const revenueTrend = revenueChange >= 0 ? "up" : "down";

  // 👥 Customers
  const thisMonthCustomers = await db.user.count({
    where: { createdAt: { gte: startOfThisMonth } },
  });
  const lastMonthCustomers = await db.user.count({
    where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
  });

  const customerChange =
    lastMonthCustomers > 0
      ? ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
      : 100;
  const customerTrend = customerChange >= 0 ? "up" : "down";

  // 📦 Products (stock)
  const thisMonthProducts = await db.service.count({
    where: { createdAt: { gte: startOfThisMonth } },
  });
  const lastMonthProducts = await db.service.count({
    where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
  });

  const stockChange =
    lastMonthProducts > 0
      ? ((thisMonthProducts - lastMonthProducts) / lastMonthProducts) * 100
      : 0;
  const stockTrend = stockChange >= 0 ? "up" : "down";

  // 🏗 Projects
  const totalProjects = await db.orders.count();
  const lastMonthProjects = await db.orders.count({
    where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
  });
  const projectChange =
    lastMonthProjects > 0
      ? ((totalProjects - lastMonthProjects) / lastMonthProjects) * 100
      : 100;
  const projectTrend = projectChange >= 0 ? "up" : "down";

  // 🧠 Improved recommendations & descriptions
  const getRecommendation = (metric: string, change: number) => {
    switch (metric) {
      case "revenue":
        if (change > 15)
          return "Fantastic performance! Continue focusing on premium service packages.";
        if (change > 0)
          return "Good progress — consider targeted promotions to maintain momentum.";
        return "Revenue declined slightly — evaluate pricing and marketing strategy.";

      case "customers":
        if (change > 20)
          return "Excellent growth! Leverage word-of-mouth and referral programs.";
        if (change > 0)
          return "Customer base is growing — maintain consistent engagement online.";
        return "Customer activity dropped — consider offering loyalty rewards.";

      case "projects":
        if (change > 10)
          return "Strong project flow! Keep optimizing workflow and timelines.";
        if (change > 0)
          return "Project rate improved slightly — ensure resource balance.";
        return "Project count decreased — analyze causes and reallocate resources.";

      case "products":
        if (change < 0)
          return "Service listings are decreasing — restock high-demand services soon.";
        return "Service is stable — monitor slow-moving items to avoid overstock.";
    }
  };

  const getDescription = (metric: string, change: number) => {
    switch (metric) {
      case "revenue":
        return change >= 0
          ? "Revenue has shown a positive upward trend compared to last month."
          : "A slight decrease in revenue indicates possible seasonal demand changes vs last month.";
      case "customers":
        return change >= 0
          ? "New customer sign-ups and repeat visits are increasing steadily vs last month."
          : "Customer growth slowed down; engagement and advertising may need review.";
      case "projects":
        return change >= 0
          ? "Ongoing and completed projects indicate stable performance vs last month."
          : "Project volume slightly decreased this month — potential scheduling delays.";
      case "products":
        return change < 0
          ? "Service movement indicates increased sales of key products vs last month."
          : "Service remains balanced with moderate restocking activity vs last month.";
    }
  };

  const monthsToShow = 6;

  // 🧾 Generate monthly sales data for each service category
  const chartData = [];
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));
    const monthLabel = format(monthStart, "MMMM");

    // count orders by service type within this month
    const windowOrders = await db.orders.count({
      where: {
        orderItems: {
          some: {
            service: {
              category: "Window",
            },
          },
        },
        status: "Completed",
        createdAt: { gte: monthStart, lte: monthEnd },
      },
    });
    const doorOrders = await db.orders.count({
      where: {
        orderItems: {
          some: {
            service: {
              category: "Door",
            },
          },
        },
        status: "Completed",
        createdAt: { gte: monthStart, lte: monthEnd },
      },
    });
    const cabinetOrders = await db.orders.count({
      where: {
        orderItems: {
          some: {
            service: {
              category: "Cabinet",
            },
          },
        },
        status: "Completed",
        createdAt: { gte: monthStart, lte: monthEnd },
      },
    });
    const glassOrders = await db.orders.count({
      where: {
        orderItems: {
          some: {
            service: {
              category: "Tempered Glass",
            },
          },
        },
        status: "Completed",
        createdAt: { gte: monthStart, lte: monthEnd },
      },
    });

    chartData.push({
      month: monthLabel,
      window: windowOrders,
      door: doorOrders,
      cabinet: cabinetOrders,
      temperedGlass: glassOrders,
    });
  }

  const customerChartData = [];

  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));
    const monthLabel = format(monthStart, "MMMM");

    // 🆕 New customers = users created this month
    const newCustomers = await db.user.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    // 🔁 Repeating customers = users created before this month but placed orders this month
    const repeatingCustomers = await db.orders.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
        user: {
          createdAt: { lt: monthStart },
        },
      },
    });

    customerChartData.push({
      month: monthLabel,
      newCustomers,
      repeatingCustomers,
    });
  }

  return (
    <div>
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
        <StatCard
          title="Total Revenue"
          data={`₱${totalRevenueThisMonth.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          percentage={`${revenueChange.toFixed(1)}%`}
          trend={revenueTrend}
          recommendation={getRecommendation("revenue", revenueChange) ?? ""}
          description={getDescription("revenue", revenueChange) ?? ""}
        />

        <StatCard
          title="Products Stock"
          data={thisMonthProducts.toString()}
          percentage={`${stockChange.toFixed(1)}%`}
          trend={stockTrend}
          recommendation={getRecommendation("products", stockChange) ?? ""}
          description={getDescription("products", stockChange) ?? ""}
        />

        <StatCard
          title="Customers"
          data={thisMonthCustomers.toString()}
          percentage={`${customerChange.toFixed(1)}%`}
          trend={customerTrend}
          recommendation={getRecommendation("customers", customerChange) ?? ""}
          description={getDescription("customers", customerChange) ?? ""}
        />

        <StatCard
          title="Projects"
          data={totalProjects.toString()}
          percentage={`${projectChange.toFixed(1)}%`}
          trend={projectTrend}
          recommendation={getRecommendation("projects", projectChange) ?? ""}
          description={getDescription("projects", projectChange) ?? ""}
        />
      </div>

      <div className="mt-5">
        <ServiceChart data={chartData} />
      </div>
      <div className="mt-5">
        <CustomerChart data={customerChartData} />
      </div>
    </div>
  );
};

export default Page;
