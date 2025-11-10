"use client";

import React from "react";

import {
  EditIcon,
  MoreHorizontal,
  ArchiveIcon,
  CheckCircle,
  XCircle,
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
import { Staff } from "@prisma/client";
import { deleteUser, updateUserStatus } from "@/actions/user";

const CellAction = ({ data, currentRole }: { data: Staff; currentRole: string; }) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState({
    toggle: false,
    isActive: data.isActive,
  });

  const onDelete = async () => {
    try {
      const response = await deleteUser(data.id);
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete user. 😥");
      console.error("Delete error:", error);
    } finally {
      setDeleteOpen(false);
    }
  };

  const onStatusChange = async () => {
    try {
      const response = await updateUserStatus(data.id, !statusOpen.isActive);
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to change user status. 😥");
      console.error("Status change error:", error);
    } finally {
      setStatusOpen({ ...statusOpen, toggle: false });
    }
  };

  if(currentRole !== "Admin") return null;
  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete User"
        description="Are you sure you want to delete this user?"
      />
      <AlertModal
        isOpen={statusOpen.toggle}
        onClose={() => setStatusOpen({ ...statusOpen, toggle: false })}
        onConfirm={onStatusChange}
        title="Change User Status"
        description={`Are you sure you want to mark this user as ${statusOpen.isActive ? "inactive" : "active"}?`}
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
            onClick={() => router.push(`/admin/users/${data.id}`)}
          >
            <EditIcon className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setStatusOpen({ toggle: true, isActive: data.isActive })
            }
          >
            {data.isActive ? (
              <XCircle className="size-4" />
            ) : (
              <CheckCircle className="size-4" />
            )}
            Mark as {data.isActive ? "Inactive" : "Active"}
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
