import { Link } from 'react-router';
import type { Crumb } from '../types';

export function Breadcrumbs({ crumbs, current }: { crumbs: Crumb[]; current?: string }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {crumbs.map((c, i) => (
        <span key={c.slug}>
          <span aria-hidden> / </span>
          {i === crumbs.length - 1 && !current ? <span>{c.name}</span> : <Link to={`/collections/${c.slug}`}>{c.name}</Link>}
        </span>
      ))}
      {current && <span><span aria-hidden> / </span><span>{current}</span></span>}
    </nav>
  );
}
