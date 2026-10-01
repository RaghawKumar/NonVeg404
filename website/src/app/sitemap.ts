import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nonveg404.dev';

  const routes = [
    '',
    '/menu',
    '/about',
    '/gallery',
    '/offers',
    '/reservations',
    '/contact',
    '/cart',
    '/checkout',
    '/track-order',
    '/privacy-policy',
    '/terms-and-conditions',
    '/refund-policy',
    '/cancellation-policy',
    '/delivery-policy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/menu' || route === '/offers' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/menu' ? 0.9 : 0.7,
  }));
}
