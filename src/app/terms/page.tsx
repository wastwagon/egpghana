import Footer from '@/components/Footer';

export const metadata = {
    title: 'Terms of Service | Economic Governance Platform',
    description: 'Terms of Service for using the Economic Governance Platform Ghana website and services.'
};

export default function TermsPage() {
    return (
        <>
            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative bg-primary-700 py-20">
                    <div className="container">
                        <div className="max-w-3xl mr-auto text-left">
                            <h1 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in text-white font-heading">Terms of Service</h1>
                            <p className="text-lg text-blue-100 animate-slide-up border-l-4 border-primary-500 pl-6">
                                Please read these terms carefully before using our platform and services.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="section py-16">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <div className="glass-card bg-white border border-slate-100 shadow-sm p-8 md:p-12">
                                <p className="text-sm text-slate-500 mb-8">
                                    <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>

                                <div className="prose prose-lg max-w-none">
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        Please read these Terms of Service ("Terms") carefully before using the Economic Governance Platform (EGP) website and services operated by EGP Ghana.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">1. Acceptance of Terms</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        By accessing or using our website and services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the website or use our services.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">2. Use of Content and Data</h3>
                                    <p className="text-slate-700 leading-relaxed mb-4">
                                        All content provided on this website is for informational purposes only. The EGP makes no representations as to the accuracy or completeness of any information on this site or found by following any link on this site.
                                    </p>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        <strong>Open Data License:</strong> The data, reports, and publications on this platform are free to use for public advocacy, research, and educational purposes, provided that proper attribution is given to the Economic Governance Platform Ghana. Commercial use requires prior written permission.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">3. Intellectual Property Rights</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        Unless otherwise stated, EGP Ghana and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access content for your personal use subject to restrictions set in these terms.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">4. User Conduct</h3>
                                    <p className="text-slate-700 leading-relaxed mb-4">
                                        You agree not to:
                                    </p>
                                    <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                                        <li>Use the website for any unlawful purpose or to solicit unlawful activity</li>
                                        <li>Attempt to gain unauthorized access to our systems or networks</li>
                                        <li>Interfere with or disrupt the service or servers</li>
                                        <li>Transmit any viruses, malware, or harmful code</li>
                                        <li>Scrape or harvest data without permission</li>
                                        <li>Misrepresent your affiliation with any person or organization</li>
                                    </ul>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">5. Disclaimer of Warranties</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        This website and its content are provided "as is" without any warranties, expressed or implied. EGP Ghana does not warrant that the website will be uninterrupted, error-free, or free from viruses or other harmful components.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">6. Limitation of Liability</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        In no event shall EGP Ghana, nor any of its officers, directors, and employees, be liable for anything arising out of or in any way connected with your use of this website, whether such liability is under contract, tort, or otherwise.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">7. Links to Other Websites</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        Our service may contain links to third-party websites or services that are not owned or controlled by EGP. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">8. Data Accuracy and Updates</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        While we strive to provide accurate and up-to-date economic data and analysis, we cannot guarantee the completeness or accuracy of all information. Data sources are cited where applicable, and users are encouraged to verify critical information with official sources.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">9. Governing Law</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        These Terms shall be governed and construed in accordance with the laws of Ghana, without regard to its conflict of law provisions.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">10. Changes to Terms</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">11. Contact Us</h3>
                                    <p className="text-slate-700 leading-relaxed mb-2">
                                        If you have any questions about these Terms of Service, please contact us at:
                                    </p>
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mt-4">
                                        <p className="text-slate-700 mb-2"><strong>Email:</strong> info@egpghana.org</p>
                                        <p className="text-slate-700 mb-2"><strong>Phone:</strong> +233 30 396 9221</p>
                                        <p className="text-slate-700"><strong>Address:</strong> C1173/12-Kotobabi Road, Pig Farm, Accra, Ghana</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
