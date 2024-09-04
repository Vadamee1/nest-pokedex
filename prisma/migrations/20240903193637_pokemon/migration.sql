-- CreateTable
CREATE TABLE "pokemon" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "num_pokedex" INTEGER NOT NULL,

    CONSTRAINT "pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_name_key" ON "pokemon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_num_pokedex_key" ON "pokemon"("num_pokedex");
