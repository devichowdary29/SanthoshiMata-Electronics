import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://santhoshimata-electronics.vercel.app'; // Replace with actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes
    const staticRoutes = [
        '',
        '/products',
        '/contact',
        '/login',
        '/cart',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Dynamic Product Routes
    const { data: products } = await supabase
        .from('products')
        .select('id, updated_at');

    const productRoutes = products?.map((product) => ({
        url: `${BASE_URL}/products/${product.id}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    })) || [];

    return [...staticRoutes, ...productRoutes];
}
