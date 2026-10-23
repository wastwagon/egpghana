'use client';

import { useEffect, useState } from 'react';

type HeroBannerVideoProps = {
    videoSrc: string;
    posterSrc?: string;
    className?: string;
    overlayClassName?: string;
    /** When true, defer loading until the browser can (dashboard heroes below fold). */
    lazy?: boolean;
};

export default function HeroBannerVideo({
    videoSrc,
    posterSrc = '/assets/images/careers-hero.jpg',
    className = 'absolute inset-0 w-full h-full object-cover',
    overlayClassName,
    lazy = false,
}: HeroBannerVideoProps) {
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduceMotion(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    if (reduceMotion) {
        return (
            <>
                <div
                    className={className}
                    style={{
                        backgroundImage: `url(${posterSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    role="img"
                    aria-label="Economic Governance Platform banner"
                />
                {overlayClassName ? <div className={overlayClassName} /> : null}
            </>
        );
    }

    return (
        <>
            <video
                autoPlay
                loop
                muted
                playsInline
                preload={lazy ? 'none' : 'metadata'}
                poster={posterSrc}
                className={className}
            >
                <source src={videoSrc} type="video/mp4" />
            </video>
            {overlayClassName ? <div className={overlayClassName} /> : null}
        </>
    );
}
