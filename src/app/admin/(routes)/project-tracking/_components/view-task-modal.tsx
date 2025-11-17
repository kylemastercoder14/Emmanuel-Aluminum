"use client";

import { Orders, Task, User } from "@prisma/client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  IconArrowLeftRight,
  IconCalendarClock,
  IconCircleArrowDown,
  IconCircleArrowUp,
  IconFileText,
} from "@tabler/icons-react";

function formatDateTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

type TaskWithRelations = Task & { customer: User | null; order: Orders | null };

const ViewTask = ({
  data,
  onEdit,
  onDelete,
  currentRole,
}: {
  data: TaskWithRelations;
  onEdit: () => void;
  onDelete: () => void;
  currentRole: string;
}) => {
  const isAdmin = currentRole === "Admin";
  const isStaff = currentRole === "Staff";
  const isCustomerService = currentRole === "Customer Service";

  return (
    <div>
      <div className="bg-secondary border-l-4 mt-5 border-[#525252] px-3 py-2">
        <h3 className="text-black font-semibold text-lg">{data.subject}</h3>
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-2 mt-5">
        <IconCalendarClock className="size-4" />
        <span>
          {formatDateTime(data.startDate)} - {formatDateTime(data.endDate)}
        </span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mt-3">
        <IconFileText className="size-4" />
        <span>{data.status}</span>
      </div>

      {/* Customer */}
      {data.customer && (
        <div className="flex items-center gap-2 mt-3">
          <IconFileText className="size-4" />
          <span>
            Customer: <strong>{data.customer.name}</strong> ({data.customer.email})
          </span>
        </div>
      )}

      {/* Order */}
      {data.order && (
        <div className="flex items-center gap-2 mt-3">
          <IconFileText className="size-4" />
          <span>
            Order: <strong>{data.order.orderId}</strong> — ₱
            {data.order.totalAmount.toLocaleString()}
          </span>
        </div>
      )}

      {/* Priority */}
      <div className="flex items-center gap-2 mt-3">
        {data.priority === "Low" ? (
          <IconCircleArrowDown className="size-4" />
        ) : data.priority === "Medium" ? (
          <IconArrowLeftRight className="size-4" />
        ) : (
          <IconCircleArrowUp className="size-4" />
        )}
        <span>{data.priority}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-5">
        {(isAdmin || isStaff) && (
          <Button size="sm" variant="ghost" onClick={onEdit}>
            Edit
          </Button>
        )}

        {isAdmin && (
          <Button size="sm" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default ViewTask;
