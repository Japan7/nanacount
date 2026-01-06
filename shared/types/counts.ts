import type { Dinero } from "dinero.js";
import type { MemberData } from "./server";

export interface ExpenseShares {
  [id: number]:
    | { fraction: number; amount?: Dinero<number> }
    | { fraction: undefined; amount: Dinero<number> };
}

export interface Reimbursment {
  from: MemberData;
  to: MemberData;
  amount: Dinero<number>;
}
