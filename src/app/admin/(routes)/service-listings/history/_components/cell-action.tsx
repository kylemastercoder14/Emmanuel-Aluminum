"use client";

import React from "react";

import {
  EditIcon,
  MoreHorizontal,
  ArchiveIcon,
  CircleCheck,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/globals/alert-modal";
import { toast } from "sonner";
import { OrderWithOrderItems } from "@/types/interface";
import {
  completeOrderStatus,
  deleteOrder,
  scheduleService,
} from "@/actions/order";
import { Modal } from "@/components/globals/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const CellAction = ({ data }: { data: OrderWithOrderItems }) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [scheduledTime, setScheduledTime] = React.useState("");
  const [isScheduleLoading, setIsScheduleLoading] = React.useState(false);

  const onDelete = async () => {
    try {
      const response = await deleteOrder(data.id);
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete service request. 😥");
      console.error("Delete error:", error);
    } finally {
      setDeleteOpen(false);
    }
  };

  const onStatus = async () => {
    try {
      const response = await completeOrderStatus(data.id, "Completed");
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to change service status. 😥");
      console.error("Status change error:", error);
    } finally {
      setStatusOpen(false);
    }
  };

  const onSchedule = async () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please provide both date and time for scheduling.");
      return;
    }
    setIsScheduleLoading(true);
    try {
      const response = await scheduleService(
        data.id,
        scheduledDate,
        scheduledTime
      );
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to schedule service. 😥");
      console.error("Schedule error:", error);
    } finally {
      setScheduleOpen(false);
      setIsScheduleLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete Service Request"
        description="Are you sure you want to delete this service request?"
      />
      <AlertModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        onConfirm={onStatus}
        title="Complete Service Request"
        description={`Are you sure you want to complete this service request?`}
      />
      <Modal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule Service"
        description="Schedule the date and time for the service request."
      >
        <form onSubmit={onSchedule} className="space-y-4">
          <div className="space-y-2">
            <Label>Schedule Date</Label>
            <Input
              type="date"
              disabled={isScheduleLoading}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Schedule Time</Label>
            <Input
              type="time"
              disabled={isScheduleLoading}
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
          <div className="flex justify-end items-center gap-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setScheduleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isScheduleLoading}
              variant="default"
              onClick={onSchedule}
            >
              Schedule
            </Button>
          </div>
        </form>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/admin/service-listings/history/${data.id}`)
            }
          >
            <EditIcon className="size-4" />
            View Details
          </DropdownMenuItem>
          {data.status === "Pending" || data.status === "Cancelled" ? (
            <DropdownMenuItem onClick={() => setScheduleOpen(true)}>
              <Calendar className="size-4" />
              Schedule Service
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setStatusOpen(true)}>
              <CircleCheck className="size-4" />
              Complete Service
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <ArchiveIcon className="size-4 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
