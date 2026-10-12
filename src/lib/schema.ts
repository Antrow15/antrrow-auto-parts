import { site } from '@/data/site';

type Json = Record<string, unknown>;

const abs = (path: string) => new URL(path, site.url).toString();

export const orgId = `${site.url}/#organization`;
export const websiteId = `${site.url}/#website`;

export function organizationSchema(logoUrl: string): Json {
  return {
    '@type': ['Organization', 'LocalBusiness', 'Manufacturer'],
    '@id': orgId,
    name: site.name,
    legalName: site.legalName,
    alternateName: site.tagline,
    description: site.shortDescription,
    url: site.url,
    logo: { '@type': 'ImageObject', url: abs(logoUrl) },
    image: abs('/og/default.jpg'),
    email: site.email,
    telephone: site.phones.mobile.tel,
    taxID: site.gstin,
    priceRange: 'On request',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: site.workforce },
    employee: {
      '@type': 'Person',
      name: site.generalManager.name,
      jobTitle: site.generalManager.role,
      worksFor: { '@id': orgId },
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: `${site.address.locality}, ${site.address.city}`,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    hasMap: site.mapsUrl,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: site.hours.days,
      opens: site.hours.opens,
      closes: site.hours.closes,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        name: site.generalManager.name,
        telephone: site.phones.mobile.tel,
        email: site.email,
        areaServed: 'IN',
        availableLanguage: ['English', 'Tamil'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: site.phones.landline.tel,
        areaServed: 'IN',
        availableLanguage: ['English', 'Tamil'],
      },
    ],
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
    knowsAbout: [
      'CNC turning',
      'Polygon milling',
      'Centreless grinding',
      'Bar stock cutting',
      'Pillar drilling',
      'Clutch pins',
      'Bushes',
      'Levers',
      'Shafts and rods',
      'Piston rods',
      'Special bolts',
    ],
    slogan: 'Custom-Machined Components. Built to Your Drawing.',
  };
}

export function websiteSchema(): Json {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: site.url,
    name: site.name,
    description: site.shortDescription,
    inLanguage: site.language,
    publisher: { '@id': orgId },
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.href),
    })),
  };
}

export function faqSchema(faqs: readonly { q: string; a: string }[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  image: string;
  serviceType: string;
  offers?: string[];
}): Json {
  return {
    '@type': 'Service',
    '@id': `${abs(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: abs(opts.path),
    image: abs(opts.image),
    provider: { '@id': orgId },
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
    ...(opts.offers?.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: opts.name,
            itemListElement: opts.offers.map((o) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Product', name: o },
            })),
          },
        }
      : {}),
  };
}

export function itemListSchema(name: string, items: { name: string; href: string }[]): Json {
  return {
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: abs(item.href),
    })),
  };
}

export function webPageSchema(opts: {
  path: string;
  title: string;
  description: string;
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';
}): Json {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${abs(opts.path)}#webpage`,
    url: abs(opts.path),
    name: opts.title,
    description: opts.description,
    inLanguage: site.language,
    isPartOf: { '@id': websiteId },
    about: { '@id': orgId },
  };
}

export function graph(...nodes: Json[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(
    /</g,
    '\\u003c',
  );
}
