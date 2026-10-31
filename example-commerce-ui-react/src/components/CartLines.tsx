import { Link } from 'react-router';
import { useCart } from '../cart';
import { money } from '../format';
import { ProductImage } from './ProductImage';

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { cart, update, remove, busy, closeDrawer } = useCart();
  if (!cart) return null;
  return (
    <ul className={`lines${compact ? ' lines--compact' : ''}`}>
      {cart.items.map((l) => (
        <li key={l.id} className="line">
          <Link to={`/products/${l.slug}`} onClick={closeDrawer} className="line__img">
            <ProductImage imageKey={l.imageKey} color={l.colorHex} size="thumb" label={l.name} />
          </Link>
          <div className="line__info">
            <Link to={`/products/${l.slug}`} onClick={closeDrawer} className="line__name">{l.name}</Link>
            <div className="muted small">{l.color} · Size {l.size}</div>
            <div className="line__controls">
              <div className="qty">
                <button disabled={busy} onClick={() => update(l.id, l.quantity - 1)} aria-label="Decrease quantity">−</button>
                <span>{l.quantity}</span>
                <button disabled={busy || l.quantity >= Math.min(20, l.available)} onClick={() => update(l.id, l.quantity + 1)}
                  aria-label="Increase quantity">+</button>
              </div>
              <button className="link-btn" disabled={busy} onClick={() => remove(l.id)}>Remove</button>
            </div>
          </div>
          <div className="line__price">
            <strong>{money(l.lineTotal)}</strong>
            {l.quantity > 1 && <span className="muted small">{money(l.unitPrice)} each</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}
