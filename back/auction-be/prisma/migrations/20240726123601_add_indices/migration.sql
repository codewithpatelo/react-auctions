-- CreateIndex
CREATE INDEX "Auction_title_idx" ON "Auction"("title");

-- CreateIndex
CREATE INDEX "Auction_userId_idx" ON "Auction"("userId");

-- CreateIndex
CREATE INDEX "Auction_endTime_idx" ON "Auction"("endTime");

-- CreateIndex
CREATE INDEX "Bid_auctionId_idx" ON "Bid"("auctionId");

-- CreateIndex
CREATE INDEX "Bid_userId_idx" ON "Bid"("userId");

-- CreateIndex
CREATE INDEX "Bid_amount_idx" ON "Bid"("amount");

-- CreateIndex
CREATE INDEX "Bid_createdAt_idx" ON "Bid"("createdAt");
