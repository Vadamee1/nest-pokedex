import { PrismaClient, Type } from '@prisma/client';
import { fetchPokemonType } from '../data/type';

const prisma = new PrismaClient();

export default async function typeSeed() {
  const types: Type[] = await fetchPokemonType();
  try {
    await prisma.$transaction(
      types.map((type) =>
        prisma.type.upsert({
          create: type,
          update: {},
          where: {
            id: type.id,
          },
        }),
      ),
    );
  } catch (error) {
    console.error(error);
  }
}
