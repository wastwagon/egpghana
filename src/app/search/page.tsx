import Link from 'next/link';
import Footer from '@/components/Footer';
import { searchPublicContent } from '@/lib/public-search';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const SUGGESTED_SEARCHES = [
    { label: 'Public debt', q: 'debt' },
    { label: 'Inflation', q: 'inflation' },
    { label: 'IMF program', q: 'imf' },
    { label: 'GDP growth', q: 'gdp' },
    { label: 'Fiscal policy', q: 'fiscal' },
];

export const metadata: Metadata = {
    title: 'Search | EGP Ghana',
    description: 'Search publications, resources, and economic dashboards on EGP Ghana.',
    alternates: { canonical: '/search' },
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const q = searchParams.q?.trim() ?? '';
    const data = q.length >= 2 ? await searchPublicContent(q) : null;
    const total =
        (data?.articles.length ?? 0) + (data?.resources.length ?? 0) + (data?.dashboards.length ?? 0);

    return (
        <>
            <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Search', path: '/search' }]} />
            <main className="min-h-screen bg-slate-50 pt-28 pb-16">
                <div className="container max-w-3xl">
                    <h1 className="heading-2 mb-2">Search</h1>
                    <p className="text-slate-600 mb-8">Publications, downloads, and dashboards.</p>

                    <form method="get" action="/search" className="flex gap-2 mb-4" role="search">
                        <label htmlFor="site-search" className="sr-only">Search publications and dashboards</label>
                        <input
                            id="site-search"
                            type="search"
                            name="q"
                            value={q}
                            placeholder="Debt, inflation, IMF…"
                            className="input flex-1 min-h-[44px]"
                            minLength={2}
                            required
                            autoComplete="off"
                        />
                        <button type="submit" className="btn-primary shrink-0 min-h-[44px]">Search</button>
                    </form>

                    {!q && (
                        <div className="mb-10">
                            <p className="text-xs font-medium text-slate-500 mb-2">Popular searches</p>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_SEARCHES.map((item) => (
                                    <Link
                                        key={item.q}
                                        href={`/search?q=${encodeURIComponent(item.q)}`}
                                        className="text-sm font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 text-primary-800 hover:bg-primary-50 min-h-[36px] inline-flex items-center"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {q.length > 0 && q.length < 2 && (
                        <p className="text-slate-500">Enter at least 2 characters.</p>
                    )}

                    {data && (
                        <p className="text-sm text-slate-500 mb-6">
                            {total} result{total === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
                        </p>
                    )}

                    {data?.dashboards.length ? (
                        <section className="mb-10">
                            <h2 className="text-lg font-semibold text-slate-900 mb-3">Dashboards</h2>
                            <ul className="space-y-2">
                                {data.dashboards.map((d) => (
                                    <li key={d.href}>
                                        <Link href={d.href} className="text-primary-700 font-medium hover:underline">
                                            {d.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ) : null}

                    {data?.articles.length ? (
                        <section className="mb-10">
                            <h2 className="text-lg font-semibold text-slate-900 mb-3">Articles</h2>
                            <ul className="space-y-4">
                                {data.articles.map((a) => (
                                    <li key={a.href} className="interactive-card rounded-xl p-4">
                                        <Link href={a.href} className="font-semibold text-primary-800 hover:underline">
                                            {a.title}
                                        </Link>
                                        <p className="text-xs text-slate-500 mt-1">{a.category}</p>
                                        {a.excerpt && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{a.excerpt}</p>}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ) : null}

                    {data?.resources.length ? (
                        <section className="mb-10">
                            <h2 className="text-lg font-semibold text-slate-900 mb-3">Resources</h2>
                            <ul className="space-y-4">
                                {data.resources.map((r) => (
                                    <li key={r.href + r.title} className="interactive-card rounded-xl p-4">
                                        <a href={r.href} className="font-semibold text-primary-800 hover:underline" target="_blank" rel="noopener noreferrer">
                                            {r.title}
                                        </a>
                                        <p className="text-xs text-slate-500 mt-1">{r.category}</p>
                                        {r.description && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{r.description}</p>}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ) : null}

                    {data && total === 0 && (
                        <p className="text-slate-600">No matches. Try different keywords or browse the <Link href="/resources" className="text-primary-700 underline">Resource Centre</Link>.</p>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
