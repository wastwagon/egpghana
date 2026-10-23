import { OgBrandedImage } from '@/lib/og-image';

export const alt = 'Economic Governance Platform Ghana';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    return OgBrandedImage({
        title: 'Economic Governance Platform Ghana',
        subtitle: 'Data-driven economic governance for Ghana',
    });
}
