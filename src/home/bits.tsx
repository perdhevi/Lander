import { ReactNode } from 'react';
import { nav, socials } from '../data/content';

export function Arrow({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2.5} strokeLinecap="square" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ExtLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
}

// Shared by the home page and the Collection pages.
export function SiteHeader({ onHome = true }: { onHome?: boolean }) {
  // Nav hrefs like "#now" are anchors on the home page; from other pages they must point back to "/".
  const href = (h: string) => (onHome || !h.startsWith('#') ? h : `/${h}`);
  return (
    <header className="site-header">
      {onHome ? <div className="brand">Raditya Perdhevi</div> : <a className="brand" href="/">Raditya Perdhevi</a>}
      <nav>
        {nav.map((n) => <a key={n.href} href={href(n.href)}>{n.label}</a>)}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="eyebrow">Raditya Perdhevi · Surabaya, Indonesia</div>
      <div className="links">
        {socials.map((s) => <ExtLink key={s.label} className="label-strong" href={s.href}>{s.label}</ExtLink>)}
      </div>
    </footer>
  );
}
