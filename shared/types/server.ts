/// <reference path="../../.nuxt/types/nitro.d.ts" />
import type { InternalApi } from "nitropack";

export type CountData = InternalApi["/api/counts/:id"]["get"] extends
  | infer T
  | null
  ? T
  : never;
export type MemberData = CountData["members"][number];
export type ExpenseData = CountData["expenses"][number];
