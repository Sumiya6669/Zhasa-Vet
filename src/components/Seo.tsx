import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'ZhasaVet';
const SITE_URL = 'https://zhasavet.kz';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

interface SeoProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article';
  robots?: string;
  jsonLd?: JsonLd;
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }

  tag.setAttribute('href', href);
}

export default function Seo({
  title,
  description,
  keywords,
  canonicalPath,
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index,follow,max-image-preview:large',
  jsonLd,
}: SeoProps) {
  const location = useLocation();

  useEffect(() => {
    const resolvedPath = canonicalPath ?? location.pathname;
    const canonicalUrl = new URL(resolvedPath, SITE_URL).toString();
    const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    document.title = pageTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    if (keywords) {
      upsertMeta('name', 'keywords', keywords);
    }

    upsertMeta('property', 'og:locale', 'ru_RU');
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', image);
    upsertLink('canonical', canonicalUrl);

    const existingJsonLd = document.head.querySelector<HTMLScriptElement>(
      'script[data-seo-jsonld="true"]',
    );

    if (!jsonLd) {
      existingJsonLd?.remove();
      return;
    }

    const script = existingJsonLd ?? document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seoJsonld = 'true';
    script.textContent = JSON.stringify(jsonLd);

    if (!existingJsonLd) {
      document.head.appendChild(script);
    }
  }, [canonicalPath, description, image, jsonLd, keywords, location.pathname, robots, title, type]);

  return null;
}
