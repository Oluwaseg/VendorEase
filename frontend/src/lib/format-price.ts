import { CURRENCY_CONFIG, type SupportedCurrency } from "./currency";

import { getFxRates } from "./fx";

export function formatPrice(
  amount: number,
  currency: SupportedCurrency,
): string {
  const { locale } = CURRENCY_CONFIG[currency];
  const hasFraction = Math.round(amount * 100) % 100 !== 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  }).format(amount);
}

// Converts NGN base price to selected currency for display
export async function convertAndFormatPrice(
  nairaAmount: number,
  currency: SupportedCurrency,
): Promise<string> {
  if (currency === "NGN") {
    return formatPrice(nairaAmount, "NGN");
  }
  const rates = await getFxRates();
  // Convert NGN to USD using rates
  const usdAmount = nairaAmount / rates.NGN;
  return formatPrice(usdAmount, "USD");
}

export function formatPriceRange(
  min: number,
  max: number,
  currency: SupportedCurrency,
): string {
  return `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`;
}
