
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import * as Icons from 'lucide-react';

export const revalidate = 0;

export const metadata = {
    title: 'What We Do | EGP Ghana',
    description: 'Explore EGP Ghana\'s programs and initiatives for economic governance and transparency',
};

// Helper to render icon dynamically
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.Activity className={className} />;
    return <IconComponent className={className} />;
};

export default async function ProgramsPage() {
    const programs = await prisma.program.findMany({
        orderBy: { createdAt: 'asc' },
    });

    return (
        <>
            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative bg-primary-700 py-20 md:py-32">
                    <div className="container">
                        <div className="max-w-4xl mr-auto text-left">
                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6 animate-fade-in text-white">What We Do</h1>
                            <p className="text-lg text-blue-100 animate-slide-up leading-relaxed border-l-4 border-primary-500 pl-6">
                                The Economic Governance Platform is a coalition of Civil Society Organizations championing prudence in the management of public funds in Ghana. We are committed to promoting financial transparency, accountable governance, and citizen participation in public finance management. Through research, advocacy, and digital innovation, we empower citizens and stakeholders to engage effectively in fiscal policy processes and hold governments accountable for responsible management of public resources.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Programs Grid */}
                <section className="section">
                    <div className="container">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {programs.map((program) => (
                                <Link href={`/programs/${program.slug}`} key={program.id} className="block h-full">
                                    <div className="glass-card group hover:scale-[1.02] transition-all duration-300 bg-white border border-slate-100 shadow-sm p-8 flex flex-col items-start h-full">
                                        {/* Icon */}
                                        <div className={`w-16 h-16 rounded-lg bg-${program.color || 'primary-500'}/10 flex items-center justify-center text-${program.color || 'primary-500'} mb-6`}>
                                            <DynamicIcon name={program.icon || 'Activity'} className="w-8 h-8" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-heading font-bold text-xl text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                                            {program.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-600 text-base leading-relaxed">
                                            {program.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
