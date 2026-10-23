import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { OgBrandedImage } from '@/lib/og-image';

export const alt = 'EGP Ghana publication';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const article = await prisma.article.findUnique({
        where: { slug: params.slug },
        include: { category: true },
    });

    if (!article) {
        notFound();
    }

    return OgBrandedImage({
        title: article.title,
        subtitle: article.category?.name || 'Publications & insights',
    });
}
