import { notFound } from 'next/navigation';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';
import CareerOpportunityForm from '@/components/admin/CareerOpportunityForm';
import { prisma } from '@/lib/prisma';

export default async function EditCareerPage({ params }: { params: { id: string } }) {
    const opportunity = await prisma.careerOpportunity.findUnique({ where: { id: params.id } });
    if (!opportunity) notFound();

    return (
        <div>
            <AdminPageHeader title="Edit opportunity" description={opportunity.title} />
            <CareerOpportunityForm
                initialData={{
                    ...opportunity,
                    deadline: opportunity.deadline?.toISOString() || null,
                    startDate: opportunity.startDate?.toISOString() || null,
                    endDate: opportunity.endDate?.toISOString() || null,
                }}
            />
        </div>
    );
}
