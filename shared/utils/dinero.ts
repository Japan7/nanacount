import {
  convert,
  dinero,
  toDecimal,
  toSnapshot,
  transformScale,
  type Dinero,
  type DineroCurrency,
  type DineroRates,
} from "dinero.js";
import * as currencies from "dinero.js/currencies";

export function zero(currency: DineroCurrency<number>): Dinero<number> {
  return dinero({ amount: 0, currency });
}

export function fromFloat(
  value: number,
  currency: DineroCurrency<number>,
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
    transformScale(amount, toSnapshot(amount).currency.exponent),
    ({ value, currency }) => `${currency.code} ${value}`,
  );
}

export const currencyRecord = Object.fromEntries(
  Object.values(currencies).map((currency) => [currency.code, currency]),
);

export async function convertTo(
  amount: Dinero<number>,
  currency: DineroCurrency<number>,
  date: Date,
): Promise<Dinero<number>> {
  const ogCurrency = toSnapshot(amount).currency;
  const code = ogCurrency.code.toLowerCase();
  const dateStr = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const data = await $fetch<any>(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateStr}/v1/currencies/${code}.min.json`,
  );
  const rate = fromFloat(data[code][currency.code.toLowerCase()], currency);
  const snap = toSnapshot(rate);
  const rates: DineroRates<number> = {
    [currency.code]: { amount: snap.amount, scale: snap.scale },
  };
  return convert(amount, currency, rates);
}
