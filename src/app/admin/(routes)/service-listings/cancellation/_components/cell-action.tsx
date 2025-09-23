"use client";

import React from "react";

import { MoreHorizontal, ArchiveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/globals/alert-modal";
import { toast } from "sonner";
import { OrderWithOrderItems } from "@/types/interface";
import { deleteOrder } from "@/actions/order";

const CellAction = ({ data }: { data: OrderWithOrderItems }) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

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
  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete Service Request"
        description="Are you sure you want to delete this service request?"
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
