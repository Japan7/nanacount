export function splitExpense(
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

      if (share.fraction === undefined) {
        throw new Error("Invalid share");
      }

      let amount = share.fraction * (left / nparts);
      if (amount < 0) {
        amount = 0;
      } else if (amount > left) {
        amount = left;
      } else {
        amount = Math.ceil(amount * 100) / 100;
      }

      resolved[idx] = amount;
      left -= amount;
      nparts -= share.fraction;
    }
  }

  return resolved as number[];
}
