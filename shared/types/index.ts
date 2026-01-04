import type { Dinero } from "dinero.js";
import type { InternalApi } from "nitropack";

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

export type CountData = InternalApi["/api/counts/:id"]["get"] extends
  | infer T
  | null
  ? T
  : never;
export type MemberData = CountData["members"][number];
export type ExpenseData = CountData["expenses"][number];
