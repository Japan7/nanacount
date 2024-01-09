-- CreateTable
CREATE TABLE "Nanacount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "currency" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nanacountId" TEXT NOT NULL,
    CONSTRAINT "Member_nanacountId_fkey" FOREIGN KEY ("nanacountId") REFERENCES "Nanacount" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    "nanacountId" TEXT NOT NULL,
    CONSTRAINT "Expense_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_nanacountId_fkey" FOREIGN KEY ("nanacountId") REFERENCES "Nanacount" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Share" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" INTEGER NOT NULL,
    "count" REAL NOT NULL DEFAULT 1,
    "amount" REAL,
    "expenseId" INTEGER NOT NULL,
    CONSTRAINT "Share_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Share_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_name_nanacountId_key" ON "Member"("name", "nanacountId");

-- CreateIndex
CREATE UNIQUE INDEX "Share_memberId_expenseId_key" ON "Share"("memberId", "expenseId");
