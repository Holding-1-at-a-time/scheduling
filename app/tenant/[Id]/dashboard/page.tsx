 // File: app/dashboard/page.tsx

import { Dashboard } from '@/components/dashboard/Dashboard';
import { auth } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return <Dashboard />;
}