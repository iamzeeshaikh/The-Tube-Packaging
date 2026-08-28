/*
 * The article template.
 *
 * Articles carry the same components as the resource pages -- direct answer,
 * question H2s, tables, decision tables, diagrams, limitations, dates, sources,
 * related products, FAQs and schema -- so a reader who arrives on an article
 * from search meets the same shape as a reader who arrives on a pillar page.
 *
 * They differ in two ways: the schema type is BlogPosting rather than Article,
 * and they appear in the guides archive alongside the posts migrated from
 * WordPress.
 */
import { renderResource, SITE } from './resource-page.js';

export { renderResource };

export function blogSchema(copy) {
  const url = SITE + copy.route;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url + '#article',
    headline: copy.h1,
    description: copy.description,
    inLanguage: 'en-US',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: copy.published,
    dateModified: copy.updated,
    author: { '@type': 'Organization', name: 'The Tube Packaging', url: SITE + '/' },
    publisher: { '@type': 'Organization', name: 'The Tube Packaging', url: SITE + '/' },
    articleSection: copy.section,
    about: copy.about,
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.ttp-res__answer'] },
  };
  if (copy.reviewer) data.reviewedBy = { '@type': 'Person', name: copy.reviewer };
  if (copy.citations) data.citation = copy.citations.map((c) => c.url);
  if (copy.image) data.image = copy.image;
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}
