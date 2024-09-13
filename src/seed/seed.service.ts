import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Ability, Move, Pokemon, Type } from '@prisma/client';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async typeSeed() {
    const data = await fetch('https://pokeapi.co/api/v2/type?limit=18').then(
      (res) => res.json(),
    );

    const typesWithIcons: Type[] = await Promise.all(
      data.results.map(async (type) => {
        const icon = await this.getIconType(type.name);
        return {
          id: +type.url.split('/').at(-2)!,
          name: type.name,
          icon,
        };
      }),
    );

    try {
      await this.prisma.$transaction(
        typesWithIcons.map((type) =>
          this.prisma.type.upsert({
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

  async moveSeed() {
    const data = await fetch('https://pokeapi.co/api/v2/move?limit=919').then(
      (res) => res.json(),
    );

    const detailMoves: Move[] = await Promise.all(
      data.results.map(async (move) => {
        const detail = await this.getMoveDetail(move.name, move.url);
        return detail;
      }),
    );

    try {
      await this.prisma.$transaction(
        detailMoves.map((move) =>
          this.prisma.move.upsert({
            create: move,
            update: {},
            where: {
              id: move.id,
            },
          }),
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }

  async abilitySeed() {
    const data = await fetch(
      'https://pokeapi.co/api/v2/ability?limit=307',
    ).then((res) => res.json());

    const detailAbilities: Ability[] = await Promise.all(
      data.results.map(async (ability) => {
        const detail = await this.getAbilityDetail(ability.name, ability.url);
        return detail;
      }),
    );

    try {
      await this.prisma.$transaction(
        detailAbilities.map((ability) =>
          this.prisma.ability.upsert({
            create: ability,
            update: {},
            where: {
              id: ability.id,
            },
          }),
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }

  async pokemonSeed() {
    const data = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=1025',
    ).then((res) => res.json());

    const detailPokemons = await Promise.all(
      data.results.map(async (pokemon) => {
        const detail = await this.getPokemonDetail(pokemon.name, pokemon.url);
        return detail;
      }),
    );

    detailPokemons.map(async ({ pokemon, abilities, moves }) => {
      const pokemonId = await this.prisma.pokemon.upsert({
        create: pokemon,
        update: {},
        where: { id: pokemon.id },
        select: {
          id: true,
        },
      });

      try {
        await this.prisma.$transaction(
          abilities.map(({ id }) =>
            this.prisma.pokemonAbility.upsert({
              create: {
                abilityId: id,
                pokemonId: pokemonId.id,
              },
              update: {},
              where: {
                abilityId_pokemonId: {
                  abilityId: id,
                  pokemonId: pokemonId.id,
                },
              },
            }),
          ),
        );
      } catch (error) {
        console.log(error);
      }

      try {
        await this.prisma.$transaction(
          moves.map(({ id }) =>
            this.prisma.pokemonMove.upsert({
              create: {
                moveId: id,
                pokemonId: pokemonId.id,
              },
              update: {},
              where: {
                pokemonId_moveId: {
                  pokemonId: pokemonId.id,
                  moveId: id,
                },
              },
            }),
          ),
        );
      } catch (error) {
        console.log(error);
      }
    });
  }

  private async getIconType(name: string) {
    const data = await fetch(`https://pokeapi.co/api/v2/type/${name}`).then(
      (res) => res.json(),
    );

    const icon: string =
      data.sprites['generation-viii']['sword-shield'].name_icon;

    return icon;
  }

  private getMoveDetail = async (name: string, url: string) => {
    try {
      const data = await fetch(`https://pokeapi.co/api/v2/move/${name}`).then(
        (res) => res.json(),
      );

      const typeIdDB = await this.prisma.type.findFirst({
        where: { name: data.type.name },
        select: {
          id: true,
        },
      });

      const move: Move = {
        id: +url.split('/').at(-2)!,
        damageClass: data.damage_class.name,
        effect: data.effect_entries[0] ? data.effect_entries[0].effect : '',
        name: data.name,
        power: data.power,
        pp: data.pp,
        priority: data.priority,
        typeId: typeIdDB.id,
      };

      return move;
    } catch (error) {
      console.error(`Error fetching details for move ${name}:`, error);
      return;
    }
  };

  private getAbilityDetail = async (name: string, url: string) => {
    try {
      const data = await fetch(
        `https://pokeapi.co/api/v2/ability/${name}`,
      ).then((res) => res.json());

      const ability: Ability = {
        id: +url.split('/').at(-2)!,
        effect: data.effect_changes[0]
          ? data.effect_changes[0].effect_entries[1].effect
          : null,
        effectChange: data.effect_entries[1]
          ? data.effect_entries[1].effect
          : null,
        shortEffect: data.effect_entries[1]
          ? data.effect_entries[1].short_effect
          : null,
        name: data.name,
      };

      return ability;
    } catch (error) {
      console.log(`Error fetching details for ability ${name}:`, error);
    }
  };

  private getPokemonDetail = async (name: string, url: string) => {
    try {
      const data = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}`,
      ).then((res) => res.json());

      const typeIdDB = await this.prisma.type.findFirst({
        where: { name: data.types[0].type.name },
        select: {
          id: true,
        },
      });

      let secondaryTypeIdDB: { id: number } = { id: null };

      if (data.types[1]) {
        secondaryTypeIdDB = await this.prisma.type.findFirst({
          where: { name: data.types[1].type.name },
          select: {
            id: true,
          },
        });
      } else secondaryTypeIdDB = { id: null };

      const pokemon: Pokemon = {
        id: uuid(),
        height: data.height,
        name: name,
        numPokedex: +url.split('/').at(-2)!,
        weight: data.weight,
        typeId: typeIdDB.id,
        secondaryTypeId: secondaryTypeIdDB.id,
      };

      const abilities = data.abilities.map((ability) => ({
        id: +ability.ability.url.split('/').at(-2)!,
      }));

      const moves = data.moves.map((move) => ({
        id: +move.move.url.split('/').at(-2)!,
      }));

      return { pokemon, abilities, moves };
    } catch (error) {
      console.log(`Error fetching details for move ${name}:`, error);
    }
  };
}
