-- CreateTable
CREATE TABLE "CarModel" (
    "id" TEXT NOT NULL,
    "carModel" TEXT NOT NULL,
    "year" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SparePart" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "carModelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SparePart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleHistory" (
    "id" TEXT NOT NULL,
    "sparePartName" TEXT NOT NULL,
    "carModel" TEXT NOT NULL,
    "year" TEXT,
    "quantity" INTEGER NOT NULL,
    "soldDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sparePartId" TEXT,

    CONSTRAINT "SaleHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarModel_carModel_year_key" ON "CarModel"("carModel", "year");

-- AddForeignKey
ALTER TABLE "SparePart" ADD CONSTRAINT "SparePart_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleHistory" ADD CONSTRAINT "SaleHistory_sparePartId_fkey" FOREIGN KEY ("sparePartId") REFERENCES "SparePart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
