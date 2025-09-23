import db from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserWithProps } from "@/types/interface";

export const useUser = async (): Promise<{
  user: UserWithProps | null;
  userId: string | null;
  authToken: string | null;
  error?: string;
}> => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("Authorization");

  if (!authToken) {
    return {
      user: null,
      userId: null,
      authToken: null,
      error: "Authorization token is missing",
    };
  }

  try {
    const token = authToken.value;

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      exp: number;
    };

    const userId = decodedToken.sub;

    // Fetch user from database
    const user = await db.user.findFirst({
      where: { id: userId },
      include: {
        address: true,
        orders: true,
        notifications: true,
        conversation: true,
      },
    });

    if (!user) {
      return { user: null, userId, authToken: token, error: "User not found" };
    }

    return { user, userId, authToken: token };
  } catch (error) {
    console.error(error);
    return {
      user: null,
      userId: null,
      authToken: null,
      error: "Invalid or expired token",
    };
  }
};
