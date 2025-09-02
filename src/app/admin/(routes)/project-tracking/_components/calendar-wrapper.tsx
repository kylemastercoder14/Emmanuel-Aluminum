"use client";

import React, { useState } from "react";
import { Task } from "@prisma/client";
import { Modal } from "@/components/globals/modal";
import ViewTask from "./view-task-modal";
import TaskForm from "@/components/forms/task";
import { formatDateTimeLocal } from "@/lib/utils";
import { deleteTask } from "@/actions/task";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ClientCalendar from "./client-calendar";
import { registerLicense } from "@syncfusion/ej2-base";

// Register Syncfusion license once here
registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY!);

const CalendarWrapper = ({ tasks }: { tasks: Task[] }) => {
  const router = useRouter();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDelete = async (taskId: string) => {
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
            onEdit={() => {
              setViewModalOpen(false);
              setFormModalOpen(true);
            }}
            onDelete={() => {
              setViewModalOpen(false);
              handleDelete(selectedTask.id);
            }}
          />
        ) : (
          <div>No task selected</div>
        )}
      </Modal>

      {/* Create / Update Form Modal */}
      <Modal
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
        />
      </Modal>

      {/* Calendar */}
      <ClientCalendar
        tasks={tasks}
        onTaskClick={(task) => {
          setSelectedTask(task);
          setViewModalOpen(true);
        }}
        onDateClick={(date) => {
          setSelectedDate(date);
          setFormModalOpen(true);
        }}
      />
    </>
  );
};

export default CalendarWrapper;
