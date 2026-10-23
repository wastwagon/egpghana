import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

type OgBrandedProps = {
    title: string;
    subtitle?: string;
};

export function OgBrandedImage({ title, subtitle }: OgBrandedProps) {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '64px 72px',
                    background: 'linear-gradient(135deg, #00467e 0%, #0a2540 55%, #003d6b 100%)',
                    color: '#fff',
                    fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            background: 'rgba(255,255,255,0.15)',
                            border: '2px solid rgba(255,255,255,0.25)',
                        }}
                    />
                    <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>EGP Ghana</div>
                </div>
                <div>
                    <div
                        style={{
                            fontSize: 52,
                            fontWeight: 800,
                            lineHeight: 1.15,
                            letterSpacing: -1,
                            maxWidth: 1000,
                        }}
                    >
                        {title.length > 120 ? `${title.slice(0, 117)}…` : title}
                    </div>
                    {subtitle ? (
                        <div style={{ marginTop: 20, fontSize: 26, opacity: 0.85, maxWidth: 900 }}>{subtitle}</div>
                    ) : null}
                </div>
                <div style={{ fontSize: 22, opacity: 0.75 }}>egpghana.org · Economic Governance Platform</div>
            </div>
        ),
        { ...OG_SIZE },
    );
}
