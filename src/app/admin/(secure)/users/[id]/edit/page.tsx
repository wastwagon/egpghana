import { prisma } from '@/lib/prisma';
import UserForm from '@/components/admin/UserForm';
import { notFound } from 'next/navigation';

export default async function EditUserPage({ params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: params.id },
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <UserForm
                initialData={{
                    id: user.id,
                    name: user.name || '',
                    email: user.email,
                    role: user.role,
                    active: user.active,
                }}
                isEditing={true}
            />
        </div>
    );
}
