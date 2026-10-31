import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { api, ApiError } from '../api';
import { useCart } from '../cart';
import { CartLines } from '../components/CartLines';
import { money } from '../format';
import { useDocumentTitle } from '../hooks';
import { PromoForm, Summary } from './CartPage';
import { Loading } from './states';

const EXPRESS = 14.95;

export function CheckoutPage() {
  useDocumentTitle('Checkout');
  const { cart, restoring, reset } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<'standard' | 'express'>('standard');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (restoring) return <Loading />;
  if (!cart || cart.items.length === 0) {
    return <div className="container state"><h1>Nothing to check out</h1><Link to="/" className="btn btn--pink">Keep shopping</Link></div>;
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? '').trim();
    const [mm, yy] = s('exp').split('/').map((x) => Number.parseInt(x, 10));
    setSubmitting(true);
    setError(null);
    try {
      const order = await api.placeOrder({
        cartId: cart.id,
        email: s('email'),
        shippingMethod: method,
        shippingAddress: {
          firstName: s('firstName'), lastName: s('lastName'), address1: s('address1'), address2: s('address2') || null,
          city: s('city'), state: s('state'), postalCode: s('postalCode'), country: 'US', phone: s('phone') || null,
        },
        payment: { cardNumber: s('cardNumber'), expMonth: mm, expYear: yy < 100 ? 2000 + yy : yy, cvc: s('cvc'), nameOnCard: s('nameOnCard') },
      });
      reset();
      navigate(`/orders/${order.orderNumber}?email=${encodeURIComponent(order.email)}&placed=1`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not place your order. Please try again.');
      setSubmitting(false);
    }
  };

  const shipping = method === 'express' ? EXPRESS : cart.shipping;
  return (
    <div className="container checkout">
      <h1>Checkout</h1>
      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={submit}>
          <fieldset>
            <legend>Contact</legend>
            <Field name="email" label="Email" type="email" autoComplete="email" required />
            <Field name="phone" label="Phone (optional)" type="tel" autoComplete="tel" />
          </fieldset>
          <fieldset>
            <legend>Shipping address</legend>
            <div className="row2">
              <Field name="firstName" label="First name" autoComplete="given-name" required />
              <Field name="lastName" label="Last name" autoComplete="family-name" required />
            </div>
            <Field name="address1" label="Address" autoComplete="address-line1" required />
            <Field name="address2" label="Apartment, suite (optional)" autoComplete="address-line2" />
            <div className="row3">
              <Field name="city" label="City" autoComplete="address-level2" required />
              <Field name="state" label="State" autoComplete="address-level1" required maxLength={2} placeholder="NV" />
              <Field name="postalCode" label="ZIP" autoComplete="postal-code" required pattern="[0-9]{5}(-[0-9]{4})?" />
            </div>
          </fieldset>
          <fieldset>
            <legend>Shipping method</legend>
            <label className="radio-card">
              <input type="radio" name="method" checked={method === 'standard'} onChange={() => setMethod('standard')} />
              <span>Standard (5–7 days)</span><strong>{cart.shipping === 0 ? 'FREE' : money(cart.shipping)}</strong>
            </label>
            <label className="radio-card">
              <input type="radio" name="method" checked={method === 'express'} onChange={() => setMethod('express')} />
              <span>Express (2 days)</span><strong>{money(EXPRESS)}</strong>
            </label>
          </fieldset>
          <fieldset>
            <legend>Payment</legend>
            <p className="muted small">Demo store: use 4242 4242 4242 4242 (approved) or 4000 0000 0000 0002 (declined), any future expiry.</p>
            <Field name="nameOnCard" label="Name on card" autoComplete="cc-name" required />
            <Field name="cardNumber" label="Card number" autoComplete="cc-number" inputMode="numeric" required defaultValue="4242 4242 4242 4242" />
            <div className="row2">
              <Field name="exp" label="Expiry (MM/YY)" autoComplete="cc-exp" required pattern="(0[1-9]|1[0-2])/[0-9]{2}" defaultValue="12/30" />
              <Field name="cvc" label="CVC" autoComplete="cc-csc" inputMode="numeric" required pattern="[0-9]{3,4}" defaultValue="123" />
            </div>
          </fieldset>
          {error && <div className="alert" role="alert">{error}</div>}
          <button className="btn btn--pink btn--block btn--lg" disabled={submitting}>
            {submitting ? 'Placing order…' : `Place order · ${money(cart.total - cart.shipping + shipping)}`}
          </button>
        </form>
        <aside className="summary">
          <h3>Order summary</h3>
          <CartLines compact />
          <PromoForm />
          <Summary cart={cart} shipping={shipping} />
        </aside>
      </div>
    </div>
  );
}

function Field({ label, ...props }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}
