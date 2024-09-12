import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  async executeSeed() {
    await this.seedService.typeSeed();
    this.seedService.moveSeed();
    this.seedService.pokemonSeed();
    this.seedService.abilitySeed();
    return 'all databases are seeding';
  }
}
