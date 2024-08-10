import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantInfo } from './lib/getTenantInfo';

export async function middleware(request: NextRequest) {
    const tenantInfo = await getTenantInfo(request);

    if (tenantInfo) {
        // Inject tenant info into headers for use in the application
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-tenant-id', tenantInfo.id);
        requestHeaders.set('x-tenant-slug', tenantInfo.slug);

        // Rewrite the URL if accessing via subdomain
        if (tenantInfo.subdomain) {
            return NextResponse.rewrite(new URL(`/${tenantInfo.slug}${request.nextUrl.pathname}`, request.url));
        }

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    // Handle cases where tenant is not found
    // TODO: Tenant not found redirect to sign-up page "app\(auth)\sign-up\[...sign-up]\page.tsx"
    return NextResponse.redirect(new URL('/tenant-not-found', request.url));
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};