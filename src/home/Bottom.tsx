import { credentials, record, settings, socials, UPWORK } from '../data/content';
import { BlogList } from '../BlogList';
import { Arrow, ExtLink } from './bits';

// Everything below the interactive lander scene.
export default function Bottom() {
  return (
    <div className="page">
      <div className="page-inner">
        <section id="writing" className="split writing">
          <h2 className="section-title">Writing</h2>
          <BlogList />
        </section>

        {settings.showRecord && (
          <section id="record" className="split record">
            <h2 className="section-title">Track record</h2>
            <div>
              <p className="section-lead">Enterprise software support and development, plus everything I've built on my own time. The short version:</p>
              <div className="rows">
                {record.map((r) => (
                  <div className="row" key={r.when}>
                    <div className="row-when">{r.when}</div>
                    <div>
                      <div className="row-title">{r.title}</div>
                      <div className="row-text">{r.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="credentials" className="split credentials">
          <h2 className="section-title">Certifications</h2>
          <div>
            <p className="section-lead">Coursework I took on purpose, not for the badge — though the badges are verifiable.</p>
            <div className="rows">
              {credentials.map((c) => (
                <div className="row" key={c.title}>
                  <div className="row-when">{c.when}</div>
                  <div>
                    <div className="row-title">{c.title}</div>
                    <div className="row-text">{c.text}</div>
                  </div>
                  <ExtLink className="label-strong" href={c.href}>{c.cta}</ExtLink>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="eyebrow">Contact</div>
          <h2>If you have a problem worth solving, I'd like to hear about it.</h2>
          <ExtLink className="cta" href={UPWORK}>
            <span>Work with me on Upwork</span><Arrow size={18} />
          </ExtLink>
        </section>

        <footer className="site-footer">
          <div className="eyebrow">Raditya Perdhevi · Surabaya, Indonesia</div>
          <div className="links">
            {socials.map((s) => <ExtLink key={s.label} className="label-strong" href={s.href}>{s.label}</ExtLink>)}
          </div>
        </footer>
      </div>
    </div>
  );
}
