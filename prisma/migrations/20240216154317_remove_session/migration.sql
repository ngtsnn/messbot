/*
  Warnings:

  - You are about to drop the column `deviceId` on the `Sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,ip]` on the table `Sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ip` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Sessions_userId_deviceId_key";

-- AlterTable
ALTER TABLE "Sessions" DROP COLUMN "deviceId",
ADD COLUMN     "ip" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sessions_userId_ip_key" ON "Sessions"("userId", "ip");
