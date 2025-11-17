import React from "react";
import Heading from "@/components/globals/heading";
import db from "@/lib/db";
import CalendarWrapper from "./_components/calendar-wrapper";
import CreateTaskModal from "./_components/create-task-modal";
import { useAdmin } from "@/hooks/use-admin";
import { Orders, Task, User } from "@prisma/client";

type ScheduledOrder = Orders & { user: User };
type Customer = User;
type TaskWithRelations = Task & { customer: User | null; order: Orders | null };

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { staff } = await useAdmin();

  const tasks: TaskWithRelations[] = await db.task.findMany({
    include: {
      customer: true,
      order: true,
    },
  });

  // All orders with status = "Scheduled" (for the per-customer order table)
  const scheduledOrders: ScheduledOrder[] = await db.orders.findMany({
    where: { status: "Scheduled" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  // All customers (e.g. all 41), regardless of whether they have scheduled orders
  const customers: Customer[] = await db.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex lg:mt-5 mt-20 items-center justify-between">
        <Heading
          title="Projects Tracking"
          description="Track and manage projects for your system."
        />
        {staff?.role === "Admin" && (
          <CreateTaskModal scheduledOrders={scheduledOrders} customers={customers} />
        )}
      </div>

      <div className="mt-5">
        <CalendarWrapper
          tasks={tasks}
          currentRole={staff?.role ?? "Staff"}
          scheduledOrders={scheduledOrders}
          customers={customers}
        />
      </div>
    </div>
  );
};

export default Page;
