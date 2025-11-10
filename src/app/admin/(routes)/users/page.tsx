import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import StaffTable from "./_components/staff-table";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { staff } = await useAdmin();

  const users = await db.staff.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Staff"
          description="View and manage administrative staff for your system."
        />
        {staff?.role === "Admin" && (
          <Link href="/admin/users/create">
            <Button variant="primary">
              <PlusIcon className="size-4" />
              Add new user
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-5">
        <StaffTable data={users} currentRole={staff?.role ?? "Staff"} />
      </div>
    </div>
  );
};

export default Page;
