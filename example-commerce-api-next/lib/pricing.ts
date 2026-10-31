import { settings } from './catalog';

// Mirrors Pricing.java. All math is done in integer cents.
export const EXPRESS_SHIPPING_CENTS = 1495;

export interface Promo { code: string; percentOff: number; minSubtotalCents: number; description: string }
export const PROMOS: Record<string, Promo> = {
  VEGAS10: { code: 'VEGAS10', percentOff: 0.1, minSubtotalCents: 0, description: '10% off your order' },
  JACKPOT20: { code: 'JACKPOT20', percentOff: 0.2, minSubtotalCents: 10000, description: '20% off orders of $100+' },
};

export const findPromo = (code?: string | null): Promo | undefined =>
  code ? PROMOS[code.trim().toUpperCase()] : undefined;

export const toCents = (n: number | string) => Math.round(Number(n) * 100);
export const fromCents = (c: number) => Math.round(c) / 100;
/** Half-up rounding of a cents value that may carry fractions. */
const roundHalfUp = (c: number) => Math.floor(c + 0.5 + 1e-9);

export interface Totals {
  subtotal: number; discount: number; shipping: number; tax: number; total: number; freeShippingRemaining: number;
}

export function totals(subtotalCents: number, itemCount: number, promoCode: string | null, shippingMethod = 'standard'): Totals {
  const s = settings();
  let discount = 0;
  const promo = findPromo(promoCode);
  if (promo && subtotalCents >= promo.minSubtotalCents) discount = roundHalfUp(subtotalCents * promo.percentOff);
  const net = subtotalCents - discount;
  const threshold = toCents(s.freeShippingThreshold);
  let shipping = 0;
  if (itemCount > 0) {
    if (shippingMethod === 'express') shipping = EXPRESS_SHIPPING_CENTS;
    else shipping = net >= threshold ? 0 : toCents(s.flatShipping);
  }
  const tax = roundHalfUp(net * s.taxRate);
  return {
    subtotal: fromCents(subtotalCents),
    discount: fromCents(discount),
    shipping: fromCents(shipping),
    tax: fromCents(tax),
    total: fromCents(net + shipping + tax),
    freeShippingRemaining: fromCents(Math.max(0, threshold - net)),
  };
}
