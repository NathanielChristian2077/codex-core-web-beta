-- AlterTable
ALTER TABLE "public"."Local" ALTER COLUMN "descricao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Objeto" ALTER COLUMN "descricao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Personagem" ALTER COLUMN "descricao" DROP NOT NULL;
