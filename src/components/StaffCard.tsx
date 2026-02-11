import Image from 'next/image';

interface StaffCardProps {
    name: string;
    position?: string | null;
    bio?: string | null;
    imageUrl?: string | null;
    email?: string | null;
    onClick?: () => void;
}

export default function StaffCard({ name, position, bio, imageUrl, email, onClick }: StaffCardProps) {
    return (
        <div
            className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col h-full bg-white border border-slate-100 shadow-sm hover:shadow-md"
            onClick={onClick}
        >
            {/* Image */}
            <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden bg-slate-100">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50">
                        <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center border-4 border-primary-100">
                            <span className="text-4xl font-bold text-primary-500">
                                {name.charAt(0)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 backdrop-blur-sm text-primary-700 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Read Bio
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3 px-2 flex-grow">
                <div>
                    <h3 className="font-heading font-bold text-xl text-slate-900 group-hover:text-primary-600 transition-colors">
                        {name}
                    </h3>

                    {position && (
                        <p className="text-primary-600 font-medium mt-1">
                            {position}
                        </p>
                    )}
                </div>

                {bio && (
                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                        {bio}
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 px-2 flex justify-between items-center">
                <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider group-hover:underline">
                    Read More
                </span>

                {email && (
                    <div className="text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}
