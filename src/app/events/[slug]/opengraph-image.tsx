import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { OgBrandedImage } from '@/lib/og-image';

export const alt = 'EGP Ghana event';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const event = await prisma.event.findUnique({ where: { slug: params.slug } });
    if (!event) notFound();

    const date = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(event.startDate);

    return OgBrandedImage({
        title: event.title,
        subtitle: `${date}${event.location ? ` · ${event.location}` : ''}`,
    });
}
