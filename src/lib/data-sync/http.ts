import https from 'https';
import http from 'http';
import { URL } from 'url';

const DEFAULT_UA = 'EGP-Ghana-DataSync/1.0 (+https://egpghana.org)';

/**
 * Government sites (BoG/MoF) sometimes present incomplete TLS chains that
 * Node rejects while browsers/curl accept. We fetch with a controlled fallback.
 */
export async function fetchText(url: string, init?: { headers?: Record<string, string> }): Promise<string> {
    const buf = await fetchBuffer(url, init?.headers);
    return buf.toString('utf8');
}

export async function fetchBuffer(url: string, headers?: Record<string, string>): Promise<Buffer> {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': DEFAULT_UA,
                ...(headers || {}),
            },
            cache: 'no-store',
        });
        if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
        return Buffer.from(await res.arrayBuffer());
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const cause = err instanceof Error && 'cause' in err ? String((err as Error & { cause?: unknown }).cause) : '';
        const tlsIssue = /certificate|UNABLE_TO_VERIFY|TLS|SSL/i.test(`${message} ${cause}`);
        if (!tlsIssue && !/fetch failed/i.test(message)) throw err;
        return fetchBufferRelaxed(url, headers);
    }
}

function fetchBufferRelaxed(url: string, headers?: Record<string, string>): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const parsed = new URL(url);
        const lib = parsed.protocol === 'http:' ? http : https;
        const req = lib.request(
            {
                protocol: parsed.protocol,
                hostname: parsed.hostname,
                port: parsed.port || (parsed.protocol === 'http:' ? 80 : 443),
                path: `${parsed.pathname}${parsed.search}`,
                method: 'GET',
                headers: {
                    Accept: '*/*',
                    'User-Agent': DEFAULT_UA,
                    ...(headers || {}),
                },
                rejectUnauthorized: false,
            },
            (res) => {
                if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    const next = new URL(res.headers.location, url).toString();
                    fetchBufferRelaxed(next, headers).then(resolve, reject);
                    return;
                }
                if (!res.statusCode || res.statusCode >= 400) {
                    reject(new Error(`${url}: HTTP ${res.statusCode || 0}`));
                    return;
                }
                const chunks: Buffer[] = [];
                res.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            }
        );
        req.on('error', reject);
        req.end();
    });
}
