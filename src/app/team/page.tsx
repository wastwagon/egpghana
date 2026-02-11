import { PrismaClient } from '@prisma/client';

import Footer from '@/components/Footer';
import StaffGrid from '@/components/StaffGrid';

const prisma = new PrismaClient();

export const metadata = {
    title: 'Our Team | EGP Ghana',
    description: 'Meet the dedicated team behind the Economic Governance Platform Ghana',
};

export default async function TeamPage() {
    // Fetch staff from database
    const staff = await prisma.staff.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
    });

    return (
        <>

            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative bg-primary-700 py-20 md:py-32">
                    <div className="container">
                        <div className="max-w-3xl mr-auto text-left">
                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6 animate-fade-in text-white">Our Team</h1>
                            <p className="text-lg text-blue-100 animate-slide-up border-l-4 border-primary-500 pl-6">
                                Meet the dedicated professionals driving economic governance and transparency in Ghana
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team Grid */}
                <section className="section">
                    <div className="container">
                        <StaffGrid staff={staff as any} />
                    </div>
                </section>

                {/* Join Us CTA */}
                <section className="section bg-white border-t border-slate-100">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center glass-card bg-slate-50 border border-slate-200 shadow-sm">
                            <h2 className="heading-2 mb-4 text-slate-900">Join Our Team</h2>
                            <p className="text-slate-600 mb-8">
                                We're always looking for passionate individuals to join our mission of promoting economic transparency and good governance in Ghana.
                            </p>
                            <a href="/careers" className="btn-primary inline-block">
                                View Open Positions
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
