export default function ChartBlockSkeleton({ height = 320 }: { height?: number }) {
    return (
        <div
            className="w-full rounded-xl border border-slate-100 bg-slate-50 animate-pulse"
            style={{ minHeight: height }}
            aria-hidden
        />
    );
}
