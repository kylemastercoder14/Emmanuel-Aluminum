"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import TaskForm from "@/components/forms/task";
import { Modal } from "@/components/globals/modal";
import { Orders, User } from "@prisma/client";

type ScheduledOrder = Orders & { user: User };
type Customer = User;

const CreateTaskModal = ({
  scheduledOrders,
  customers,
}: {
  scheduledOrders: ScheduledOrder[];
  customers: Customer[];
}) => {
  const [formModalOpen, setFormModalOpen] = React.useState(false);
  return (
    <>
      <Modal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
        }}
        className='max-w-5xl!'
        title={"Create Task"}
      >
        <TaskForm
          initialData={null}
          onClose={() => {
            setFormModalOpen(false);
          }}
          scheduledOrders={scheduledOrders}
          customers={customers}
        />
      </Modal>
      <Button variant="primary" onClick={() => setFormModalOpen(true)}>
        <PlusIcon className="size-4" />
        Add new task
      </Button>
    </>
  );
};

export default CreateTaskModal;
