-- CreateTable
CREATE TABLE "OwnerWallet" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "OwnerWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OwnerWallet_ownerId_key" ON "OwnerWallet"("ownerId");

-- AddForeignKey
ALTER TABLE "OwnerWallet" ADD CONSTRAINT "OwnerWallet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
