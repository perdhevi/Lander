import { ReactNode, useEffect, useState } from 'react';
import { collection, collectionIntro, CollectionItem } from '../data/collection';
import { Arrow, ExtLink, SiteFooter, SiteHeader } from '../home/bits';

const SITE = 'Raditya Perdhevi';

// Minimal hash router: "/collection/" is the index, "/collection/#/<slug>" is a sub-page.
// Hash URLs need no server rewrite rules, so this works on plain static hosting.
const currentSlug = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, '')).replace(/\/+$/, '');

function useSlug() {
  const [slug, setSlug] = useState(currentSlug);
  useEffect(() => {
    const onChange = () => setSlug(currentSlug());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return slug;
}

function Link({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  return <a className={className} href={`#${to}`}>{children}</a>;
}

// Standalone pages are plain links; text sub-pages go through the hash router.
function ItemLink({ item, className, children }: { item: CollectionItem; className?: string; children: ReactNode }) {
  return item.href
    ? <a className={className} href={item.href}>{children}</a>
    : <Link className={className} to={`/${item.slug}`}>{children}</Link>;
}

function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
    window.scrollTo(0, 0);
  }, [title]);
}

function Index() {
  useTitle(`${collectionIntro.title} · ${SITE}`);
  return (
    <>
      <section className="collection-hero">
        <div className="eyebrow">{SITE}</div>
        <h1>{collectionIntro.title}</h1>
        <p>{collectionIntro.lead}</p>
      </section>

      <section className="shelf collection-cards">
        <div className="grid">
          {collection.map((item) => (
            <article key={item.slug}>
              <div className="kicker">{item.kicker}</div>
              <h3><ItemLink item={item}>{item.title}</ItemLink></h3>
              <p>{item.summary}</p>
              <div className="links">
                <ItemLink item={item} className="label-strong">{item.href ? 'Open →' : 'Read more →'}</ItemLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Item({ slug }: { slug: string }) {
  const item = collection.find((c) => c.slug === slug);
  useTitle(item ? `${item.title} · ${collectionIntro.title} · ${SITE}` : `Not found · ${SITE}`);

  if (!item) {
    return (
      <section className="collection-item">
        <Link className="label-strong back" to="/">← Collection</Link>
        <h1>Not found</h1>
        <p>There is no entry called “{slug}”.</p>
      </section>
    );
  }

  return (
    <section className="collection-item">
      <Link className="label-strong back" to="/">← Collection</Link>
      <div className="kicker">{item.kicker}</div>
      <h1>{item.title}</h1>
      {item.body.map((p, i) => <p key={i}>{p}</p>)}
      {item.links && item.links.length > 0 && (
        <div className="item-links">
          {item.links.map((l) => (
            <ExtLink key={l.href} className="btn btn-secondary" href={l.href}>
              <span>{l.label}</span><Arrow size={16} />
            </ExtLink>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Collection() {
  const slug = useSlug();
  return (
    <div className="page">
      <div className="page-inner">
        <SiteHeader onHome={false} />
        {slug === '' ? <Index /> : <Item slug={slug} />}
        <SiteFooter />
      </div>
    </div>
  );
}
