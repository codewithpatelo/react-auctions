/*
  Warnings:

  - You are about to drop the `Auction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bid` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_auctionId_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_userId_fkey";

-- DropTable
DROP TABLE "Auction";

-- DropTable
DROP TABLE "Bid";
