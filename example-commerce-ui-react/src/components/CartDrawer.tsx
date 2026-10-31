import { useEffect } from 'react';
import { Link } from 'react-router';
import { useCart } from '../cart';
import { money } from '../format';
import { CartLines } from './CartLines';

export function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, error } = useCart();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawer();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeDrawer]);

  return (
    <>
      <div className={`scrim${drawerOpen ? ' is-open' : ''}`} onClick={closeDrawer} />
      <aside className={`drawer${drawerOpen ? ' is-open' : ''}`} aria-hidden={!drawerOpen} aria-label="Shopping bag">
        <div className="drawer__head">
          <h3>Your Bag {cart?.itemCount ? `(${cart.itemCount})` : ''}</h3>
          <button className="icon-btn" onClick={closeDrawer} aria-label="Close">✕</button>
        </div>
        {error && <div className="alert">{error}</div>}
        {!cart || cart.items.length === 0 ? (
          <div className="drawer__empty">
            <p>Your bag is empty.</p>
            <Link to="/collections/just-in" className="btn btn--pink" onClick={closeDrawer}>Shop new arrivals</Link>
          </div>
        ) : (
          <>
            <div className="drawer__body"><CartLines compact /></div>
            <div className="drawer__foot">
              {cart.freeShippingRemaining > 0
                ? <p className="ship-note">You're {money(cart.freeShippingRemaining)} away from free shipping</p>
                : <p className="ship-note ship-note--ok">You've unlocked free shipping!</p>}
              <div className="row-between"><span>Subtotal</span><strong>{money(cart.subtotal)}</strong></div>
              <Link to="/checkout" className="btn btn--pink btn--block" onClick={closeDrawer}>Checkout</Link>
              <Link to="/cart" className="btn btn--ghost btn--block" onClick={closeDrawer}>View bag</Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
