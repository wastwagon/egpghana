import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { OgBrandedImage } from '@/lib/og-image';

export const alt = 'EGP Ghana program';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const program = await prisma.program.findUnique({ where: { slug: params.slug } });
    if (!program) notFound();

    return OgBrandedImage({
        title: program.title,
        subtitle: program.description?.slice(0, 140) || 'Program initiative',
    });
}
