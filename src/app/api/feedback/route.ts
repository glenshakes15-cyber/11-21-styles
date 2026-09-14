import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["COMPLAINT", "COMMENT", "SUGGESTION"]),
  message: z.string().min(2).max(5000),
  contact: z.string().max(150).optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "Login required" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid feedback" },
      { status: 400 }
    );
  }

  const feedback = await prisma.feedback.create({
    data: {
      userId,
      type: result.data.type,
      message: result.data.message,
      contact: result.data.contact || null,
      status: "OPEN",
    },
  });

  return NextResponse.json(feedback, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "Login required" },
      { status: 401 }
    );
  }

  const feedback = await prisma.feedback.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(feedback);
}