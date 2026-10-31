import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { api } from '../api';

export function Footer() {
  const [service, setService] = useState<string>('…');
  const [joined, setJoined] = useState(false);
  useEffect(() => { api.health().then((h) => setService(h.service)).catch(() => setService('unavailable')); }, []);
  const join = (e: FormEvent) => { e.preventDefault(); setJoined(true); };

  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div>
          <div className="logo logo--footer">VEGAS<span>CLUBWEAR</span></div>
          <p className="muted">Club dresses, platform heels, swimwear, lingerie and costumes — styled for the Strip since 2009.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/collections/just-in">New Arrivals</Link>
          <Link to="/collections/sexy-dresses">Dresses</Link>
          <Link to="/collections/shoes">Shoes</Link>
          <Link to="/collections/costumes">Costumes</Link>
          <Link to="/collections/clearance">Clearance</Link>
        </div>
        <div>
          <h4>Help</h4>
          <Link to="/cart">Your Bag</Link>
          <Link to="/orders/lookup">Order Status</Link>
          <span className="muted">Shipping: free over $50</span>
          <span className="muted">Returns within 30 days</span>
        </div>
        <div>
          <h4>Get 10% off</h4>
          {joined ? <p>You're on the list! Use code <strong>VEGAS10</strong>.</p> : (
            <form onSubmit={join} className="newsletter">
              <input type="email" required placeholder="Email address" aria-label="Email address" />
              <button className="btn btn--pink btn--sm">Join</button>
            </form>
          )}
        </div>
      </div>
      <div className="container footer__base">
        <span>© {new Date().getFullYear()} Vegas Clubwear — demo storefront</span>
        <span className="muted">API: {service}</span>
      </div>
    </footer>
  );
}
