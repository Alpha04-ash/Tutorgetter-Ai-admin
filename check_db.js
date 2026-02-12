
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const category = await prisma.category.findUnique({
        where: { id: 1 },
        include: { questions: true }
    });
    console.log(`Category 1 has ${category?.questions.length || 0} questions.`);
    if (category?.questions.length > 0) {
        console.log('Sample question:', category.questions[0]);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
