import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { api } from '../api';
import { ProductImage } from '../components/ProductImage';
import { money } from '../format';
import { useAsync, useDocumentTitle } from '../hooks';
import { ErrorState, Loading } from './states';

export function OrderPage() {
  const { orderNumber = '' } = useParams();
  const [sp] = useSearchParams();
  const email = sp.get('email') ?? undefined;
  const { data: o, error, loading } = useAsync(() => api.order(orderNumber, email), [orderNumber, email]);
  useDocumentTitle(`Order ${orderNumber}`);
  if (loading) return <Loading />;
  if (error || !o) return <ErrorState error={error} />;
  const a = o.shippingAddress;
  return (
    <div className="container order">
      {sp.get('placed') && <div className="order__thanks"><h1>Thank you! 🎉</h1><p>Your order is confirmed. A receipt is on its way to {o.email}.</p></div>}
      <h2>Order {o.orderNumber}</h2>
      <p className="muted">Placed {new Date(o.createdAt).toLocaleString()} · Status: <strong>{o.status}</strong></p>
      <div className="order__grid">
        <ul className="lines">
          {o.items.map((i) => (
            <li key={`${i.productId}-${i.color}-${i.size}`} className="line">
              <Link to={`/products/${i.slug}`} className="line__img"><ProductImage imageKey={i.imageKey} size="thumb" /></Link>
              <div className="line__info">
                <Link to={`/products/${i.slug}`} className="line__name">{i.name}</Link>
                <div className="muted small">{i.color} · Size {i.size} · Qty {i.quantity}</div>
              </div>
              <div className="line__price"><strong>{money(i.lineTotal)}</strong></div>
            </li>
          ))}
        </ul>
        <aside className="summary">
          <dl className="totals">
            <div><dt>Subtotal</dt><dd>{money(o.subtotal)}</dd></div>
            {o.discount > 0 && <div className="totals__discount"><dt>Promo {o.promoCode}</dt><dd>−{money(o.discount)}</dd></div>}
            <div><dt>Shipping ({o.shippingMethod})</dt><dd>{o.shipping === 0 ? 'FREE' : money(o.shipping)}</dd></div>
            <div><dt>Tax</dt><dd>{money(o.tax)}</dd></div>
            <div className="totals__total"><dt>Total</dt><dd>{money(o.total)}</dd></div>
          </dl>
          <h4>Ship to</h4>
          <p>{a.firstName} {a.lastName}<br />{a.address1}{a.address2 ? <>, {a.address2}</> : null}<br />{a.city}, {a.state} {a.postalCode}</p>
          <h4>Payment</h4>
          <p className="caps">{o.cardBrand} •••• {o.cardLast4}</p>
          <Link to="/" className="btn btn--pink btn--block">Keep shopping</Link>
        </aside>
      </div>
    </div>
  );
}

export function OrderLookupPage() {
  useDocumentTitle('Order Status');
  const navigate = useNavigate();
  const [num, setNum] = useState('');
  const [email, setEmail] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); navigate(`/orders/${num.trim()}?email=${encodeURIComponent(email.trim())}`); };
  return (
    <div className="container narrow">
      <h1>Order status</h1>
      <form onSubmit={submit} className="checkout__form">
        <label className="field"><span>Order number</span><input required value={num} onChange={(e) => setNum(e.target.value)} placeholder="VC12345678" /></label>
        <label className="field"><span>Email</span><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <button className="btn btn--pink">Find my order</button>
      </form>
    </div>
  );
}
