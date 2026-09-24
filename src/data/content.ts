// All page copy lives here so it can be edited without touching layout code.
// Ported from design/Home.dc.html.

export const UPWORK = 'https://www.upwork.com/freelancers/~017c61ba92b2c4bb37';
export const GITHUB = 'https://github.com/perdhevi';
export const BLOG = 'https://blog.perdhevi.com';

export const settings = {
  available: true,   // "Open to collaboration" tag in the hero
  showRecord: true,  // Track record section
};

export const nav = [
  { href: '#now', label: 'Now' },
  { href: '#shelf', label: 'Shelf' },
  { href: '#lander', label: 'Lander' },
  { href: '#writing', label: 'Writing' },
  { href: '#record', label: 'Record' },
  { href: '#credentials', label: 'Certs' },
  { href: '#contact', label: 'Contact' },
];

export const hero = {
  location: 'Surabaya · Sidoarjo, East Java',
  headline: ['Full-time problem‑solver.', 'Part-time human.'],
  lead: 'Support architect, application developer and database troubleshooter — the person you call when the system is already on fire. JavaScript, C#, Swift and Delphi, learned one production problem at a time.',
  sub: "Now I'm pointing that same habit at AI: writing agents, wiring models into real tools, and shipping the results rather than talking about them. Two Google Professional Certificates in seven months, AWS machine learning foundations alongside, and no plans to stop.",
};

export const stats = [
  { value: '24', label: 'Public repositories' },
  { value: '4', label: 'Languages in production — JavaScript, C#, Swift, Delphi' },
  { value: 'AI‑first', label: 'How I work now', accent: true },
];

export const now = [
  { label: 'Building', text: 'Compiling a personal toolkit of AI utilities — small, sharp programs that take the tedious parts of my work off my desk. Rough today, useful tomorrow.' },
  { label: 'Learning', text: 'Agent architecture end to end: how models plan, where they break, and what it actually takes to trust one with a real task. I learn by wiring it up myself.' },
  { label: 'Open to', text: 'Collaboration with people who want to put AI to work on something concrete — freelance builds, prototypes, or a team that likes shipping.' },
];

export interface ShelfLink { href: string; label: string; external?: boolean }
export interface ShelfItem { kicker: string; title: string; body: string; links: ShelfLink[]; highlight?: boolean; badge?: string }

export const shelf: ShelfItem[] = [
  {
    kicker: 'Shipped · iOS & Android',
    title: 'Strike Shooter',
    body: 'An arcade space shooter built in Unity and C#, published solo on both stores — performance, progression, packaging and release, not just gameplay code.',
    links: [
      { href: 'https://apps.apple.com/id/app/strike-shooter/id6736962627', label: 'App Store →', external: true },
      { href: 'https://play.google.com/store/apps/details?id=com.perdhevi.shooter1', label: 'Google Play →', external: true },
    ],
  },
  {
    kicker: 'Shipped · iOS',
    title: 'QuickCalc',
    body: 'A quick-fire math game for iPhone, built in SwiftUI rather than UIKit — written to learn how the declarative framework really behaves once it ships.',
    links: [
      { href: 'https://apps.apple.com/id/app/calc-quick/id1558186528', label: 'App Store →', external: true },
    ],
  },
  {
    kicker: 'Certified · Data',
    title: 'Data analytics, twice over',
    body: 'Fifteen Google courses across two Professional Certificates — SQL, R, statistics, regression and machine learning, finished with capstone case studies.',
    links: [{ href: '#credentials', label: 'See credentials ↓' }],
  },
  {
    kicker: 'Open source',
    title: '24 repositories',
    body: 'Experiments, utilities and half-finished ideas, kept in the open. The commit history is the honest version of my CV.',
    links: [{ href: GITHUB, label: 'github.com/perdhevi →', external: true }],
  },
  {
    kicker: 'In progress',
    title: 'AI toolkit',
    body: "The current obsession: a set of AI tools I'm assembling for my own workflow. Shipping them one at a time — this slot gets a name soon.",
    links: [],
    badge: 'Wet paint',
    highlight: true,
  },
];

export const record = [
  { when: 'Next', title: 'Choosing the next team', text: 'Open to a full-time or contract role where AI gets put to work on real systems. Picking for fit, not speed.' },
  { when: 'Recent', title: 'Level 2 Support Architect — Versata', text: 'Diagnosed and fixed enterprise applications in production, where the answer was never in the documentation.' },
  { when: 'Craft', title: 'Application developer & database administrator', text: 'JavaScript, C#, Swift and Object Pascal (Delphi) — helping teams get more out of the software they already run.' },
  { when: 'Own time', title: 'Games, tools and open source', text: 'Two solo-published mobile games and twenty-four public repositories — my standing apprenticeship.' },
  { when: 'Education', title: 'Sekolah Tinggi Teknik Surabaya', text: 'Where the formal part ended and the self-taught part took over.' },
];

export const credentials = [
  { when: 'Feb 2025', title: 'Google Advanced Data Analytics', text: 'Professional Certificate, seven courses — machine learning, predictive modeling and statistics on large datasets.', href: 'https://coursera.org/verify/professional-cert/BEEU40271UAF', cta: 'Verify →' },
  { when: 'Jul 2024', title: 'Google Data Analytics', text: 'Professional Certificate, eight courses — SQL, R, Tableau and spreadsheets, end to end from dirty data to decision.', href: 'https://coursera.org/verify/professional-cert/A6JLAUKC8VTC', cta: 'Verify →' },
  { when: 'Udacity', title: 'AWS Machine Learning Foundations', text: "The groundwork under everything I'm building with AI now.", href: 'https://www.udacity.com/certificate/GE6S5FDJ', cta: 'Verify →' },
  { when: 'Credly', title: 'Badge collection', text: 'Every verified credential in one place, on Credly.', href: 'https://www.credly.com/users/raditya-perdhevi/badges', cta: 'Credly →' },
];

export const socials = [
  { href: 'https://www.linkedin.com/in/raditya-perdhevi', label: 'LinkedIn' },
  { href: GITHUB, label: 'GitHub' },
  { href: 'https://x.com/perdhevi', label: 'X' },
  { href: BLOG, label: 'Blog' },
  { href: UPWORK, label: 'Upwork' },
];
