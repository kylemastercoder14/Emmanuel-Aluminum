"use client";

import React from "react";

import {
  MoreHorizontal,
  Archive,
  RefreshCcw,
} from "lucide-react";

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
import { updateCustomerStatus } from "@/actions/user";
import { UserWithProps } from '@/types/interface';

const CellAction = ({ data }: { data: UserWithProps; }) => {
  const router = useRouter();
  const [statusOpen, setStatusOpen] = React.useState({
    toggle: false,
    isActive: data.isActive,
  });

  const onStatusChange = async () => {
    try {
      const response = await updateCustomerStatus(data.id, !statusOpen.isActive);
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
  return (
    <>
      <AlertModal
        isOpen={statusOpen.toggle}
        onClose={() => setStatusOpen({ ...statusOpen, toggle: false })}
        onConfirm={onStatusChange}
        title="Change User Status"
        description={`Are you sure you want to ${statusOpen.isActive ? "archive" : "retrive"} this user?`}
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
              setStatusOpen({ toggle: true, isActive: data.isActive })
            }
          >
            {data.isActive ? (
              <Archive className="size-4" />
            ) : (
              <RefreshCcw className="size-4" />
            )}
            {data.isActive ? "Archive" : "Retrieve"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
