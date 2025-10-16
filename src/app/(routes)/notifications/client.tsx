"use client";

import { Notifications } from "@prisma/client";
import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const NotificationPage = ({
  notifications,
}: {
  notifications: Notifications[] | undefined;
}) => {
  const router = useRouter();

  // Mark notifications as read when page loads
  useEffect(() => {
    const markAsRead = async () => {
      try {
        await fetch("/api/notifications/read", { method: "POST" });
        router.refresh();
      } catch (error) {
        console.error("Failed to mark as read", error);
      }
    };
    setTimeout(markAsRead, 2000);
  }, [router]);

  if (!notifications || notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 sm:px-10 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
          Notifications
        </h1>
        <Separator className="my-4" />
        <p className="text-center sm:text-left">No notifications found</p>
      </div>
    );
  }

  // Group notifications by date
  const grouped = notifications.reduce(
    (acc, notif) => {
      const dateKey = format(new Date(notif.createdAt), "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(notif);
      return acc;
    },
    {} as Record<string, Notifications[]>
  );

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-10 py-30">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Notifications
      </h1>
      <Separator className="my-4" />

      <div className="mt-3 space-y-8">
        {sortedDates.map((dateKey) => {
          const items = grouped[dateKey];
          const isToday =
            format(new Date(dateKey), "yyyy-MM-dd") ===
            format(new Date(), "yyyy-MM-dd");

          return (
            <div key={dateKey}>
              <h2 className="text-base sm:text-lg font-semibold mb-3">
                {isToday ? "Today" : format(new Date(dateKey), "MMMM d")}
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`${
                      item.isRead ? "bg-white" : "bg-gray-100"
                    } p-3 sm:p-4 rounded-md shadow-sm`}
                  >
                    <p className="font-medium text-sm sm:text-base">
                      {item.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 mt-1">
                      {item.message}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPage;
