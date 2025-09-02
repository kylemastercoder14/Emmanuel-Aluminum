import db from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Since this is running in a server component, we should treat it as a utility, not a hook
export const useAdmin = async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("Authorization");

  if (!authToken) {
    return { error: "Authorization token is missing" };
  }

  try {
    const token = authToken.value;
    // Verify JWT token using the secret
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      exp: number;
    };

    const staffId = decodedToken.sub;

    // Fetch staff from database
    const staff = await db.staff.findFirst({
      where: {
        id: staffId,
      },
    });

    if (!staff) {
      return { error: "Staff not found" };
    }

    return { staff, staffId, authToken };
  } catch (error) {
    console.error(error);
    return { error: "Invalid or expired token" };
  }
};
