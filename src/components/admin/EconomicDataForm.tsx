
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EconomicDataFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function EconomicDataForm({ initialData, isEditing = false }: EconomicDataFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        indicator: initialData?.indicator || '',
        value: initialData?.value || '',
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        source: initialData?.source || '',
        unit: initialData?.unit || '',
        metadata: initialData?.metadata ? JSON.stringify(initialData.metadata, null, 2) : '{}',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate JSON
            let parsedMetadata;
            try {
                parsedMetadata = JSON.parse(formData.metadata);
            } catch (jsonError) {
                throw new Error('Invalid JSON in Metadata field');
            }

            const payload = {
                ...formData,
                value: parseFloat(formData.value),
                metadata: parsedMetadata,
            };

            const url = isEditing
                ? `/api/economic-data/${initialData.id}`
                : '/api/economic-data';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/admin/dashboard/economic-data');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const commonIndicators = [
        'GDP_GROWTH',
        'INFLATION_RATE',
        'EXCHANGE_RATE_USD',
        'TOTAL_DEBT',
        'DEBT_TO_GDP_RATIO',
        'FOREX_RESERVES',
        'IMF_DISBURSEMENT',
        'IMF_CONDITIONALITY',
        'IMF_MILESTONE',
        'UNEMPLOYMENT_RATE',
        'TRADE_BALANCE',
        'DEBT_SERVICE_TO_REVENUE',
        'DEBT_BY_CREDITOR'
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Indicator</label>
                    <div className="mt-1 flex gap-2">
                        <select
                            name="indicator"
                            value={commonIndicators.includes(formData.indicator) ? formData.indicator : 'custom'}
                            onChange={(e) => {
                                if (e.target.value !== 'custom') {
                                    setFormData(prev => ({ ...prev, indicator: e.target.value }));
                                } else {
                                    setFormData(prev => ({ ...prev, indicator: '' }));
                                }
                            }}
                            className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="custom">Custom / Other</option>
                            {commonIndicators.map(i => (
                                <option key={i} value={i}>{i}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="indicator"
                            value={formData.indicator}
                            onChange={handleChange}
                            placeholder="Or type custom indicator..."
                            className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Value (Number)</label>
                    <input
                        type="number"
                        step="any"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                    <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
                    <input
                        type="text"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Metadata (JSON)</label>
                    <p className="text-xs text-gray-500 mb-2">Use this for additional fields like 'quarter', 'note', 'domestic', etc.</p>
                    <textarea
                        name="metadata"
                        value={formData.metadata}
                        onChange={handleChange}
                        rows={6}
                        className="mt-1 block w-full font-mono text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (isEditing ? 'Update Data' : 'Add Data')}
                </button>
            </div>
        </form>
    );
}
