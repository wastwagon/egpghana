import { prisma } from '@/lib/prisma';
import EventForm from '@/components/admin/EventForm';
import { notFound } from 'next/navigation';

export default async function EditEventPage({ params }: { params: { id: string } }) {
    const event = await prisma.event.findUnique({
        where: { id: params.id },
    });

    if (!event) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <EventForm
                initialData={{
                    id: event.id,
                    title: event.title,
                    slug: event.slug,
                    description: event.description || '',
                    location: event.location || undefined,
                    startDate: event.startDate.toISOString(),
                    endDate: event.endDate ? event.endDate.toISOString() : undefined,
                    imageUrl: event.imageUrl || undefined,
                    featured: event.featured,
                }}
                isEditing={true}
            />
        </div>
    );
}
