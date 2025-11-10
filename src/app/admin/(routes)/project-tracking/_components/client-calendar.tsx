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
} from "@syncfusion/ej2-react-schedule";
import { Task } from "@prisma/client";

const ClientCalendar = ({
  tasks,
  currentRole,
  onTaskClick,
  onDateClick,
}: {
  tasks: Task[];
  currentRole: string;
  onTaskClick: (task: Task) => void;
  onDateClick: (date: Date) => void;
}) => {
  const isAdmin = currentRole === "Admin";
  const isStaff = currentRole === "Staff";
  const isCustomerService = currentRole === "Customer Service";

  const events = tasks.map((task) => ({
    Id: task.id,
    Subject: task.subject,
    StartTime: task.startDate,
    EndTime: task.endDate,
    Status: task.status,
    Priority: task.priority,
    rawTask: task,
  }));

  const today = React.useMemo(() => new Date(), []);

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
