"use client";

import React from "react";

import {
  EditIcon,
  MoreHorizontal,
  ArchiveIcon,
  CircleX,
  CircleCheck,
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
import { deleteQuotation, updateQuotationStatus } from "@/actions/user";
import { Quotation } from "@prisma/client";

const CellAction = ({ data }: { data: Quotation }) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);

  const onDelete = async () => {
    try {
      const response = await deleteQuotation(data.id);
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete quotation. 😥");
      console.error("Delete error:", error);
    } finally {
      setDeleteOpen(false);
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

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete Quotation"
        description="Are you sure you want to delete this quotation?"
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
              <DropdownMenuItem onClick={() => setStatusOpen(true)}>
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
