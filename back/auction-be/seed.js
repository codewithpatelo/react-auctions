const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  // Crear usuarios ficticios
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });
    users.push(user);
  }

  // Crear subastas ficticias
  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    await prisma.auction.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        startingPrice: parseFloat(faker.commerce.price()),
        currentPrice: parseFloat(faker.commerce.price()),
        endTime: faker.date.future(),
        userId: randomUser.id, // Asignar userId válido
      },
    });
  }

  // Crear pujas ficticias
  const auctions = await prisma.auction.findMany(); // Obtener todas las subastas
  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomAuction = auctions[Math.floor(Math.random() * auctions.length)];
    await prisma.bid.create({
      data: {
        auctionId: randomAuction.id, // Asignar auctionId válido
        userId: randomUser.id, // Asignar userId válido
        amount: parseFloat(faker.commerce.price()),
        createdAt: faker.date.recent(),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
