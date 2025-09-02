import React from "react";
import Heading from "@/components/globals/heading";
import db from "@/lib/db";
import CalendarWrapper from "./_components/calendar-wrapper";
import CreateTaskModal from './_components/create-task-modal';

const Page = async () => {
  const tasks = await db.task.findMany();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Projects Tracking"
          description="Track and manage projects for your system."
        />
        <CreateTaskModal />
      </div>

      <div className="mt-5">
        <CalendarWrapper tasks={tasks} />
      </div>
    </div>
  );
};

export default Page;
