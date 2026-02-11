import { prisma } from '@/lib/prisma';
import ArticleForm from '@/components/admin/ArticleForm';
import { notFound } from 'next/navigation';

export default async function EditPublicationPage({ params }: { params: { id: string } }) {
    const article = await prisma.article.findUnique({
        where: { id: params.id },
    });

    if (!article) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <ArticleForm
                initialData={{
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    content: article.content,
                    excerpt: article.excerpt || undefined,
                    categoryId: article.categoryId,
                    imageUrl: article.imageUrl || undefined,
                    publishedAt: article.publishedAt ? article.publishedAt.toISOString() : undefined,
                    featured: article.featured,
                    tags: article.tags
                }}
                isEditing={true}
            />
        </div>
    );
}
