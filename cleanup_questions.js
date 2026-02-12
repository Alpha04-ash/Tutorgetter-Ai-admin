
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const { count } = await prisma.question.deleteMany({
            where: {
                text: {
                    contains: 'AI Generated Question about'
                }
            }
        });
        console.log(`Deleted ${count} placeholder questions.`);
    } catch (e) {
        console.error(e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
