import { Type } from '@prisma/client';

type TypeResponse = {
  count: number;
  next: string;
  previous: string;
  results: Result[];
};

type Result = {
  name: string;
  url: string;
};

const fetchIconType = async (name: string) => {
  const data = await fetch(`https://pokeapi.co/api/v2/type/${name}`).then(
    (res) => res.json(),
  );

  const icon: string = data.sprites.generation_viii.sword_shield.name_icon;

  return icon;
};

const fetchPokemonTYpe = async () => {
  const data: TypeResponse = await fetch('https://pokeapi.co/api/v2/type').then(
    (res) => res.json(),
  );

  const typesWithIcons: Type[] = await Promise.all(
    data.results.map(async (type) => {
      const icon = await fetchIconType(type.name);
      return {
        id: Number(type.url.split('/').at(-2)!),
        name: type.name,
        icon,
      };
    }),
  );

  return typesWithIcons;
};

export const types = fetchPokemonTYpe();
