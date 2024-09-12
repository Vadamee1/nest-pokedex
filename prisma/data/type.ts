import { Type } from '@prisma/client';

type TypeResponse = {
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

  const icon: string =
    data.sprites['generation-viii']['sword-shield'].name_icon;

  return icon;
};

export const fetchPokemonType = async () => {
  const data: TypeResponse = await fetch(
    'https://pokeapi.co/api/v2/type?limit=18',
  ).then((res) => res.json());

  const typesWithIcons: Type[] = await Promise.all(
    data.results.map(async (type) => {
      const icon = await fetchIconType(type.name);
      return {
        id: +type.url.split('/').at(-2)!,
        name: type.name,
        icon,
      };
    }),
  );

  return typesWithIcons;
};
