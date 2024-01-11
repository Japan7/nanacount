import type { InternalApi } from "nitropack";

export interface ExpenseShares {
  [id: number]:
    | { fraction: number; amount: number | "" }
    | { fraction: ""; amount: number };
}

export type CountData = InternalApi["/api/counts/:id"]["get"] extends
  | infer T
  | null
  ? T
  : never;
export type MemberData = CountData["members"][number];
export type ExpenseData = CountData["expenses"][number];
