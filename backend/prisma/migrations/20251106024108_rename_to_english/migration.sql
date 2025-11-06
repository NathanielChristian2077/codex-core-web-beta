/*
  Warnings:

  - You are about to drop the `Campanha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Local` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Objeto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Personagem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Relacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('GM', 'PLAYER');

-- CreateEnum
CREATE TYPE "public"."NodeType" AS ENUM ('EVENT', 'CHARACTER', 'LOCATION', 'OBJECT');

-- CreateEnum
CREATE TYPE "public"."RelationType" AS ENUM ('APPEARS', 'OCCURS_AT', 'USES', 'HAS', 'PARALLEL', 'PREVIOUS', 'NEXT', 'LINK');

-- DropForeignKey
ALTER TABLE "public"."Campanha" DROP CONSTRAINT "Campanha_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Evento" DROP CONSTRAINT "Evento_campanhaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Local" DROP CONSTRAINT "Local_campanhaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Objeto" DROP CONSTRAINT "Objeto_campanhaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Personagem" DROP CONSTRAINT "Personagem_campanhaId_fkey";

-- DropTable
DROP TABLE "public"."Campanha";

-- DropTable
DROP TABLE "public"."Evento";

-- DropTable
DROP TABLE "public"."Local";

-- DropTable
DROP TABLE "public"."Objeto";

-- DropTable
DROP TABLE "public"."Personagem";

-- DropTable
DROP TABLE "public"."Relacao";

-- DropTable
DROP TABLE "public"."Usuario";

-- DropEnum
DROP TYPE "public"."NodoTipo";

-- DropEnum
DROP TYPE "public"."Papel";

-- DropEnum
DROP TYPE "public"."RelTipo";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'PLAYER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "occurredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Character" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ObjectModel" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObjectModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Relation" (
    "id" TEXT NOT NULL,
    "fromType" "public"."NodeType" NOT NULL,
    "fromId" TEXT NOT NULL,
    "toType" "public"."NodeType" NOT NULL,
    "toId" TEXT NOT NULL,
    "kind" "public"."RelationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Event_campaignId_occurredAt_idx" ON "public"."Event"("campaignId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "Event_campaignId_title_key" ON "public"."Event"("campaignId", "title");

-- CreateIndex
CREATE INDEX "Character_campaignId_name_idx" ON "public"."Character"("campaignId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Character_campaignId_name_key" ON "public"."Character"("campaignId", "name");

-- CreateIndex
CREATE INDEX "Location_campaignId_name_idx" ON "public"."Location"("campaignId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Location_campaignId_name_key" ON "public"."Location"("campaignId", "name");

-- CreateIndex
CREATE INDEX "ObjectModel_campaignId_name_idx" ON "public"."ObjectModel"("campaignId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ObjectModel_campaignId_name_key" ON "public"."ObjectModel"("campaignId", "name");

-- CreateIndex
CREATE INDEX "Relation_fromType_fromId_idx" ON "public"."Relation"("fromType", "fromId");

-- CreateIndex
CREATE INDEX "Relation_toType_toId_idx" ON "public"."Relation"("toType", "toId");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_fromType_fromId_toType_toId_kind_key" ON "public"."Relation"("fromType", "fromId", "toType", "toId", "kind");

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Character" ADD CONSTRAINT "Character_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ObjectModel" ADD CONSTRAINT "ObjectModel_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
