import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const tamil = await prisma.language.findUnique({
    where: {
      code: "ta",
    },
  });

  if (!tamil) {
    throw new Error("Tamil language not found");
  }

  const rssUrl =
    "https://tamil.oneindia.com/rss/feeds/tamil-news-fb.xml";

  const existingSource = await prisma.newsSource.findFirst({
    where: { rssUrl },
  });

  if (existingSource) {
    console.log("Tamil source already exists:", existingSource);
    return;
  }

  const source = await prisma.newsSource.create({
    data: {
      name: "Oneindia Tamil",
      websiteUrl: "https://tamil.oneindia.com",
      rssUrl,
      languageId: tamil.id,
    },
  });

  console.log("Tamil source created:", source);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });