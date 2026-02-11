"use client";

import { useState } from 'react';
import StaffCard from '@/components/StaffCard';
import StaffBioModal from '@/components/StaffBioModal';

interface StaffMember {
    id: string;
    name: string;
    position: string;
    bio: string | null;
    imageUrl: string | null;
    email: string | null;
}

interface StaffGridProps {
    staff: StaffMember[];
}

export default function StaffGrid({ staff }: StaffGridProps) {
    const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (member: StaffMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Clear selected member after animation
        setTimeout(() => setSelectedMember(null), 300);
    };

    if (staff.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600">No team members found.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {staff.map((member) => (
                    <StaffCard
                        key={member.id}
                        name={member.name}
                        position={member.position}
                        bio={member.bio}
                        imageUrl={member.imageUrl}
                        email={member.email}
                        onClick={() => handleCardClick(member)}
                    />
                ))}
            </div>

            <StaffBioModal
                member={selectedMember}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
