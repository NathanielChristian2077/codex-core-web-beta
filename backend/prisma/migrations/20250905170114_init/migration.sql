-- CreateEnum
CREATE TYPE "public"."NodoTipo" AS ENUM ('EVENTO', 'PERSONAGEM', 'LOCAL', 'OBJETO');

-- CreateEnum
CREATE TYPE "public"."RelTipo" AS ENUM ('APARECE', 'OCORRE_EM', 'USA', 'TEM', 'PARALELO', 'ANTERIOR', 'POSTERIOR', 'VINCULO');

-- CreateTable
CREATE TABLE "public"."Personagem" (
    "id" TEXT NOT NULL,
    "campanhaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Personagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Local" (
    "id" TEXT NOT NULL,
    "campanhaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Objeto" (
    "id" TEXT NOT NULL,
    "campanhaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Objeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Relacao" (
    "id" TEXT NOT NULL,
    "origemTipo" "public"."NodoTipo" NOT NULL,
    "origemId" TEXT NOT NULL,
    "destinoTipo" "public"."NodoTipo" NOT NULL,
    "destinoId" TEXT NOT NULL,
    "tipo" "public"."RelTipo" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Relacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Personagem_campanhaId_nome_idx" ON "public"."Personagem"("campanhaId", "nome");

-- CreateIndex
CREATE INDEX "Local_campanhaId_nome_idx" ON "public"."Local"("campanhaId", "nome");

-- CreateIndex
CREATE INDEX "Objeto_campanhaId_nome_idx" ON "public"."Objeto"("campanhaId", "nome");

-- CreateIndex
CREATE INDEX "Relacao_origemTipo_origemId_idx" ON "public"."Relacao"("origemTipo", "origemId");

-- CreateIndex
CREATE INDEX "Relacao_destinoTipo_destinoId_idx" ON "public"."Relacao"("destinoTipo", "destinoId");

-- CreateIndex
CREATE UNIQUE INDEX "Relacao_origemTipo_origemId_destinoTipo_destinoId_tipo_key" ON "public"."Relacao"("origemTipo", "origemId", "destinoTipo", "destinoId", "tipo");

-- AddForeignKey
ALTER TABLE "public"."Personagem" ADD CONSTRAINT "Personagem_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "public"."Campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Local" ADD CONSTRAINT "Local_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "public"."Campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Objeto" ADD CONSTRAINT "Objeto_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "public"."Campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
