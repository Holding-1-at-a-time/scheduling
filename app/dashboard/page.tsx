// app/dashboard/page.tsx
import { Suspense } from 'react';
import { currentUser, clerkClient, auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import DashboardContent from './DashboardContent';
import ErrorBoundary from '@/components/ErrorBoundary';
import Loading from '@/components/Loading';
import { OrganizationRole, UserInfo } from '@/types/auth';

async function getUserData(): Promise<UserInfo> {
    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }

    const { userId, orgId } = auth();
    if (!userId || !orgId) {
        throw new Error('User or organization not found');
    }

    const [orgMembership, orgData] = await Promise.all([
        clerkClient.organizations.getOrganizationMembership({ userId, organizationId: orgId }),
        clerkClient.organizations.getOrganization({ organizationId: orgId })
    ]);

    if (!orgMembership || !orgData) {
        throw new Error('Organization membership or data not found');
    }

    return {
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0]?.emailAddress ?? '',
        organizationName: orgData.name,
        role: orgMembership.role as OrganizationRole,
    };
}

export default async function DashboardPage() {
    const userData = await getUserData();

    return (
        <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
            <Suspense fallback={<Loading />}>
                <DashboardContent userData={userData} />
            </Suspense>
        </ErrorBoundary>
    );
}