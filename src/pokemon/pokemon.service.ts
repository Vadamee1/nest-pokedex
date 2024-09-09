import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PrismaService } from '../prisma.service';
import { Pokemon } from '@prisma/client';
import { isValidUUID } from '../common/helpers/uuid.helper';

@Injectable()
export class PokemonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.prisma.pokemon.create({
        data: createPokemonDto,
      });
      return pokemon;
    } catch (error) {
      this.handleExceptions(error, `Pokemon already exist`);
    }
  }

  findAll() {
    const results = this.prisma.pokemon.findMany();
    return results;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.prisma.pokemon.findUnique({
        where: {
          numPokedex: Number(term),
        },
      });
    }

    if (isValidUUID(term)) {
      pokemon = await this.prisma.pokemon.findUnique({
        where: { id: term },
      });
    }

    if (!pokemon) {
      pokemon = await this.prisma.pokemon.findUnique({
        where: { name: term },
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or numPokedex ${term} not found`,
      );

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);

    try {
      const updatedPokemon = await this.prisma.pokemon.update({
        data: updatePokemonDto,
        where: { id: pokemon.id },
      });

      return updatedPokemon;
    } catch (error) {
      this.handleExceptions(error, `Num pokedex already exist`);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.prisma.pokemon.delete({
        where: { id },
      });

      console.log(result);
      return `This action removes a #`;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any, message?: string) {
    if (error.code === 'P2002') {
      throw new BadRequestException(message);
    }
    if (error.code === 'P2025')
      throw new NotFoundException('Pokemon not found');
    throw new InternalServerErrorException(
      "Can't create Pokemon - Check server logs",
    );
  }
}
