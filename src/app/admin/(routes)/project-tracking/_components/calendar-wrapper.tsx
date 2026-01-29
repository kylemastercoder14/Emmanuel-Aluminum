"use client";

import React, { useState } from "react";
import { Orders, Task, User } from "@prisma/client";
import { Modal } from "@/components/globals/modal";
import ViewTask from "./view-task-modal";
import TaskForm from "@/components/forms/task";
import { formatDateTimeLocal } from "@/lib/utils";
import { deleteTask } from "@/actions/task";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ClientCalendar from "./client-calendar";

/** Saturday = 6, Sunday = 0 */
const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY!);

type ScheduledOrder = Orders & { user: User };
type Customer = User;
type TaskWithRelations = Task & { customer: User | null; order: Orders | null };

const CalendarWrapper = ({
  tasks,
  currentRole,
  scheduledOrders,
  customers,
}: {
  tasks: TaskWithRelations[];
  currentRole: string;
  scheduledOrders: ScheduledOrder[];
  customers: Customer[];
}) => {
  const router = useRouter();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isAdmin = currentRole === "Admin";
  const isStaff = currentRole === "Staff";
  const isCustomerService = currentRole === "Customer Service";

  const handleDelete = async (taskId: string) => {
    if (!isAdmin) return; // ❌ only admins can delete
    const res = await deleteTask(taskId);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success(res.success);
    setSelectedTask(null);
    router.refresh();
  };

  return (
    <>
      {/* View Task Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedTask(null);
        }}
      >
        {selectedTask ? (
          <ViewTask
            data={selectedTask}
            currentRole={currentRole}
            onEdit={() => {
              // Admin or Staff can edit
              if (!isAdmin && !isStaff) return;
              setViewModalOpen(false);
              setFormModalOpen(true);
            }}
            onDelete={() => {
              // Only Admin can delete
              if (!isAdmin) return;
              setViewModalOpen(false);
              handleDelete(selectedTask.id);
            }}
          />
        ) : (
          <div>No task selected</div>
        )}
      </Modal>

      {/* Create / Update Form Modal */}
      {(isAdmin || isStaff) && (
        <Modal
        className='max-w-5xl!'
          isOpen={formModalOpen}
          onClose={() => {
            setFormModalOpen(false);
            setSelectedDate(null);
            setSelectedTask(null);
          }}
          title={selectedTask ? "Update Task" : "Create Task"}
        >
          <TaskForm
            initialData={selectedTask}
            selectedDate={
              selectedDate ? formatDateTimeLocal(selectedDate) : null
            }
            onClose={() => {
              setFormModalOpen(false);
              setSelectedDate(null);
              setSelectedTask(null);
            }}
            scheduledOrders={scheduledOrders}
            customers={customers}
          />
        </Modal>
      )}

      {/* Calendar */}
      <ClientCalendar
        tasks={tasks}
        currentRole={currentRole}
        onTaskClick={(task) => {
          setSelectedTask(task);
          setViewModalOpen(true);
        }}
        onDateClick={(date) => {
          // Only Admin can create
          if (!isAdmin) return;
          if (isWeekend(date)) {
            toast.error(
              "Adding new tasks is not allowed on Saturdays and Sundays."
            );
            return;
          }
          setSelectedDate(date);
          setFormModalOpen(true);
        }}
      />
    </>
  );
};

export default CalendarWrapper;
