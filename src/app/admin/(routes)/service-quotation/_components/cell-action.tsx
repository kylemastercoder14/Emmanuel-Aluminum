"use client";

import React from "react";

import {
  EditIcon,
  MoreHorizontal,
  ArchiveIcon,
  CircleX,
  CircleCheck,
  RefreshCcw,
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
import { updateQuotationStatus } from "@/actions/user";
import { Quotation } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateServiceQuotationStatus } from '@/actions/service';

const CellAction = ({ data }: { data: Quotation }) => {
  const router = useRouter();
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [approveModalOpen, setApproveModalOpen] = React.useState(false);
  const [estimatedPrice, setEstimatedPrice] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [activeStatusOpen, setActiveStatusOpen] = React.useState(false);

  const onStatusActive = async () => {
    try {
      const response = await updateServiceQuotationStatus(
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
      toast.error("Failed to change service quotation status. 😥");
      console.error("Status change error:", error);
    } finally {
      setActiveStatusOpen(false);
    }
  };

  const onStatus = async () => {
    try {
      const nextStatus =
        data.status === "PENDING"
          ? "APPROVED"
          : data.status === "APPROVED"
            ? "REJECTED"
            : "PENDING";

      // If approving, require estimated price modal
      if (data.status === "PENDING" && nextStatus === "APPROVED") {
        setApproveModalOpen(true);
        return;
      }

      const response = await updateQuotationStatus(data.id, nextStatus);
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to change quotation status. 😥");
      console.error("Status change error:", error);
    } finally {
      setStatusOpen(false);
    }
  };

  const onApproveWithPrice = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!estimatedPrice) {
      toast.error("Please enter the estimated price.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await updateQuotationStatus(
        data.id,
        "APPROVED",
        undefined,
        estimatedPrice
      );
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      setApproveModalOpen(false);
      setEstimatedPrice("");
      router.refresh();
    } catch (error) {
      toast.error("Failed to approve quotation. 😥");
      console.error("Approve error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={activeStatusOpen}
        onClose={() => setActiveStatusOpen(false)}
        onConfirm={onStatusActive}
        title="Change Service Quotation Availability"
        description={`Are you sure you want to make this service quotation ${data.isActive ? "unavailable" : "available"}?`}
      />
      <AlertModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        onConfirm={onStatus}
        title="Change Quotation Status"
        description={`Are you sure you want to set this quotation to ${
          data.status === "PENDING"
            ? "APPROVED"
            : data.status === "APPROVED"
              ? "REJECTED"
              : "PENDING"
        }?`}
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
          <DropdownMenuItem
            onClick={() => router.push(`/admin/service-quotation/${data.id}`)}
          >
            <EditIcon className="size-4" />
            View Details
          </DropdownMenuItem>
          {data.status === "PENDING" && (
            <>
              <DropdownMenuItem onClick={onStatus}>
                <CircleCheck className="size-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusOpen(true)}>
                <CircleX className="size-4" />
                Reject
              </DropdownMenuItem>
            </>
          )}

          {data.status === "APPROVED" && (
            <DropdownMenuItem disabled>
              <CircleCheck className="size-4" />
              Approved
            </DropdownMenuItem>
          )}

          {data.status === "REJECTED" && (
            <DropdownMenuItem disabled>
              <CircleX className="size-4" />
              Rejected
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
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Quotation With Estimated Price</DialogTitle>
          </DialogHeader>
          <form onSubmit={onApproveWithPrice} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Estimated Price (₱)
              </label>
              <Input
                type="number"
                min="0"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                placeholder="Enter estimated price"
                required
                step="0.01"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setApproveModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                Approve and Send
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CellAction;
