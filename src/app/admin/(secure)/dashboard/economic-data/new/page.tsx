
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import EconomicDataForm from "@/components/admin/EconomicDataForm";

export default async function NewEconomicDataPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        redirect('/admin/login');
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Economic Data</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Manually add new economic indicators or updates.
                </p>
            </div>

            <EconomicDataForm />
        </div>
    );
}
