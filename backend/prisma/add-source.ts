import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const english = await prisma.language.findUnique({
    where: {
      code: "en",
    },
  });

  if (!english) {
    throw new Error("English language not found");
  }

  const source = await prisma.newsSource.create({
    data: {
      name: "BBC News",
      websiteUrl: "https://www.bbc.com/news",
      rssUrl: "https://feeds.bbci.co.uk/news/rss.xml",
      languageId: english.id,
    },
  });

  console.log("News source created:", source);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });