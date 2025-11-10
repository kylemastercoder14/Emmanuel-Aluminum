import React from "react";
import Heading from "@/components/globals/heading";
import db from "@/lib/db";
import CalendarWrapper from "./_components/calendar-wrapper";
import CreateTaskModal from './_components/create-task-modal';
import { useAdmin } from '@/hooks/use-admin';

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
    const { staff } = await useAdmin();
  const tasks = await db.task.findMany();

  return (
    <div>
      <div className="flex lg:mt-5 mt-20 items-center justify-between">
        <Heading
          title="Projects Tracking"
          description="Track and manage projects for your system."
        />
        {staff?.role === "Admin" && (
          <CreateTaskModal />
        )}
      </div>

      <div className="mt-5">
        <CalendarWrapper tasks={tasks} currentRole={staff?.role ?? "Staff"} />
      </div>
    </div>
  );
};

export default Page;
