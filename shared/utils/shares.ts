import {
  add,
  allocate,
  dinero,
  isNegative,
  isPositive,
  minimum,
  multiply,
  subtract,
  type Currency,
  type Dinero,
} from "dinero.js";
import type { ExpenseShares, Reimbursment } from "../types/counts";
import type { ExpenseData, MemberData } from "../types/server";
import { zero } from "./dinero";

export function computeSharesAmount(
  amount: Dinero<number>,
  shares: ExpenseShares[number][]
): Dinero<number>[] {
  let left = amount;
  for (const share of shares) {
    if (share.fraction === undefined) {
      left = subtract(left, share.amount);
    }
  }
  const allocations = allocate(
    left,
    shares.map((s) => s.fraction || 0)
  );
  for (let idx = 0; idx < shares.length; idx++) {
    allocations[idx] = shares[idx]!.amount ?? allocations[idx]!;
  }
  return allocations;
}

export function computeBalances(
  expenses: ExpenseData[],
  members: MemberData[],
  countCurrency: Currency<number>
): Dinero<number>[] {
  const resolved = expenses.map((e) => {
    return computeSharesAmount(
      dinero(JSON.parse(e.amount)),
      e.shares.map(
        (s) =>
          ({
            fraction: s.fraction !== null ? s.fraction : undefined,
            amount: s.amount ? dinero(JSON.parse(s.amount)) : undefined,
          } as ExpenseShares[number])
      )
    );
  });

  return members.map((m) =>
    expenses.reduce((acc, e, i) => {
      const idx = e.shares.findIndex((s) => s.memberId === m.id);
      const share = idx !== -1 ? resolved[i]![idx]! : zero(countCurrency);
      if (e.authorId === m.id) {
        return add(acc, subtract(dinero(JSON.parse(e.amount)), share));
      } else {
        return subtract(acc, share);
      }
    }, zero(countCurrency))
  );
}

export function computeReimbursments(
  members: MemberData[],
  inputBalances: Dinero<number>[]
): Reimbursment[] {
  const balances = [...inputBalances];
  const reimb: Reimbursment[] = [];

  for (let i = 0; i < balances.length; i++) {
    while (isNegative(balances[i]!)) {
      const j = balances.findIndex((v) => isPositive(v));
      if (j === -1) {
        if (i === balances.length - 1) {
          break;
        } else {
          throw new Error("No positive balance found");
        }
      }
      const amount = minimum([multiply(balances[i]!, -1), balances[j]!]);
      balances[i] = add(balances[i]!, amount);
      balances[j] = subtract(balances[j]!, amount);
      reimb.push({
        from: members[i]!,
        to: members[j]!,
        amount,
      });
    }
  }

  return reimb;
}
