-- CreateEnum
CREATE TYPE "public"."Papel" AS ENUM ('MESTRE', 'JOGADOR');

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" "public"."Papel" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campanha" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evento" (
    "id" TEXT NOT NULL,
    "campanhaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "ocorridoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Campanha" ADD CONSTRAINT "Campanha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evento" ADD CONSTRAINT "Evento_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "public"."Campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
