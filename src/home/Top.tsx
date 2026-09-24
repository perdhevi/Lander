import { hero, nav, now, settings, shelf, stats, GITHUB, UPWORK } from '../data/content';
import { Arrow, ExtLink } from './bits';

// Everything above the interactive lander scene.
export default function Top() {
  return (
    <div className="page">
      <div className="page-inner">
        <header className="site-header">
          <div className="brand">Raditya Perdhevi</div>
          <nav>
            {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
        </header>

        <section className="hero">
          <div className="hero-meta">
            {settings.available && <span className="tag tag-accent">Open to collaboration</span>}
            <span className="eyebrow">{hero.location}</span>
          </div>
          <h1>{hero.headline[0]}<br />{hero.headline[1]}</h1>
          <p>{hero.lead}</p>
          <p className="muted">{hero.sub}</p>
          <div className="actions">
            <ExtLink className="btn btn-primary" href={UPWORK}>
              <span>Let's build something</span><Arrow size={16} />
            </ExtLink>
            <ExtLink className="btn btn-secondary" href={GITHUB}>See the code</ExtLink>
          </div>
        </section>

        <section className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className={s.accent ? 'value accent' : 'value'}>{s.value}</div>
              <div className="eyebrow">{s.label}</div>
            </div>
          ))}
        </section>

        <section id="now" className="split now">
          <h2 className="section-title">Now</h2>
          <div className="rows">
            {now.map((r) => (
              <div className="row" key={r.label}>
                <div className="label-strong">{r.label}</div>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="shelf" className="shelf">
          <div className="shelf-head">
            <h2 className="section-title">The shelf</h2>
            <p>Things I built to understand something. Some shipped, some are still wet paint.</p>
          </div>
          <div className="grid">
            {shelf.map((item) => (
              <article key={item.title} className={item.highlight ? 'highlight' : undefined}>
                <div className="kicker">{item.kicker}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {item.links.length > 0 && (
                  <div className="links">
                    {item.links.map((l) => l.external
                      ? <ExtLink key={l.href} className="label-strong" href={l.href}>{l.label}</ExtLink>
                      : <a key={l.href} className="label-strong" href={l.href}>{l.label}</a>)}
                  </div>
                )}
                {item.badge && <span className="label-strong links">{item.badge}</span>}
              </article>
            ))}
          </div>
        </section>

        <section id="lander" className="lander-intro">
          <h2 className="section-title">Lander</h2>
          <p>
            A small interactive piece I built with Three.js: a stranded astronaut and a planet to explore.
            Click the keyboard to start, then follow the prompts on screen.
          </p>
        </section>
      </div>
    </div>
  );
}
