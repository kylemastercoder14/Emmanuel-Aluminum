import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserIdFromToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("Authorization");

    if (!authToken) {
      return null;
    }

    const token = authToken.value;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      exp: number;
    };

    return decodedToken.sub;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

