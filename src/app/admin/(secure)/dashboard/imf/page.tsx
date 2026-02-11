
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Target } from 'lucide-react';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';

const prisma = new PrismaClient();

export default async function IMFDashboardAdminPage({
    searchParams,
}: {
    searchParams: { page?: string; indicator?: string };
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        redirect('/admin/login');
    }

    const page = parseInt(searchParams.page || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    // Filter for IMF related indicators
    const where: any = {
        OR: [
            { indicator: { startsWith: 'IMF_' } }
        ]
    };

    // Fetch data
    const [total, data] = await prisma.$transaction([
        prisma.economicData.count({ where }),
        prisma.economicData.findMany({
            where,
            orderBy: { date: 'desc' },
            skip,
            take: limit,
        }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="IMF Tracker Management"
                description="Manage disbursements, milestones, and conditionalities."
                action={{
                    label: "Add Entry",
                    href: "/admin/dashboard/economic-data/new",
                    icon: Plus
                }}
            />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Indicator / Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status / Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((item) => {
                            const meta = item.metadata as any;
                            return (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.indicator}</div>
                                        <div className="text-xs text-gray-500 mt-1">{new Date(item.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{item.value.toLocaleString()} {item.unit}</span>
                                            {meta?.status && (
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded w-max mt-1 ${meta.status === 'Completed' || meta.status === 'Met' ? 'bg-green-100 text-green-700' :
                                                        meta.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {meta.status}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs">
                                            {meta?.title || meta?.description || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/dashboard/economic-data/${item.id}`}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination omitted for brevity but should be there in full version */}
        </div>
    );
}
