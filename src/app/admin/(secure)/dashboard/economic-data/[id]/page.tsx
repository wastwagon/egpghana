
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import EconomicDataForm from "@/components/admin/EconomicDataForm";

const prisma = new PrismaClient();

export default async function EditEconomicDataPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        redirect('/admin/login');
    }

    const data = await prisma.economicData.findUnique({
        where: { id: params.id },
    });

    if (!data) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Economic Data</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Update existing economic indicator.
                </p>
            </div>

            <EconomicDataForm initialData={data} isEditing={true} />
        </div>
    );
}
