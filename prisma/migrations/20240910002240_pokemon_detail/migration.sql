/*
  Warnings:

  - Added the required column `height` to the `pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondary_type_id` to the `pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_id` to the `pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pokemon" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "secondary_type_id" INTEGER NOT NULL,
ADD COLUMN     "type_id" INTEGER NOT NULL,
ADD COLUMN     "weight" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "abilitie" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "effect" VARCHAR(1000) NOT NULL,
    "short_effect" VARCHAR(1000) NOT NULL,
    "effect_change" VARCHAR(1000) NOT NULL,
    "pokemon_id" TEXT,

    CONSTRAINT "abilitie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "move" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "damage_class" VARCHAR(10) NOT NULL,
    "efect" VARCHAR(1000) NOT NULL,
    "power" INTEGER NOT NULL,
    "pp" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "pokemon_id" TEXT,

    CONSTRAINT "move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprite" (
    "id" INTEGER NOT NULL,
    "back_default" VARCHAR(255) NOT NULL,
    "back_female" VARCHAR(255),
    "back_shiny" VARCHAR(255) NOT NULL,
    "back_shiny_female" VARCHAR(255),
    "front_default" VARCHAR(255) NOT NULL,
    "front_female" VARCHAR(255),
    "front_shiny" VARCHAR(255) NOT NULL,
    "front_shiny_female" VARCHAR(255),
    "front_dream_world" VARCHAR(255) NOT NULL,
    "back_female_dream_world" VARCHAR(255),
    "front_default_home" VARCHAR(255) NOT NULL,
    "front_female_home" VARCHAR(255),
    "front_shiny_home" VARCHAR(255) NOT NULL,
    "front_official_artwork" VARCHAR(255) NOT NULL,
    "front_shiny_official_artwork" VARCHAR(255) NOT NULL,
    "back_default_showdown" VARCHAR(255) NOT NULL,
    "back_female_showdown" VARCHAR(255),
    "back_shiny_showdown" VARCHAR(255) NOT NULL,
    "back_shiny_female_showdown" VARCHAR(255),
    "fronr_default_showdown" VARCHAR(255) NOT NULL,
    "front_female_showdown" VARCHAR(255),
    "front_shiny_showdown" VARCHAR(255) NOT NULL,
    "front_shiny_female_showdown" VARCHAR(255),
    "pokemonId" TEXT,

    CONSTRAINT "sprite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stat" (
    "id" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "special_attack" INTEGER NOT NULL,
    "special_deefense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "pokemonId" TEXT,

    CONSTRAINT "stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "icon" VARCHAR(255) NOT NULL,

    CONSTRAINT "type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "abilitie" ADD CONSTRAINT "abilitie_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move" ADD CONSTRAINT "move_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprite" ADD CONSTRAINT "sprite_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stat" ADD CONSTRAINT "stat_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokemon" ADD CONSTRAINT "pokemon_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokemon" ADD CONSTRAINT "pokemon_secondary_type_id_fkey" FOREIGN KEY ("secondary_type_id") REFERENCES "type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
