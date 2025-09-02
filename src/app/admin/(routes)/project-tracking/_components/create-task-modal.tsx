"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import TaskForm from "@/components/forms/task";
import { Modal } from "@/components/globals/modal";

const CreateTaskModal = () => {
  const [formModalOpen, setFormModalOpen] = React.useState(false);
  return (
    <>
      <Modal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
        }}
        title={"Create Task"}
      >
        <TaskForm
          initialData={null}
          onClose={() => {
            setFormModalOpen(false);
          }}
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
