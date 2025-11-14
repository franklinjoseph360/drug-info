import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, './raw-json-files/drugData-2025[48].json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  for (const item of data) {
    const { code, genericName, brandName, company, launchDate } = item;

    // Upsert company
    const companyRecord = await prisma.company.upsert({
      where: { name: company },
      update: {},
      create: { name: company },
    });

    // Create drug and skip existing ones
    let drug;
    try {
        drug = await prisma.drug.create({
            data: {
            code,
            genericName,
            brandName,
            launchDate: launchDate ? new Date(launchDate) : null,
            companyId: companyRecord.id,
            },
        });
    } catch (err: any) {
        if (err.code === 'P2002') {
            console.log(`Skipping duplicate drug code: ${code}`);
            drug = await prisma.drug.findUnique({ where: { code } });
        } else {
            throw err;
        }
    }


    // Parse ingredients
    const ingredients = Array.from(
    new Set(
        genericName
        .split(',')
        .map((x: string) => x.trim())
        .filter((x: string) => x.length > 0)
    )
    );

    for (const ing of ingredients) {
        const ingredientRecord = await prisma.ingredient.upsert({
            where: { name: ing },
            update: {},
            create: { name: ing },
        });

        // Create the relation but ignore if already exists
        await prisma.drugIngredient.upsert({
            where: {
            drugId_ingredientId: {
                drugId: drug.id,
                ingredientId: ingredientRecord.id,
            },
            },
            update: {},
            create: {
            drugId: drug.id,
            ingredientId: ingredientRecord.id,
            },
        });
    }

  }

  console.log('Seed completed');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
