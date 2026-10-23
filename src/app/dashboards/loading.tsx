import ChartBlockSkeleton from '@/components/ChartBlockSkeleton';

export default function DashboardsLoading() {
    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-16">
            <div className="container space-y-8">
                <ChartBlockSkeleton height={120} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ChartBlockSkeleton height={140} />
                    <ChartBlockSkeleton height={140} />
                    <ChartBlockSkeleton height={140} />
                    <ChartBlockSkeleton height={140} />
                </div>
                <ChartBlockSkeleton height={360} />
            </div>
        </div>
    );
}
