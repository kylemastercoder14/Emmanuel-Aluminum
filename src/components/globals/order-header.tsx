import { FileText } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import db from "@/lib/db";

const OrderHeader = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId } = await useUser();
  const data = await db.orders.count({
    where: {
      userId: userId as string,
    },
  });
  return (
    <Link
      href="/order-history"
      className="text-white relative hover:text-gray-200 mt-0.5 font-medium transition-colors"
    >
      <FileText className="size-6" />
      <div className="absolute -top-1 -right-2 bg-red-600 flex items-center justify-center size-4 rounded-full font-bold text-[8px]">
        {data}
      </div>
    </Link>
  );
};

export default OrderHeader;
