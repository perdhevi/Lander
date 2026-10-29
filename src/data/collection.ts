// The Collection: one card on /collection/ and one sub-page at /collection/#/<slug> per entry.
//
// Two ways to add a sub-page:
//  1. A standalone HTML page: drop it in public/collection/<slug>/index.html and add an entry with
//     `href: '/collection/<slug>/'`. The card links straight to it.
//  2. A simple text page: leave `href` out and fill in `body`; it renders at /collection/#/<slug>.

export interface CollectionLink { href: string; label: string }

export interface CollectionItem {
  slug: string;          // lowercase-with-dashes; also the folder name for standalone pages
  title: string;
  kicker: string;        // small label above the title, e.g. "Shipped · iOS"
  summary: string;       // text on the card in the index
  href?: string;         // standalone page to open instead of a text sub-page
  body: string[];        // paragraphs on the text sub-page (unused when href is set)
  links?: CollectionLink[];
}

export const collectionIntro = {
  title: 'Collection',
  lead: 'Interactive explainers and other odds and ends that did not fit anywhere else.',
};

export const collection: CollectionItem[] = [
  {
    slug: 'neurons-to-attention',
    title: 'From one neuron to attention',
    kicker: 'Interactive · AI explainer',
    summary: 'Six stages from a single neuron to next-token sampling, with live sliders and real arithmetic.',
    href: '/collection/neurons-to-attention/',
    body: [],
  },
];
