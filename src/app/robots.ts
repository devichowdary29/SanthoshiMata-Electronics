import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/private/'],
        },
        sitemap: 'https://santhoshimata-electronics.vercel.app/sitemap.xml', // Replace with actual domain
    };
}
