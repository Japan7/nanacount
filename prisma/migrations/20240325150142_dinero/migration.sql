-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    "countId" TEXT NOT NULL,
    CONSTRAINT "Expense_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_countId_fkey" FOREIGN KEY ("countId") REFERENCES "Count" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("amount", "authorId", "countId", "date", "description", "id", "title")
SELECT '{"amount":' || ("amount" * 100) || ',"currency":{"code":"EUR","base":10,"exponent":2},"scale":2}' AS "amount",
    "authorId", "countId", "date", "description", "id", "title"
FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
CREATE TABLE "new_Share" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" INTEGER NOT NULL,
    "fraction" REAL,
    "amount" TEXT,
    "expenseId" INTEGER NOT NULL,
    CONSTRAINT "Share_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Share_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Share" ("amount", "expenseId", "fraction", "id", "memberId")
SELECT CASE WHEN "amount" IS NULL THEN '' ELSE '{"amount":' || ("amount" * 100) || ',"currency":{"code":"EUR","base":10,"exponent":2},"scale":2}' END AS "amount",
    "expenseId", "fraction", "id", "memberId"
FROM "Share";
DROP TABLE "Share";
ALTER TABLE "new_Share" RENAME TO "Share";
CREATE UNIQUE INDEX "Share_memberId_expenseId_key" ON "Share"("memberId", "expenseId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
