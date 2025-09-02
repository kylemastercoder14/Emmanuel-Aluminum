"use client";

import { Task } from "@prisma/client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  IconArrowLeftRight,
  IconCalendarClock,
  IconCircleArrowDown,
  IconCircleArrowUp,
  IconFileText,
} from "@tabler/icons-react";

// Helper: format date + time
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

const ViewTask = ({
  data,
  onEdit,
  onDelete,
}: {
  data: Task;
  onEdit: () => void;
  onDelete: () => void;
}) => {
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
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onEdit}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ViewTask;
