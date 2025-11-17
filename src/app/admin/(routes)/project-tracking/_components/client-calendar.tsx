/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Agenda,
  Day,
  Inject,
  Month,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Week,
  EventRenderedArgs,
} from "@syncfusion/ej2-react-schedule";
import { Orders, Task, User } from "@prisma/client";
type TaskWithRelations = Task & { customer: User | null; order: Orders | null };

const statusColorMap: Record<string, string> = {
  "Not Started": "#eab308", // yellow-500
  "In Progress": "#3b82f6", // blue-500
  Completed: "#22c55e", // green-500
};

const ClientCalendar = ({
  tasks,
  currentRole,
  onTaskClick,
  onDateClick,
}: {
  tasks: TaskWithRelations[];
  currentRole: string;
  onTaskClick: (task: TaskWithRelations) => void;
  onDateClick: (date: Date) => void;
}) => {
  const isAdmin = currentRole === "Admin";
  const isStaff = currentRole === "Staff";
  const isCustomerService = currentRole === "Customer Service";

  const events = tasks.map((task) => ({
    Id: task.id,
    Subject: task.subject,
    StartTime: new Date(task.startDate),
    EndTime: new Date(task.endDate),
    Status: task.status,
    Priority: task.priority,
    rawTask: task,
    CategoryColor: statusColorMap[task.status] ?? "#6b7280", // fallback gray-500
  }));

  const today = React.useMemo(() => new Date(), []);

  const onEventRendered = (args: EventRenderedArgs): void => {
    const status = (args.data as any).Status as string | undefined;
    const color = status ? statusColorMap[status] : undefined;

    if (color && args.element) {
      const el = args.element as HTMLElement;
      el.style.backgroundColor = color;
      el.style.borderColor = color;
      el.style.color = "#ffffff"; // ensure text is readable
    }
  };

  return (
    <div className="flex items-center justify-center">
      <ScheduleComponent
        timezone="Asia/Manila"
        eventSettings={{
          dataSource: events,
          allowAdding: isAdmin, // only admin can create
          allowEditing: isAdmin || isStaff, // admin & staff can edit
          allowDeleting: isAdmin, // only admin can delete
        }}
        eventRendered={onEventRendered}
        showQuickInfo={false}
        selectedDate={today}
        currentView="Month"
        height={900}
        eventClick={(args: any) => onTaskClick(args.event.rawTask)}
        cellClick={(args: any) => {
          if (isAdmin && args?.startTime) {
            onDateClick(args.startTime);
          }
        }}
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="Month" />
          <ViewDirective option="Agenda" />
        </ViewsDirective>
        <Inject services={[Day, Week, Month, Agenda]} />
      </ScheduleComponent>
    </div>
  );
};

export default ClientCalendar;
