
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Contact Us | EGP Ghana',
    description: 'Get in touch with the Economic Governance Platform Ghana team',
};

export default function ContactPage() {
    return (
        <>

            <main className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-primary-900 to-slate-900 py-12 md:py-16 overflow-hidden">
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

                    <div className="container relative z-10 px-6">
                        <div className="max-w-4xl mr-auto text-left">
                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6 animate-fade-in text-white leading-tight">
                                Let's Start a <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Conversation</span>
                            </h1>
                            <p className="text-lg text-blue-100 animate-slide-up max-w-2xl leading-relaxed border-l-4 border-primary-500 pl-6">
                                Have questions about our work regarding economic governance or want to collaborate? We'd love to hear from you.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="section py-12">
                    <div className="container">
                        {/* Contact Info - Top Section */}
                        <div className="mb-16">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
                                <p className="text-slate-600 mt-2">
                                    Our team is available Monday through Friday, 8:30 AM to 5:00 PM.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                <div className="glass-card flex flex-col items-center text-center p-6 bg-white border border-slate-100 shadow-sm transition-transform duration-300 hover:scale-105">
                                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-base text-slate-900 mb-2">Visit Us</h3>
                                    <p className="text-slate-600 text-sm">
                                        C1173/12-Kotobabi Road,<br />
                                        Pig Farm - Accra - Ghana
                                    </p>
                                </div>

                                <div className="glass-card flex flex-col items-center text-center p-6 bg-white border border-slate-100 shadow-sm transition-transform duration-300 hover:scale-105">
                                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-base text-slate-900 mb-2">Email Us</h3>
                                    <p className="text-slate-600 text-sm">
                                        info@egpghana.org
                                    </p>
                                </div>

                                <div className="glass-card flex flex-col items-center text-center p-6 bg-white border border-slate-100 shadow-sm transition-transform duration-300 hover:scale-105">
                                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-base text-slate-900 mb-2">Call Us</h3>
                                    <p className="text-slate-600 text-sm">
                                        +233 30 396 9221<br />
                                        +233 30 223 0490
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form - Middle Section */}
                        <div className="max-w-3xl mx-auto mb-16">
                            <div className="glass-card bg-white border border-slate-100 shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Send us a Message</h2>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="input"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="input"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                                            Subject
                                        </label>
                                        <select id="subject" className="input bg-white text-slate-900 border-slate-300">
                                            <option value="">Select a topic...</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="press">Press & Media</option>
                                            <option value="program">Program Partnership</option>
                                            <option value="feedback">Website Feedback</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={6}
                                            className="input resize-none"
                                            placeholder="How can we help you?"
                                            required
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn-primary w-full">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Map - Bottom Section */}
                        <div className="rounded-xl overflow-hidden h-96 border border-slate-200 shadow-md">
                            <iframe
                                src="https://maps.google.com/maps?q=C1173%2F12-Kotobabi+Road%2C+Pig+Farm%2C+Accra%2C+Ghana&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, opacity: 0.8 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
