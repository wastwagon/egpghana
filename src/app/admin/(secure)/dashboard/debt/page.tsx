
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, TrendingUp } from 'lucide-react';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';

const prisma = new PrismaClient();

export default async function DebtDashboardAdminPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        redirect('/admin/login');
    }

    const page = parseInt(searchParams.page || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    // Filter for Debt related indicators
    const where: any = {
        OR: [
            { indicator: 'TOTAL_DEBT' },
            { indicator: 'DEBT_TO_GDP_RATIO' },
            { indicator: 'DEBT_SERVICE_TO_REVENUE' },
            { indicator: 'DEBT_BY_CREDITOR' },
            { indicator: { startsWith: 'DEBT_' } }
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

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Debt Tracker Management"
                description="Manage national debt stocks, composition, and sustainability ratios."
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Composition (Metadata)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((item) => {
                            const meta = item.metadata as any;
                            return (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{item.indicator}</div>
                                        <div className="text-xs text-gray-500 mt-1">{new Date(item.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-mono font-bold">
                                            {item.value.toLocaleString()} {item.unit}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {meta?.domestic && <span className="text-[10px] bg-slate-100 px-1 rounded">Dom: {(meta.domestic / 1e9).toFixed(1)}B</span>}
                                            {meta?.external && <span className="text-[10px] bg-slate-100 px-1 rounded">Ext: {(meta.external / 1e9).toFixed(1)}B</span>}
                                            {meta?.creditor && <span className="text-[10px] bg-purple-100 px-1 rounded">Creditor: {meta.creditor}</span>}
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
        </div>
    );
}
