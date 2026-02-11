'use client';

import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { debtHistoryData, AnalysisData } from '@/data/debtHistory';

// Color map for chart items
const COLORS = {
    totalDebt: '#006B3F',     // Ghana Green
    domesticDebt: '#006B3F',  // Ghana Green (often shown with different opacity or shade)
    externalDebt: '#CE1126',  // Ghana Red
    interestPayments: '#FCD116', // Ghana Gold
    debtServicing: '#8D6E24'   // Darker Gold
};

const LABELS = {
    totalDebt: 'Total Public Debt',
    domesticDebt: 'Domestic Debt',
    externalDebt: 'External Debt',
    interestPayments: 'Interest Payments',
    debtServicing: 'Debt Servicing'
};

export default function HistoricalDebtAnalyzer() {
    // ---- State ----
    const [startYear, setStartYear] = useState(2008);
    const [endYear, setEndYear] = useState(2026);
    const [currency, setCurrency] = useState<'GHS' | 'USD'>('GHS');
    const [metric, setMetric] = useState<'nominal' | 'gdp' | 'capita'>('nominal');
    const [chartType, setChartType] = useState<'line' | 'area' | 'bar' | 'table'>('line');

    const [selectedComponents, setSelectedComponents] = useState({
        totalDebt: true,
        domesticDebt: true,
        externalDebt: true,
        interestPayments: false,
        debtServicing: false
    });

    // ---- Data Processing ----
    const processedData = useMemo(() => {
        const { years } = debtHistoryData;
        const startIndex = years.indexOf(startYear);
        const endIndex = years.indexOf(endYear);

        const slicedYears = years.slice(startIndex, endIndex + 1);

        // Determine which dataset to use based on state
        let sourceData: any;
        if (metric === 'gdp') {
            sourceData = debtHistoryData.gdp;
        } else if (metric === 'capita') {
            sourceData = debtHistoryData.capita[currency];
        } else {
            sourceData = debtHistoryData.nominal[currency];
        }

        // Map into Recharts-friendly array of objects
        return slicedYears.map((year, i) => {
            // sourceData arrays are full length, so we need to offset by startIndex
            const actualIndex = startIndex + i;
            return {
                year,
                totalDebt: sourceData.totalDebt[actualIndex],
                domesticDebt: sourceData.domesticDebt[actualIndex],
                externalDebt: sourceData.externalDebt[actualIndex],
                interestPayments: sourceData.interestPayments[actualIndex],
                debtServicing: sourceData.debtServicing[actualIndex]
            };
        });
    }, [startYear, endYear, currency, metric]);

    // ---- Handlers ----
    const toggleComponent = (key: keyof typeof selectedComponents) => {
        setSelectedComponents(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const downloadCSV = () => {
        const headers = ['Year', ...Object.keys(LABELS).map(k => LABELS[k as keyof typeof LABELS])];
        const rows = processedData.map(row => [
            row.year,
            row.totalDebt,
            row.domesticDebt,
            row.externalDebt,
            row.interestPayments,
            row.debtServicing
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ghana_debt_data_${startYear}-${endYear}.csv`;
        link.click();
    };

    // ---- Render Helpers ----
    const formatValue = (val: number) => {
        if (metric === 'gdp') return `${val.toFixed(1)}%`;
        const prefix = currency === 'GHS' ? 'GH₵' : '$';

        if (metric === 'capita') return `${prefix}${val.toLocaleString()}`;
        return `${prefix}${val.toFixed(1)}B`;
    };

    const getYAxisLabel = () => {
        if (metric === 'gdp') return '% of GDP';
        if (metric === 'capita') return `${currency} per Capita`;
        return `${currency} (Billions)`;
    };

    // Prepare active lines/bars/areas
    const activeKeys = (Object.keys(selectedComponents) as Array<keyof typeof selectedComponents>)
        .filter(k => selectedComponents[k]);

    return (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header / Context */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">Historical Debt Trends Analysis</h3>
                <p className="text-slate-600 max-w-3xl leading-relaxed">
                    Ghana's public debt has experienced significant growth over the years, reflecting the country's efforts to finance development projects, economic shocks, and external vulnerabilities. Below is a summary of the public debt trends from 2008 to 2026.
                </p>
                <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Report generated: February 7, 2026
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-b border-slate-100">

                {/* Year Range */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Year Range</label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700 w-10">{startYear}</span>
                        <input
                            type="range" min={2008} max={2026}
                            value={startYear}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (val <= endYear) setStartYear(val);
                            }}
                            className="flex-grow h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700 w-10">{endYear}</span>
                        <input
                            type="range" min={2008} max={2026}
                            value={endYear}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (val >= startYear) setEndYear(val);
                            }}
                            className="flex-grow h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                    </div>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Currency</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {(['GHS', 'USD'] as const).map(c => (
                            <button
                                key={c}
                                onClick={() => setCurrency(c)}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${currency === c ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Metric */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Metric</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {(['nominal', 'gdp', 'capita'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => setMetric(m)}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${metric === m ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {m === 'nominal' ? 'Nominal' : m === 'gdp' ? '% GDP' : 'Per Capita'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Components */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Components</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(selectedComponents).map((key) => {
                            const k = key as keyof typeof selectedComponents;
                            return (
                                <button
                                    key={key}
                                    onClick={() => toggleComponent(k)}
                                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors border ${selectedComponents[k]
                                        ? 'bg-slate-800 text-white border-slate-800'
                                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {LABELS[k]}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Visualization Tabs */}
            <div className="border-b border-slate-200 px-6 pt-4 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex space-x-6">
                    {(['line', 'area', 'bar', 'table'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setChartType(type)}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${chartType === type
                                ? 'border-primary-600 text-primary-700'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {type} Chart
                        </button>
                    ))}
                </div>

                <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors mb-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export CSV
                </button>
            </div>

            {/* Chart Area */}
            <div className="p-6 h-[500px] w-full bg-white">
                {chartType === 'table' ? (
                    <div className="h-full overflow-auto">
                        <table className="w-full text-sm text-center">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Year</th>
                                    {activeKeys.map(k => (
                                        <th key={k} className="px-4 py-3 font-semibold">{LABELS[k]}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[...processedData].reverse().map((row) => (
                                    <tr key={row.year} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">{row.year}</td>
                                        {activeKeys.map(k => (
                                            <td key={k} className="px-4 py-3 text-slate-600 font-mono">
                                                {formatValue(row[k])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'area' ? (
                            <AreaChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                                <Tooltip formatter={(value: number) => formatValue(value)} />
                                <Legend />
                                {activeKeys.map(k => (
                                    <Area key={k} type="monotone" dataKey={k} name={LABELS[k]} stroke={COLORS[k]} fill={COLORS[k]} fillOpacity={0.1} />
                                ))}
                            </AreaChart>
                        ) : chartType === 'bar' ? (
                            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                                <Tooltip formatter={(value: number) => formatValue(value)} />
                                <Legend />
                                {activeKeys.map(k => (
                                    <Bar key={k} dataKey={k} name={LABELS[k]} fill={COLORS[k]} radius={[4, 4, 0, 0]} />
                                ))}
                            </BarChart>
                        ) : (
                            <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                                <Tooltip formatter={(value: number) => formatValue(value)} />
                                <Legend />
                                {activeKeys.map(k => (
                                    <Line key={k} type="monotone" dataKey={k} name={LABELS[k]} stroke={COLORS[k]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                                ))}
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
}
