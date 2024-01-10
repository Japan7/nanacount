export interface ExpenseShares {
  [id: number]:
    | { fraction: number; amount: number | "" }
    | { fraction: ""; amount: number };
}
