import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(30).optional(),
  username: z.string().min(3).max(30).optional(),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid registration details",
        issues: result.error.flatten(),
      },
      { status: 400 }
    );
  }

  const data = result.data;

  if (!data.email && !data.phone && !data.username) {
    return NextResponse.json(
      {
        error: "Provide an email, phone number, or username",
      },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        data.email ? { email: data.email.toLowerCase() } : { id: "none" },
        data.phone ? { phone: data.phone } : { id: "none" },
        data.username
          ? { username: data.username.toLowerCase() }
          : { id: "none" },
      ],
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with those details already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name || null,
      email: data.email ? data.email.toLowerCase() : null,
      phone: data.phone || null,
      username: data.username
        ? data.username.toLowerCase()
        : null,
      passwordHash,
      isVerified: true,
      promoOptIn: false,
      role: "USER",
      notificationPreference: {
        create: {},
      },
    },
  });

  return NextResponse.json(
    {
      id: user.id,
      message: "Account created",
    },
    { status: 201 }
  );
}