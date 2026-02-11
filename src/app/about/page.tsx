
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import * as Icons from 'lucide-react';

export const revalidate = 0;

export const metadata = {
    title: 'About Us | EGP Ghana',
    description: 'Learn about the Economic Governance Platform Ghana and our mission',
};

// Helper to render icon dynamically
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.Activity className={className} />;
    return <IconComponent className={className} />;
};

export default async function AboutPage() {
    const programs = await prisma.program.findMany({
        orderBy: { createdAt: 'asc' },
    });

    return (
        <>
            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative bg-primary-700 py-12 md:py-20">
                    <div className="container">
                        <div className="max-w-3xl mr-auto text-left">
                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6 animate-fade-in text-white">About EGP Ghana</h1>
                            <p className="text-lg text-blue-100 animate-slide-up border-l-4 border-primary-500 pl-6">
                                Promoting transparency, accountability, and evidence-based policymaking in Ghana's economic governance
                            </p>
                        </div>
                    </div>
                </section>

                {/* About Content & Mission/Vision/Goal */}
                <section className="py-8 md:py-12 bg-white">
                    <div className="container">
                        {/* Top Image */}
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                            <img
                                src="/assets/images/About-us.jpg"
                                alt="About EGP Ghana"
                                className="w-full h-auto object-cover max-h-[500px]"
                            />
                        </div>

                        {/* Main Text Content */}
                        <div className="max-w-4xl mx-auto mb-10">
                            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                The <span className="font-bold text-slate-900">Economic Governance Platform (EGP)</span> is a coalition of Civil Society Organizations championing prudence in the management of public funds in Ghana. Hosted by the <span className="font-bold text-slate-900">Ghana Anti-Corruption Coalition (GACC)</span>, our membership includes leading organizations such as IEA, CDD Ghana, ACEP, IMANI Africa, IDEG, GII, OXFAM Ghana, Africa Education Watch, and Tax Justice Network.
                            </p>
                            <p className="text-lg text-slate-700 leading-relaxed">
                                Previously known as the <span className="font-bold text-slate-900">Civil Society Platform on the IMF Programme</span>, EGP was formed in November 2014 when eleven CSOs came together to influence and engage both the government and the IMF. The platform was established primarily in response to recurring fiscal indiscipline, particularly during election years.
                            </p>
                        </div>

                        {/* Vision, Mission, Goal Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Vision */}
                            <div className="glass-card transition-transform duration-300 hover:scale-105 bg-white border-l-4 border-l-cyan-400 border-y border-r border-slate-100 shadow-sm p-8 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="font-heading font-bold text-xl text-slate-900">Vision</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed flex-grow">
                                    To be the foremost coalition of CSOs focused on ensuring the efficient and effective use of public resources to grow Ghana&apos;s economy.
                                </p>
                            </div>

                            {/* Mission */}
                            <div className="glass-card transition-transform duration-300 hover:scale-105 bg-white border-l-4 border-l-emerald-400 border-y border-r border-slate-100 shadow-sm p-8 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="font-heading font-bold text-xl text-slate-900">Mission</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed flex-grow">
                                    Ensuring CSOs and Media working on Transparency and Accountability in Ghana present common positions on Economic Governance issues through Policy Analysis and Constructive Engagements.
                                </p>
                            </div>

                            {/* Goal */}
                            <div className="glass-card transition-transform duration-300 hover:scale-105 bg-white border-l-4 border-l-blue-400 border-y border-r border-slate-100 shadow-sm p-8 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="font-heading font-bold text-xl text-slate-900">Goal</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed flex-grow">
                                    Ensuring good governance, fiscal transparency, sound public financial management, and citizen engagement in development processes, promoting access to information on fiscal and monetary policies.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Do */}
                <section className="py-8 md:py-12 bg-white border-y border-slate-100">
                    <div className="container">
                        <div className="max-w-4xl mb-8 text-center mx-auto">
                            <h2 className="text-2xl font-bold mb-6 text-slate-900">What We Do</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                The Economic Governance Platform is a coalition of Civil Society Organizations championing prudence in the management of public funds in Ghana. We are committed to promoting financial transparency, accountable governance, and citizen participation in public finance management. Through research, advocacy, and digital innovation, we empower citizens and stakeholders to engage effectively in fiscal policy processes and hold governments accountable for responsible management of public resources.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {programs.map((program) => (
                                <div key={program.id} className="glass-card group hover:scale-[1.02] transition-all duration-300 bg-slate-50 border border-slate-200 p-8 flex flex-col items-start h-full">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-lg bg-white shadow-sm flex items-center justify-center text-${program.color || 'primary-500'} mb-6 border border-slate-100`}>
                                        <div className="text-primary-600">
                                            <DynamicIcon name={program.icon || 'Activity'} className="w-8 h-8" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">
                                        {program.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-600 text-base leading-relaxed">
                                        {program.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>



                {/* Member Organizations */}
                <section className="py-8 md:py-12 bg-slate-50">
                    <div className="container">
                        <div className="max-w-4xl mb-10 text-center mx-auto">
                            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                                The Platform hopes to engage with the Government of Ghana in the long-term, beyond the IMF bailout programme, to ensure fiscal responsibility is internalised for the common good of the country.
                            </p>

                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Member Organizations</h2>
                            <p className="text-slate-600">
                                The Economic Governance Platform is a powerful coalition of leading civil society organizations in Ghana
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {/* Row 1 */}
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                <img src="/assets/images/members/oxfam-logo-horizontal-green-rgb-scaled.png" alt="Oxfam" className="max-h-16 w-auto object-contain" />
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                <img src="/assets/images/members/gacc-logo-2.png" alt="Ghana Anti-Corruption Coalition" className="max-h-16 w-auto object-contain" />
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                {/* ACEP Placeholder */}
                                <img src="/assets/images/members/images-8.png" alt="Africa Centre for Energy Policy" className="max-h-16 w-auto object-contain" />
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                <img src="/assets/images/members/imani_africa_web.jpg" alt="IMANI" className="max-h-16 w-auto object-contain" />
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                {/* IEA Placeholder */}
                                <img src="/assets/images/members/images-9.png" alt="IEA Ghana" className="max-h-16 w-auto object-contain" />
                            </div>

                            {/* Row 2 */}
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                {/* GII Placeholder */}
                                <img src="/assets/images/members/images-17.jpeg" alt="Ghana Integrity Initiative" className="max-h-16 w-auto object-contain" />
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                {/* EduWatch Placeholder */}
                                <img src="/assets/images/members/logo_favicon-1.png" alt="Africa Education Watch" className="max-h-16 w-auto object-contain" />
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                <img src="/assets/images/members/IDEG-logo.png.webp" alt="IDEG" className="max-h-16 w-auto object-contain" />
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                <img src="/assets/images/members/tjna_final_final_logo_0.jpg" alt="Tax Justice Network Africa" className="max-h-16 w-auto object-contain" />
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                <img src="/assets/images/members/OSF3-2.png" alt="Open Society Foundations" className="max-h-16 w-auto object-contain" />
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
