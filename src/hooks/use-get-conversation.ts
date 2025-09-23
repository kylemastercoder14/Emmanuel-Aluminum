import db from "@/lib/db";

export const getConversationsForStaff = async (staffId: string) => {
  const staff = await db.staff.findUnique({
    where: { id: staffId },
    include: {
      conversation: {
        include: {
          user: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  // If staff has conversations → return them
  if (staff?.conversation?.length) return staff.conversation;

  // Otherwise → show all conversations of users
  const allConversations = await db.conversation.findMany({
    include: {
      user: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return allConversations;
};
