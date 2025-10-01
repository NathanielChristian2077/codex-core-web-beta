/*
  Warnings:

  - A unique constraint covering the columns `[campanhaId,titulo]` on the table `Evento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[campanhaId,nome]` on the table `Local` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[campanhaId,nome]` on the table `Objeto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[campanhaId,nome]` on the table `Personagem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Usuario" ALTER COLUMN "papel" SET DEFAULT 'JOGADOR';

-- CreateIndex
CREATE INDEX "Evento_campanhaId_ocorridoEm_idx" ON "public"."Evento"("campanhaId", "ocorridoEm");

-- CreateIndex
CREATE UNIQUE INDEX "Evento_campanhaId_titulo_key" ON "public"."Evento"("campanhaId", "titulo");

-- CreateIndex
CREATE UNIQUE INDEX "Local_campanhaId_nome_key" ON "public"."Local"("campanhaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Objeto_campanhaId_nome_key" ON "public"."Objeto"("campanhaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Personagem_campanhaId_nome_key" ON "public"."Personagem"("campanhaId", "nome");
