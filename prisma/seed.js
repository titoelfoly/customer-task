import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create dummy users
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      image: "https://example.com/john-doe.jpg",
      customers: {
        create: [
          {
            email: "mokht@gmail.com",
            status: false,
            phone: "",
            name: "",
          },
        ],
      },
      accounts: {
        create: [
          {
            provider: "google",
            providerAccountId: "google-1234",
            type: "oauth",
            refresh_token: "dummy-refresh-token",
            access_token: "dummy-access-token",
            expires_at: 1234567890,
            token_type: "bearer",
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      image: "https://example.com/jane-smith.jpg",
      accounts: {
        create: [
          {
            provider: "github",
            providerAccountId: "github-5678",
            type: "oauth",
            refresh_token: "dummy-refresh-token-github",
            access_token: "dummy-access-token-github",
            expires_at: 1234567890,
            token_type: "bearer",
          },
        ],
      },
    },
  });

  console.log("Dummy data created:", { user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
