import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import Cookies from "cookies";

export const getUserIdFromCookies = (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = new Cookies(req, res);
  let userId = cookies.get("userId");


  if (!userId) {
    userId = uuidv4();
    cookies.set("userId", userId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 ano
    });
  }

  return userId;
}