import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();
    await db.notifications.updateMany({
      where: {
        isRead: false, // only unread ones
        userId: userId as string,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
