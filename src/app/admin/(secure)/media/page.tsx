'use client';

import { useState } from 'react';
import MediaLibrary from '@/components/admin/MediaLibrary';

import AdminPageHeader from '@/components/admin/ui/AdminPageHeader';

export default function MediaPage() {
    return (
        <div className="h-full">
            <AdminPageHeader title="Media Library" />
            <MediaLibrary />
        </div>
    );
}
