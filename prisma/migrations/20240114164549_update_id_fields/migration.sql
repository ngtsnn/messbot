/*
  Warnings:

  - The primary key for the `Budget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Expenses` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_budgetId_fkey";

-- AlterTable
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Budget_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "budgetId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
