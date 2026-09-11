import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      size: z.string(),
      color: z.string(),
    })
  ),
  paymentMethod: z.enum(["CASH", "MPESA", "BANK", "PAYPAL"]),
  paymentCurrency: z.enum(["KES", "TZS", "UGX", "USD", "EUR", "GBP"]),
  shippingAddress: z.string().min(5),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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
      { error: "Invalid order details" },
      { status: 400 }
    );
  }

  const data = result.data;

  const order = await prisma.$transaction(async (tx) => {
    let total = 0;
    const orderItems = [];

    for (const item of data.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        throw new Error("Product unavailable");
      }

      const updated = await tx.product.updateMany({
        where: {
          id: product.id,
          isActive: true,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updated.count !== 1) {
        throw new Error(
          `${product.name} is sold out or has insufficient stock`
        );
      }

      const field =
        `price${data.paymentCurrency}` as keyof typeof product;

      const unitPrice = Number(
        product[field] || product.priceKES
      );

      total += unitPrice * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        unitPrice,
      });
    }

    return tx.order.create({
      data: {
        userId,
        status: "PAYMENT_PENDING",
        paymentMethod: data.paymentMethod,
        paymentCurrency: data.paymentCurrency,
        totalAmount: total,
        paymentStatus: "UNPAID",
        shippingAddress: data.shippingAddress,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "Login required" },
      { status: 401 }
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(orders);
}