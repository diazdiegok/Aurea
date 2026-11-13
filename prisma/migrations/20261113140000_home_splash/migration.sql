-- CreateTable
CREATE TABLE "HomeSplash" (
    "id" TEXT NOT NULL DEFAULT 'home',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL DEFAULT '',
    "subtitle" TEXT NOT NULL DEFAULT '',
    "ctaLabel" TEXT NOT NULL DEFAULT 'Entrar a la tienda',
    "imageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeSplash_pkey" PRIMARY KEY ("id")
);
