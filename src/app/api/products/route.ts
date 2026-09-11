import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const productSchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().max(5000).optional(),
  type: z.string().min(1).max(80),
  sizes: z.string(),
  colors: z.string(),
  priceKES: z.number().positive(),
  priceTZS: z.number().positive().optional(),
  priceUGX: z.number().positive().optional(),
  priceUSD: z.number().positive().optional(),
  priceEUR: z.number().positive().optional(),
  priceGBP: z.number().positive().optional(),
  stock: z.number().int().nonnegative(),
  images: z.string(),
  isActive: z.boolean().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user?.role === "ADMIN" ? user : null;
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const result = productSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid product details" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: result.data,
  });

  return NextResponse.json(product, { status: 201 });
}