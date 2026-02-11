import { prisma } from '@/lib/prisma';
import ResourceForm from '@/components/admin/ResourceForm';
import { notFound } from 'next/navigation';

export default async function EditResourcePage({ params }: { params: { id: string } }) {
    const resource = await prisma.resource.findUnique({
        where: { id: params.id },
    });

    if (!resource) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <ResourceForm
                initialData={{
                    id: resource.id,
                    title: resource.title,
                    description: resource.description || undefined,
                    fileUrl: resource.fileUrl,
                    fileName: resource.fileName,
                    fileType: resource.fileType,
                    fileSize: resource.fileSize,
                    category: resource.category,
                    publishedAt: resource.publishedAt.toISOString(),
                    featured: resource.featured,
                    tags: resource.tags
                }}
                isEditing={true}
            />
        </div>
    );
}
