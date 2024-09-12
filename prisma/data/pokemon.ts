import { Pokemon } from '@prisma/client';

type PokemonResponse = {
  results: Result[];
};

type Result = {
  name: string;
  url: string;
};

const fetchDetailPokemon = async (id: string) => {
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
    (res) => res.json(),
  );

  const detail = {
    name: data.name,
    height: data.height,
    weight: data.weight,
    numPokedex: +id,
    typeId: data.types[0].type.name,
    secondaryTypeId: data.types[1] ? data.types[1].type.name : null,
  };
};

const fetchPokemons = async () => {
  const data: PokemonResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=1302`,
  ).then((res) => res.json());
};
