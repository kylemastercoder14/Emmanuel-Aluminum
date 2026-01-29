"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import TaskForm from "@/components/forms/task";
import { Modal } from "@/components/globals/modal";
import { Orders, User } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ScheduledOrder = Orders & { user: User };
type Customer = User;

/** Saturday = 6, Sunday = 0 */
const isWeekend = (date: Date = new Date()) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const CreateTaskModal = ({
  scheduledOrders,
  customers,
}: {
  scheduledOrders: ScheduledOrder[];
  customers: Customer[];
}) => {
  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const weekend = React.useMemo(() => isWeekend(), []);

  const button = (
    <Button
      variant="primary"
      onClick={() => !weekend && setFormModalOpen(true)}
      disabled={weekend}
      aria-disabled={weekend}
    >
      <PlusIcon className="size-4" />
      Add new task
    </Button>
  );

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
      {weekend ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>
              Adding new tasks is not allowed on Saturdays and Sundays.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button
      )}
    </>
  );
};

export default CreateTaskModal;
