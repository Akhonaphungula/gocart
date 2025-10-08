import prisma from "./lib/prisma.js"; // adjust path if needed

async function main() {
  const user = await prisma.user.create({
    data: {
      id: "local_test_user_1",
      email: "localtest@example.com",
      name: "Local Test",
      image: "https://placehold.co/100x100"
    }
  });

  console.log("Inserted user:", user);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Error:", e);
});
