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
import { ServiceWithMaterials } from "@/types/interface";
import { deleteService, updateServiceStatus } from "@/actions/service";

const CellAction = ({ data }: { data: ServiceWithMaterials }) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);

  const onDelete = async () => {
    try {
      const response = await deleteService(data.id);
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete service. 😥");
      console.error("Delete error:", error);
    } finally {
      setDeleteOpen(false);
    }
  };

  const onStatus = async () => {
    try {
      const response = await updateServiceStatus(data.id, !data.isAvailable);
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
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete Supplier"
        description="Are you sure you want to delete this service?"
      />
      <AlertModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        onConfirm={onStatus}
        title="Change Service Status"
        description={`Are you sure you want to make this service ${data.isAvailable ? "unavailable" : "available"}?`}
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
            onClick={() =>
              router.push(`/admin/service-listings/${data.id}`)
            }
          >
            <EditIcon className="size-4" />
            Edit
          </DropdownMenuItem>
          {data.isAvailable ? (
            <DropdownMenuItem onClick={() => setStatusOpen(true)}>
              <CircleX className="size-4" />
              Unavailable
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setStatusOpen(true)}>
              <CircleCheck className="size-4" />
              Available
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
