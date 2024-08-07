// app/dashboard/DashboardContent.tsx
'use client';

import { useState, useEffect } from 'react';
import { UserInfo, OrganizationRole } from '@/types/auth';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ManagerDashboard from '@/components/dashboard/ManagerDashboard';
import MemberDashboard from '@/components/dashboard/MemberDashboard';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import UserInfoDisplay from '@/components/dashboard/UserInfoDisplay';

interface DashboardContentProps {
    userData: UserInfo;
}

export default function DashboardContent({ userData }: Readonly< DashboardContentProps>) {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(`/api/dashboard?role=${userData.role}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                setError('Error fetching dashboard data. Please try again later.');
                console.error('Dashboard data fetch error:', err);
            }
        };

        fetchDashboardData();
    }, [userData.role]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!dashboardData) {
        return <div>Loading dashboard data...</div>;
    }

    const renderDashboard = () => {
        switch (userData.role) {
            case OrganizationRole.ADMIN:
                return <AdminDashboard data={dashboardData} />;
            case OrganizationRole.MANAGER:
                return <ManagerDashboard data={dashboardData} />;
            case OrganizationRole.MEMBER:
                return <MemberDashboard data={dashboardData} />;
            case OrganizationRole.CLIENT:
                return <ClientDashboard data={dashboardData} />;
            default:
                return <div>Unknown role</div>;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {renderDashboard()}
            <UserInfoDisplay userData={userData} />
        </div>
    );
}