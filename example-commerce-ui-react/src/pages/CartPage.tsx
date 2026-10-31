import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { useCart } from '../cart';
import { CartLines } from '../components/CartLines';
import { money } from '../format';
import { useDocumentTitle } from '../hooks';
import type { Cart } from '../types';
import { Loading } from './states';

export function CartPage() {
  useDocumentTitle('Your Bag');
  const { cart, restoring, error } = useCart();
  if (restoring) return <Loading />;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container state">
        <h1>Your bag is empty</h1>
        <Link to="/collections/just-in" className="btn btn--pink">Shop new arrivals</Link>
      </div>
    );
  }
  return (
    <div className="container cart-page">
      <h1>Your Bag</h1>
      {error && <div className="alert">{error}</div>}
      <div className="cart-page__grid">
        <CartLines />
        <aside className="summary">
          <Summary cart={cart} />
          <PromoForm />
          <Link to="/checkout" className="btn btn--pink btn--block">Checkout</Link>
          <Link to="/" className="btn btn--ghost btn--block">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}

export function Summary({ cart, shipping }: { cart: Cart; shipping?: number }) {
  const ship = shipping ?? cart.shipping;
  const total = shipping === undefined ? cart.total : cart.total - cart.shipping + shipping;
  return (
    <dl className="totals">
      <div><dt>Subtotal ({cart.itemCount} items)</dt><dd>{money(cart.subtotal)}</dd></div>
      {cart.discount > 0 && <div className="totals__discount"><dt>Promo {cart.promoCode}</dt><dd>−{money(cart.discount)}</dd></div>}
      <div><dt>Shipping</dt><dd>{ship === 0 ? 'FREE' : money(ship)}</dd></div>
      <div><dt>Estimated tax</dt><dd>{money(cart.tax)}</dd></div>
      <div className="totals__total"><dt>Total</dt><dd>{money(total)}</dd></div>
    </dl>
  );
}

export function PromoForm() {
  const { cart, applyPromo, removePromo, busy } = useCart();
  const [code, setCode] = useState('');
  if (!cart) return null;
  if (cart.promoCode) {
    return (
      <div className="promo promo--applied">
        <span><strong>{cart.promoCode}</strong> — {cart.promoDescription}
          {cart.discount === 0 && <em className="muted small"> (not eligible yet)</em>}</span>
        <button className="link-btn" disabled={busy} onClick={removePromo}>Remove</button>
      </div>
    );
  }
  const submit = async (e: FormEvent) => { e.preventDefault(); if (code && (await applyPromo(code))) setCode(''); };
  return (
    <form className="promo" onSubmit={submit}>
      <input placeholder="Promo code" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Promo code" />
      <button className="btn btn--ghost btn--sm" disabled={busy || !code}>Apply</button>
    </form>
  );
}
