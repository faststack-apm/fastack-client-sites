import { ApiError } from './errors';

/**
 * Simulated card processor. Adds 80-250 ms of latency like a real gateway call.
 * Test cards: any Luhn-valid number approves; 4000 0000 0000 0002 is always declined.
 */
export const DECLINE_CARD = '4000000000000002';

export interface PaymentInput { cardNumber: string; expMonth: number; expYear: number; cvc: string; nameOnCard: string }

export async function authorize(payment: PaymentInput, _amount: number) {
  const number = payment.cardNumber.replace(/ /g, '');
  if (!luhn(number)) throw ApiError.badRequest('invalid_card', 'Card number is invalid');
  const now = new Date();
  if (payment.expYear < now.getFullYear() || (payment.expYear === now.getFullYear() && payment.expMonth < now.getMonth() + 1)) {
    throw ApiError.badRequest('card_expired', 'Card is expired');
  }
  await new Promise((r) => setTimeout(r, 80 + Math.random() * 170));
  if (number === DECLINE_CARD) throw new ApiError(402, 'payment_declined', 'Your card was declined');
  return { brand: brand(number), last4: number.slice(-4), authCode: String(100000 + Math.floor(Math.random() * 899999)) };
}

function brand(n: string) {
  switch (n[0]) {
    case '4': return 'visa';
    case '5': case '2': return 'mastercard';
    case '3': return 'amex';
    case '6': return 'discover';
    default: return 'card';
  }
}

function luhn(n: string) {
  if (!/^\d+$/.test(n)) return false;
  let sum = 0;
  let dbl = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = n.charCodeAt(i) - 48;
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}
