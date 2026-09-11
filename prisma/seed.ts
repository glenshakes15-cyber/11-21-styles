import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

  await prisma.user.upsert({
    where: {
      email: "admin@1121styles.com",
    },
    update: {},
    create: {
      email: "admin@1121styles.com",
      username: "admin",
      name: "11:21STYLES Admin",
      passwordHash,
      role: "ADMIN",
      isVerified: true,
    },
  });

  const products = [
    {
      name: "Classic Tee",
      description: "Comfortable everyday cotton T-shirt.",
      type: "T-shirt",
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["Black", "White", "Navy"]),
      priceKES: 1500,
      priceTZS: 15000,
      priceUGX: 50000,
      priceUSD: 15,
      priceEUR: 14,
      priceGBP: 12,
      stock: 50,
      images: JSON.stringify([
        "https://placehold.co/600x800?text=Classic+Tee",
      ]),
      isActive: true,
    },
    {
      name: "Slim Jeans",
      description: "Modern fit denim jeans.",
      type: "Jeans",
      sizes: JSON.stringify(["28", "30", "32", "34", "36"]),
      colors: JSON.stringify(["Blue", "Black"]),
      priceKES: 3500,
      priceTZS: 35000,
      priceUGX: 120000,
      priceUSD: 35,
      priceEUR: 32,
      priceGBP: 28,
      stock: 30,
      images: JSON.stringify([
        "https://placehold.co/600x800?text=Slim+Jeans",
      ]),
      isActive: true,
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: {
        name: product.name,
      },
    });

    if (!existing) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  await prisma.siteConfig.upsert({
    where: { key: "whatsappLink" },
    update: {},
    create: {
      key: "whatsappLink",
      value: "https://wa.me/254700000000",
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: "instagramLink" },
    update: {},
    create: {
      key: "instagramLink",
      value: "https://instagram.com/1121styles",
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: "tiktokLink" },
    update: {},
    create: {
      key: "tiktokLink",
      value: "https://tiktok.com/@1121styles",
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: "youtubeLink" },
    update: {},
    create: {
      key: "youtubeLink",
      value: "https://youtube.com/@1121styles",
    },
  });

  console.log("Database seeded successfully.");
  console.log("Admin email: admin@1121styles.com");
  console.log("Admin password: ChangeMe123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });