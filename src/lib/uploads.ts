import path from 'path';
import { readFileSync, existsSync, realpathSync } from 'fs';

/**
 * Absolute path for user uploads.
 * Prefer UPLOADS_DIR (e.g. /data/uploads on a Coolify volume) so files survive redeploys.
 * Default: public/uploads under the app cwd.
 */
export function getUploadsDir(): string {
    if (process.env.UPLOADS_DIR) {
        return path.resolve(process.env.UPLOADS_DIR);
    }
    return path.join(process.cwd(), 'public', 'uploads');
}

/**
 * True when uploads are on a dedicated Docker/bind mount (survives container recreate).
 * Root filesystem mounts do not count — those are wiped on every Coolify redeploy.
 */
export function isUploadsDirMounted(): boolean {
    try {
        const mounts = readFileSync('/proc/mounts', 'utf8');
        const mountPoints = new Set(
            mounts
                .split('\n')
                .map((line) => line.split(' ')[1])
                .filter(Boolean)
        );

        const candidates = [getUploadsDir(), path.join(process.cwd(), 'public', 'uploads'), '/data/uploads'];

        for (const candidate of candidates) {
            let resolved = path.resolve(candidate);
            try {
                if (existsSync(resolved)) {
                    resolved = realpathSync(resolved);
                }
            } catch {
                // ignore
            }
            if (mountPoints.has(resolved) || mountPoints.has(candidate)) {
                return true;
            }
        }
        return false;
    } catch {
        return false;
    }
}

export function uploadsDirExists(): boolean {
    try {
        return existsSync(getUploadsDir());
    } catch {
        return false;
    }
}
