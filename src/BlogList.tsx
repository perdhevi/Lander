import { useEffect, useState } from 'react';
import { BLOG } from './data/content';

// Latest posts from the WordPress blog at blog.perdhevi.com.
interface Post {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
}

const FEED = `${BLOG}/wp-json/wp/v2/posts?per_page=3&_fields=id,date,link,title,excerpt`;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

// WordPress returns HTML; strip it so the excerpt sits in our own type styles.
const toText = (html: string) => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return (el.textContent ?? '').replace(/\s*\[(…|&hellip;|\.\.\.)\]\s*$/, '…').trim();
};

export function BlogList() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(FEED)
      .then((res) => { if (!res.ok) throw new Error(String(res.status)); return res.json(); })
      .then((data: Post[]) => { if (alive) setPosts(data); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, []);

  return (
    <div>
      <p className="section-lead">Notes from whatever I'm figuring out at the moment, published on my blog.</p>
      {failed ? (
        <p className="row-text">The feed didn't load. Read the posts directly on the blog.</p>
      ) : posts === null ? (
        <p className="row-text">Loading recent posts…</p>
      ) : (
        <div className="rows">
          {posts.map((p) => (
            <div className="row" key={p.id}>
              <div className="row-when">{fmtDate(p.date)}</div>
              <div>
                <div className="row-title">
                  <a href={p.link} target="_blank" rel="noopener noreferrer">{toText(p.title.rendered)}</a>
                </div>
                <div className="row-text"><p>{toText(p.excerpt.rendered)}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
      <a className="label-strong more" href={BLOG} target="_blank" rel="noopener noreferrer">All posts on the blog →</a>
    </div>
  );
}
