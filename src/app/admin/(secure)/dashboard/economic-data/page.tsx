
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';

const prisma = new PrismaClient();

export default async function EconomicDataAdminPage({
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
    const indicatorFilter = searchParams.indicator;

    // Build where clause
    const where: any = {};
    if (indicatorFilter) {
        where.indicator = indicatorFilter;
    }

    // Fetch unique indicators for filter
    const indicators = await prisma.economicData.groupBy({
        by: ['indicator'],
    });

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
                title="Economic Data Management"
                action={{
                    label: "Add New Entry",
                    href: "/admin/dashboard/economic-data/new",
                    icon: Plus
                }}
            />

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex gap-4">
                <div className="w-64">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Filter by Indicator
                    </label>
                    <form className="flex gap-2">
                        <select
                            name="indicator"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                            defaultValue={indicatorFilter || ''}
                        >
                            <option value="">All Indicators</option>
                            {indicators.map((i) => (
                                <option key={i.indicator} value={i.indicator}>
                                    {i.indicator}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200">
                            Filter
                        </button>
                    </form>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Indicator
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Value / Unit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date / Source
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{item.indicator}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1 truncate max-w-[200px]">
                                        ID: {item.id}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white font-mono">
                                        {item.value.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.unit || '-'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {new Date(item.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.source}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/admin/dashboard/economic-data/${item.id}`}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} results
                </div>
                <div className="flex gap-2">
                    {page > 1 && (
                        <Link
                            href={`/admin/dashboard/economic-data?page=${page - 1}${indicatorFilter ? `&indicator=${indicatorFilter}` : ''}`}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            Previous
                        </Link>
                    )}
                    {page < totalPages && (
                        <Link
                            href={`/admin/dashboard/economic-data?page=${page + 1}${indicatorFilter ? `&indicator=${indicatorFilter}` : ''}`}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            Next
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
