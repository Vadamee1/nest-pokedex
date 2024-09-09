import { PrismaService } from '../prisma.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Pokemon, PrismaPromise } from '@prisma/client';

const createPokemon: CreatePokemonDto = {
  name: 'Rayquaza',
  numPokedex: 384,
};

const resultPokemon: Pokemon = {
  id: null,
  name: null,
  numPokedex: null,
};

const resultPokemons: Pokemon[] = [];

const idPokemon: string = '51e36755-3734-417e-96f0-68688ab72fdc';

describe('PokemonController', () => {
  let pokemonController: PokemonController;
  let pokemonService: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [PokemonService, PrismaService],
    }).compile();

    pokemonController = module.get<PokemonController>(PokemonController);
    pokemonService = module.get<PokemonService>(PokemonService);
  });

  describe('create', () => {
    it('should create new pokemon and return data', async () => {
      jest
        .spyOn(pokemonService, 'create')
        .mockImplementation(
          () => Promise.resolve(resultPokemon) as PrismaPromise<Pokemon>,
        );

      expect(await pokemonController.create(createPokemon)).toBe(resultPokemon);
    });
  });

  describe('findAll', () => {
    it('should return an array of pokemons', async () => {
      jest
        .spyOn(pokemonService, 'findAll')
        .mockImplementation(
          () => Promise.resolve(resultPokemons) as PrismaPromise<Pokemon[]>,
        );

      expect(await pokemonController.findAll()).toBe(resultPokemons);
    });
  });

  describe('findOne', () => {
    it('should return one pokemon', async () => {
      jest
        .spyOn(pokemonService, 'findOne')
        .mockImplementation(
          () => Promise.resolve(resultPokemon) as PrismaPromise<Pokemon>,
        );

      expect(await pokemonController.findOne(idPokemon)).toBe(resultPokemon);
    });
  });

  describe('update', () => {
    it('should update pokemon and return data', async () => {
      jest
        .spyOn(pokemonService, 'update')
        .mockImplementation(
          () => Promise.resolve(resultPokemon) as PrismaPromise<Pokemon>,
        );

      expect(await pokemonController.update(idPokemon, createPokemon)).toBe(
        resultPokemon,
      );
    });
  });

  describe('remove', () => {
    it('should delete a pokemon', async () => {
      jest
        .spyOn(pokemonService, 'remove')
        .mockImplementation(
          () =>
            Promise.resolve(`This action removes a #`) as PrismaPromise<string>,
        );

      expect(await pokemonController.remove(idPokemon)).toBe(
        'This action removes a #',
      );
    });
  });
});
