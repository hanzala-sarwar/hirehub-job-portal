import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function authenticateUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}
