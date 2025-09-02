"use client";

import React from "react";

import { EditIcon, MoreHorizontal, ArchiveIcon } from "lucide-react";

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
import { deleteSupplier } from "@/actions/supplier";
import { toast } from "sonner";
import { MaterialWithSupplier } from "@/types/interface";

const CellAction = ({ data }: { data: MaterialWithSupplier }) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const onDelete = async () => {
    try {
      const response = await deleteSupplier(data.id);
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete supplier. 😥");
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
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier?"
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
            onClick={() => router.push(`/admin/inventory/materials/${data.id}`)}
          >
            <EditIcon className="size-4" />
            Edit
          </DropdownMenuItem>
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
