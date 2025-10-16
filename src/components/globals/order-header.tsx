import { FileText } from "lucide-react";
import React from "react";
import Link from "next/link";

const OrderHeader = ({orderCount}: {orderCount: number}) => {
  return (
    <Link
      href="/service-history"
      className="text-white flex items-center gap-2 relative hover:text-gray-200 mt-0.5 font-medium transition-colors"
    >
      <FileText className="size-6" />
      <span>Orders</span>
      <div className="absolute -top-1 -right-2 bg-red-600 flex items-center justify-center size-4 rounded-full font-bold text-[8px]">
        {orderCount}
      </div>
    </Link>
  );
};

export default OrderHeader;
