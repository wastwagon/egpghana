import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';
import CareerOpportunityForm from '@/components/admin/CareerOpportunityForm';

export default function NewCareerPage() {
    return (
        <div>
            <AdminPageHeader title="New career opportunity" description="Create a consultancy or job posting." />
            <CareerOpportunityForm />
        </div>
    );
}
