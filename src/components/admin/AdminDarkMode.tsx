'use client';

import { useEffect } from 'react';

/** Applies Tailwind `dark` on `<html>` while admin secure routes are mounted. */
export default function AdminDarkMode() {
    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, []);

    return null;
}
