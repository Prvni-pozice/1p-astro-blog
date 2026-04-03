import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) =>
    b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: 'První pozice Blog',
    description: 'Blog o AI, SEO a GEO od týmu První pozice.',
    site: context.site!,
    items: sorted.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
      categories: [post.data.category.toUpperCase()],
    })),
    customData: '<language>cs</language>',
    stylesheet: false,
  });
}
