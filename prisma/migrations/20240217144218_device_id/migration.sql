/*
  Warnings:

  - You are about to drop the column `ip` on the `Sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,deviceId]` on the table `Sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Sessions_userId_ip_key";

-- AlterTable
ALTER TABLE "Sessions" DROP COLUMN "ip",
ADD COLUMN     "deviceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sessions_userId_deviceId_key" ON "Sessions"("userId", "deviceId");
