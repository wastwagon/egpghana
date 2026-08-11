import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';
import DataSyncPanel from '@/components/admin/DataSyncPanel';

export default function DataSyncPage() {
    return (
        <div className="p-6 space-y-6">
            <AdminPageHeader
                title="Data Freshness"
                description="Check BoG, World Bank, and MoF sources. Mid-Year Fiscal Policy Review is the preferred H1 debt authority; older extracts never overwrite newer dates."
            />
            <DataSyncPanel />
        </div>
    );
}
