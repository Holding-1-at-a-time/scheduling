// lib/vercelApi.ts

import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import pino from 'pino';
import { rateLimit } from 'express-rate-limit';
import NodeCache from 'node-cache';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const VERCEL_API_URL = 'https://api.vercel.com';
const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

if (!VERCEL_TOKEN || !VERCEL_TEAM_ID || !VERCEL_PROJECT_ID) {
    throw new Error('Missing required Vercel environment variables');
}

const apiClient = axios.create({
    baseURL: VERCEL_API_URL,
    headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

const VercelDomainSchema = z.object({
    name: z.string(),
    apexName: z.string(),
    projectId: z.string(),
    redirect: z.string().nullable(),
    redirectStatusCode: z.number().nullable(),
    gitBranch: z.string().nullable(),
    updatedAt: z.number().optional(),
    createdAt: z.number().optional(),
    verified: z.boolean(),
});

type VercelDomain = z.infer<typeof VercelDomainSchema>;

async function makeRequest<T>(
    method: 'get' | 'post',
    endpoint: string,
    data?: unknown,
    useCache = false
): Promise<T> {
    const cacheKey = `${method}:${endpoint}:${JSON.stringify(data)}`;

    if (useCache) {
        const cachedResponse = cache.get<T>(cacheKey);
        if (cachedResponse) return cachedResponse;
    }

    try {
        await limiter(null as any, null as any, () => { });
        const response = await apiClient.request<T>({
            method,
            url: endpoint,
            data,
            params: { teamId: VERCEL_TEAM_ID },
        });

        if (useCache) {
            cache.set(cacheKey, response.data);
        }

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            logger.error({ error: error.response?.data, status: error.response?.status }, 'Vercel API request failed');
            throw new Error(`Vercel API request failed: ${error.response?.data?.message || error.message}`);
        }
        throw error;
    }
}

export async function createSubdomain(subdomain: string, domain: string): Promise<VercelDomain> {
    const fullDomain = `${subdomain}.${domain}`;
    logger.info({ subdomain, domain }, 'Creating subdomain');

    const response = await makeRequest<VercelDomain>(
        'post',
        `/v10/projects/${VERCEL_PROJECT_ID}/domains`,
        { name: fullDomain }
    );

    return VercelDomainSchema.parse(response);
}

export async function verifyDomain(domain: string): Promise<void> {
    logger.info({ domain }, 'Verifying domain');

    await makeRequest<void>(
        'post',
        `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/verify`
    );
}

export async function listDomains(): Promise<VercelDomain[]> {
    logger.info('Listing domains');

    const response = await makeRequest<VercelDomain[]>(
        'get',
        `/v9/projects/${VERCEL_PROJECT_ID}/domains`,
        undefined,
        true
    );

    return z.array(VercelDomainSchema).parse(response);
}

export async function deleteDomain(domain: string): Promise<void> {
    logger.info({ domain }, 'Deleting domain');

    await makeRequest<void>(
        'delete',
        `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`
    );
}