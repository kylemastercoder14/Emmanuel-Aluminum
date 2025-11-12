"use client";

import React from "react";

import { MoreHorizontal, ArchiveIcon, CircleCheck, RefreshCcw } from "lucide-react";

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
import { completeOrderStatus } from "@/actions/order";
import { updateServiceHistoryStatus } from "@/actions/service";

const CellAction = ({ data }: { data: OrderWithOrderItems }) => {
  const router = useRouter();
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [activeStatusOpen, setActiveStatusOpen] = React.useState(false);

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
  return (
    <>
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setStatusOpen(true)}>
            <CircleCheck className="size-4" />
            Complete Service
          </DropdownMenuItem>
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
