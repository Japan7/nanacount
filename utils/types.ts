export interface ExpenseShares {
  [id: number]:
    | { fraction: number; amount: number | "" }
    | { fraction: ""; amount: number };
}

// @ts-ignore
export type { CountData } from "~/pages/[id].vue";
export type MemberData = (CountData extends infer T | null
  ? T
  : never)["members"][number];
export type ExpenseData = (CountData extends infer T | null
  ? T
  : never)["expenses"][number];
