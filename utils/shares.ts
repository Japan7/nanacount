export function computeSharesAmount(
  amount: number,
  shares: { fraction?: number; amount?: number }[]
): number[] {
  let left = amount;
  let nparts = 0;
  const resolved: (number | undefined)[] = new Array(shares.length).fill(
    undefined
  );

  // Apply custom amounts
  for (let idx = 0; idx < shares.length; idx++) {
    const share = shares[idx];
    if (share.amount !== undefined && share.fraction === undefined) {
      resolved[idx] = share.amount;
      left -= share.amount;
    } else if (share.fraction !== undefined) {
      nparts += share.fraction;
    } else {
      throw new Error("Invalid share");
    }
  }

  // Apply fractions
  for (let idx = 0; idx < shares.length; idx++) {
    if (resolved[idx] === undefined) {
      const share = shares[idx];

      let amount: number;
      if (share.fraction === undefined) {
        throw new Error("Invalid share");
      } else if (share.fraction === 0) {
        amount = 0;
      } else {
        amount = share.fraction * (left / nparts);
        if (amount < 0) {
          amount = 0;
        } else if (amount > left) {
          amount = left;
        } else {
          amount = Math.ceil(amount * 100) / 100;
        }
      }

      resolved[idx] = amount;
      left -= amount;
      nparts -= share.fraction;
    }
  }

  return resolved as number[];
}

export function computeBalances(
  expenses: ExpenseData[],
  members: MemberData[]
) {
  const resolved = expenses.map((e) =>
    computeSharesAmount(
      e.amount,
      e.shares.map((s) => ({
        fraction: s.fraction !== null ? s.fraction : undefined,
        amount: s.amount !== null ? s.amount : undefined,
      }))
    )
  );
  return members.map((m) =>
    expenses.reduce((acc, e, i) => {
      const idx = e.shares.findIndex((s) => s.memberId === m.id);
      const share = idx !== -1 ? resolved[i][idx] : 0;
      if (e.authorId === m.id) {
        return acc + (e.amount - share);
      } else {
        return acc - share;
      }
    }, 0)
  );
}

export function computeReimbursments(
  members: MemberData[],
  inputBalances: number[]
) {
  const balances = [...inputBalances];
  const reimb: { from: MemberData; to: MemberData; amount: number }[] = [];

  for (let i = 0; i < balances.length; i++) {
    while (balances[i] <= -0.01) {
      const j = balances.findIndex((v) => v >= 0.01);
      if (j === -1) {
        if (i === balances.length - 1) {
          break;
        } else {
          throw new Error("No positive balance found");
        }
      }
      let amount = Math.min(-balances[i], balances[j]);
      amount = Math.ceil(amount * 100) / 100;
      balances[i] += amount;
      balances[j] -= amount;
      reimb.push({
        from: members[i],
        to: members[j],
        amount,
      });
    }
  }

  return reimb;
}
