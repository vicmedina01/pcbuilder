CREATE TABLE "Build" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "resolution" TEXT,
  "fpsTarget" TEXT,
  "budgetTier" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BuildItem" (
  "id" TEXT NOT NULL,
  "buildId" TEXT NOT NULL,
  "productId" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  CONSTRAINT "BuildItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BuildItem_buildId_category_key" ON "BuildItem"("buildId", "category");

ALTER TABLE "Build"
ADD CONSTRAINT "Build_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BuildItem"
ADD CONSTRAINT "BuildItem_buildId_fkey"
FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BuildItem"
ADD CONSTRAINT "BuildItem_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
