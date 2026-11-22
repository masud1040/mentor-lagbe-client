import { auth } from "@/lib/auth";
import { clientPromise } from "@/lib/mongoDb";

import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export async function GET(req: Request) {
  await clientPromise;
  return handler.GET(req);
}

export async function POST(req: Request) {
  await clientPromise;
  return handler.POST(req);
}