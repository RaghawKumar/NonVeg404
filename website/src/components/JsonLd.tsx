import React from 'react';

export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Restaurant',
        '@id': 'https://nonveg404.dev/#restaurant',
        name: 'NON VEG 404',
        image: 'https://nonveg404.dev/logo.png',
        description: 'Modern developer-inspired non-vegetarian restaurant serving dum biryani, kebabs, tandoori grills, and gourmet burgers. Where hunger is never not found.',
        servesCuisine: ['Indian', 'Barbecue', 'Mughlai', 'Gourmet Non-Veg'],
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '404 Kernel Way, Silicon Grill District',
          addressLocality: 'Tech City',
          addressRegion: 'CA',
          postalCode: '94016',
          addressCountry: 'US',
        },
        telephone: '+1-555-404-MEAT',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '11:00',
            closes: '02:00',
          },
        ],
        hasMenu: 'https://nonveg404.dev/menu',
        acceptsReservations: 'True',
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://nonveg404.dev/#localbusiness',
        name: 'NON VEG 404',
        image: 'https://nonveg404.dev/logo.png',
        url: 'https://nonveg404.dev',
        telephone: '+1-555-404-MEAT',
        priceRange: '$$',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
