import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { api } from '../api';
import { useCart } from '../cart';
import type { MenuItem } from '../types';

const ANNOUNCEMENT = 'Free U.S. ground shipping on orders over $50 — no coupon code needed';

export function Header() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState('');
  const { cart, openDrawer } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { api.menu().then(setMenu).catch(() => setMenu([])); }, []);
  useEffect(() => { setOpen(null); setMobileOpen(false); }, [location.pathname, location.search]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="site-header">
      <div className="announce">{ANNOUNCEMENT}</div>
      <div className="masthead container">
        <button className="icon-btn masthead__burger" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>☰</button>
        <Link to="/" className="logo" aria-label="Vegas Clubwear home">
          VEGAS<span>CLUBWEAR</span>
        </Link>
        <form className="search" role="search" onSubmit={submit}>
          <input type="search" placeholder="Search dresses, heels, costumes…" value={q} onChange={(e) => setQ(e.target.value)}
            aria-label="Search products" />
          <button type="submit" aria-label="Search">⌕</button>
        </form>
        <button className="cart-btn" onClick={openDrawer} aria-label="Open cart">
          <span aria-hidden>🛍</span>
          <span>Bag</span>
          {!!cart?.itemCount && <span className="cart-btn__count">{cart.itemCount}</span>}
        </button>
      </div>
      <nav className={`mainnav${mobileOpen ? ' is-open' : ''}`} aria-label="Main" onMouseLeave={() => setOpen(null)}>
        <ul className="container mainnav__list">
          {menu.map((m) => (
            <li key={m.label} className="mainnav__item" onMouseEnter={() => setOpen(m.items?.length ? m.label : null)}>
              <NavLink to={`/collections/${m.slug}`} className="mainnav__link">{m.label}</NavLink>
              {m.items?.length ? (
                <button className="mainnav__toggle" aria-label={`Show ${m.label} menu`}
                  onClick={() => setOpen(open === m.label ? null : m.label)}>{open === m.label ? '−' : '+'}</button>
              ) : null}
              {open === m.label && m.items?.length ? (
                <div className="mega">
                  <div className="container mega__grid">
                    {m.items.map((group) => (
                      <div key={group.label} className="mega__col">
                        <Link to={`/collections/${group.slug}`} className="mega__head">{group.label}</Link>
                        {group.items?.map((leaf) => (
                          <Link key={leaf.label} to={`/collections/${leaf.slug}`} className="mega__link">{leaf.label}</Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
