"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface StaffMember {
    id: string;
    name: string;
    position: string;
    bio: string | null;
    imageUrl: string | null;
    email: string | null;
}

interface StaffBioModalProps {
    member: StaffMember | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function StaffBioModal({ member, isOpen, onClose }: StaffBioModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    if (!member) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Image Sidebar */}
                    <div className="w-full md:w-1/3 bg-slate-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-md mb-4 ring-4 ring-white">
                            {member.imageUrl ? (
                                <Image
                                    src={member.imageUrl}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-primary-600">
                                        {member.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 text-center">{member.name}</h3>
                        <p className="text-primary-600 font-medium text-center text-sm mb-4">{member.position}</p>

                        {member.email && (
                            <a
                                href={`mailto:${member.email}`}
                                className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email Me
                            </a>
                        )}
                    </div>

                    {/* Bio Content */}
                    <div className="w-full md:w-2/3 p-6 md:p-8">
                        <h4 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Biography</h4>
                        <div className="prose prose-slate prose-sm max-w-none">
                            {member.bio ? (
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {member.bio}
                                </p>
                            ) : (
                                <p className="text-slate-400 italic">No biography available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
