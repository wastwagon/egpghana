import Footer from '@/components/Footer';

export const metadata = {
    title: 'Privacy Policy | Economic Governance Platform',
    description: 'Privacy Policy for the Economic Governance Platform Ghana - Learn how we protect your data and privacy.'
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="relative bg-primary-700 py-20">
                    <div className="container">
                        <div className="max-w-3xl mr-auto text-left">
                            <h1 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in text-white font-heading">Privacy Policy</h1>
                            <p className="text-lg text-blue-100 animate-slide-up border-l-4 border-primary-500 pl-6">
                                Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                                        The Economic Governance Platform (EGP) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">1. Information We Collect</h3>
                                    <p className="text-slate-700 leading-relaxed mb-4">
                                        We collect information you provide directly to us, such as when you subscribe to our newsletter, use our contact forms, or participate in our programs. This may include:
                                    </p>
                                    <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                                        <li>Name and contact information (email address, phone number)</li>
                                        <li>Organization or affiliation</li>
                                        <li>Communication preferences</li>
                                        <li>Any other information you choose to provide</li>
                                    </ul>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, and usage data through cookies and similar technologies.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">2. How We Use Your Information</h3>
                                    <p className="text-slate-700 leading-relaxed mb-4">
                                        We use the information we collect to:
                                    </p>
                                    <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                                        <li>Provide, maintain, and improve our services and website</li>
                                        <li>Communicate with you about our programs, events, publications, and reports</li>
                                        <li>Respond to your inquiries and requests</li>
                                        <li>Analyze trends and usage patterns to enhance user experience</li>
                                        <li>Send newsletters and updates (with your consent)</li>
                                        <li>Comply with legal obligations and protect our rights</li>
                                    </ul>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">3. Information Sharing</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        We do not sell your personal information. We may share your information with:
                                    </p>
                                    <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                                        <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as email delivery, website hosting, and analytics</li>
                                        <li><strong>Partner Organizations:</strong> With your consent, we may share information with our coalition partners for collaborative programs</li>
                                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                                    </ul>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">4. Data Security</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet transmission is ever fully secure, and we cannot guarantee absolute security.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">5. Your Rights and Choices</h3>
                                    <p className="text-slate-700 leading-relaxed mb-4">
                                        You have the right to:
                                    </p>
                                    <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                                        <li>Access and update your personal information</li>
                                        <li>Opt-out of receiving promotional communications</li>
                                        <li>Request deletion of your personal data (subject to legal requirements)</li>
                                        <li>Disable cookies through your browser settings</li>
                                    </ul>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">6. Cookies and Tracking Technologies</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings, though disabling cookies may affect website functionality.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">7. Children's Privacy</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">8. Changes to This Policy</h3>
                                    <p className="text-slate-700 leading-relaxed mb-6">
                                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4 font-heading">9. Contact Us</h3>
                                    <p className="text-slate-700 leading-relaxed mb-2">
                                        If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
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
