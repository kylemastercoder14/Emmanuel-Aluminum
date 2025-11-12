/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import {
  EditIcon,
  MoreHorizontal,
  ArchiveIcon,
  CircleCheck,
  Calendar,
  RefreshCcw,
  Wallet,
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
  scheduleService,
  verifyPayment,
} from "@/actions/order";
import { Modal } from "@/components/globals/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateServiceHistoryStatus } from "@/actions/service";

const CellAction = ({ data }: { data: OrderWithOrderItems }) => {
  const router = useRouter();
  const [activeStatusOpen, setActiveStatusOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [scheduledTime, setScheduledTime] = React.useState("");
  const [isScheduleLoading, setIsScheduleLoading] = React.useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [verifyAmount, setVerifyAmount] = React.useState<number>(0);
  const [isVerifying, setIsVerifying] = React.useState(false);

  const openVerifyModal = (payment: any) => {
    setSelectedPayment(payment);
    setVerifyAmount(0);
    setVerifyModalOpen(true);
  };

  const onVerifyPayment = async () => {
    if (!selectedPayment || verifyAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setIsVerifying(true);
    try {
      const response = await verifyPayment({
        paymentId: selectedPayment.id,
        amount: verifyAmount,
      });
      if (response.success) {
        toast.success(response.message);
        setVerifyModalOpen(false);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const onStatusActive = async () => {
    try {
      const response = await updateServiceHistoryStatus(
        data.id,
        !data.isActive
      );
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
      setActiveStatusOpen(false);
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
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="Verify Payment"
        description="View proof of payment and confirm amount received."
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {selectedPayment.attachments.map((url: string) => (
                <img
                  key={url}
                  src={url}
                  alt="Proof of payment"
                  className="w-full h-32 object-cover rounded border"
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label>Amount Received</Label>
              <Input
                type="number"
                value={verifyAmount}
                onChange={(e) => setVerifyAmount(parseFloat(e.target.value))}
                placeholder="Enter received amount"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setVerifyModalOpen(false)}
                disabled={isVerifying}
              >
                Cancel
              </Button>
              <Button onClick={onVerifyPayment} disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Confirm Payment"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <AlertModal
        isOpen={activeStatusOpen}
        onClose={() => setActiveStatusOpen(false)}
        onConfirm={onStatusActive}
        title="Change Service History Availability"
        description={`Are you sure you want to make this service history ${data.isActive ? "unavailable" : "available"}?`}
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
          <DropdownMenuItem onClick={() => openVerifyModal(data.payments[0])}>
            <Wallet className="size-4" />
            Verify Payment
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
          {data.isActive ? (
            <DropdownMenuItem onClick={() => setActiveStatusOpen(true)}>
              <ArchiveIcon className="size-4" />
              Archive
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setActiveStatusOpen(true)}>
              <RefreshCcw className="size-4" />
              Retrieve
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
