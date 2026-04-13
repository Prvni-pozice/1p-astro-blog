import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(_context: APIContext): Promise<Response> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const site = 'https://geo.prvni-pozice.com';

  const staticPages = [
    { url: `${site}/`, priority: '1.0', changefreq: 'weekly' },
    { url: `${site}/ai/`, priority: '0.9', changefreq: 'weekly' },
    { url: `${site}/geo/`, priority: '0.9', changefreq: 'weekly' },
  ];

  const postPages = posts.map(post => ({
    url: `${site}/blog/${post.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString().split('T')[0],
  }));

  const allPages = [...staticPages, ...postPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${p.url}</loc>
    ${'lastmod' in p ? `<lastmod>${p.lastmod}</lastmod>\n    ` : ''}<changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
