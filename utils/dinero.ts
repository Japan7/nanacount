import * as currencies from "@dinero.js/currencies";
import { dinero, toDecimal, type Currency, type Dinero } from "dinero.js";

export function zero(currency: Currency<number>): Dinero<number> {
  return dinero({ amount: 0, currency });
}

export function fromFloat(
  value: number,
  currency: Currency<number>
): Dinero<number> {
  const factor = (currency.base as number) ** currency.exponent;
  const amount = Math.round(value * factor);
  return dinero({ amount, currency });
}

export function toFloat(amount: Dinero<number>): number {
  return parseFloat(toDecimal(amount));
}

export function toString(amount: Dinero<number>): string {
  return toDecimal(
    amount,
    ({ value, currency }) => `${currency.code} ${value}`
  );
}

export const currencyRecord = Object.fromEntries(
  Object.values(currencies).map((currency) => [currency.code, currency])
);
