import { Move } from '@prisma/client';

type MoveResponse = {
  count: number;
  next: string;
  previous: string;
  results: Result[];
};

type Result = {
  name: string;
  url: string;
};

const fetchMoveDetail = async (name: string) => {
  const data = await fetch(`https://pokeapi.co/api/v2/mov/${name}`).then(
    (res) => res.json(),
  );

  const move: Move = {
    id: data.id,
    damageClass: data.damage_class.name,
    effect: data.effec_entries[0].effect,
    name: data.name,
    power: data.power,
    pp: data.pp,
    priority: data.priority,
    typeId: data.id,
  };

  return;
};

export const fetchPokemonMoves = async () => {
  const data: MoveResponse = await fetch(
    'https://pokeapi.co/api/v2/move?limit=937',
  ).then((res) => res.json());
};
