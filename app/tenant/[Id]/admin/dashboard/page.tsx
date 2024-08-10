// File: app/tenant/[tenantId]/admin/dashboard/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Suspense } from "react";
import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import DashboardCard from "@/components/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function formatCurrency(value: number | undefined): string {
  return value !== undefined ? `$${value.toFixed(2)}` : "$0.00";
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <Card className="bg-red-100 text-red-800">
      <CardHeader>
        <CardTitle>Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  const estimates = useQuery(api.estimates.listEstimates);
  const invoices = useQuery(api.invoices.listInvoices);
  const appointments = useQuery(api.appointments.listAppointments);
  const transactions = useQuery(api.transactions.getSummary);

  if (
    estimates === undefined ||
    invoices === undefined ||
    appointments === undefined ||
    transactions === undefined
  ) {
    return <LoadingSkeleton />;
  }

  if (
    estimates === null ||
    invoices === null ||
    appointments === null ||
    transactions === null
  ) {
    return (
      <ErrorDisplay message="Failed to fetch dashboard data. Please try again later." />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Estimates"
          description="Create and manage estimates for your clients."
          stats={[
            {
              label: "Pending",
              value: estimates.filter((e) => e.status === "pending").length,
            },
            {
              label: "Approved",
              value: estimates.filter((e) => e.status === "approved").length,
            },
          ]}
          action="Create Estimate"
        />
        <DashboardCard
          title="Invoices"
          description="Create and manage invoices for your clients."
          stats={[
            {
              label: "Unpaid",
              value: invoices.filter((i) => i.status === "unpaid").length,
            },
            {
              label: "Paid",
              value: invoices.filter((i) => i.status === "paid").length,
            },
          ]}
          action="Create Invoice"
        />
        <DashboardCard
          title="Appointments"
          description="Schedule and manage your appointments."
          stats={[
            {
              label: "Upcoming",
              value: appointments.filter((a) => new Date(a.date) > new Date())
                .length,
            },
            { label: "Total", value: appointments.length },
          ]}
          action="Schedule Appointment"
        />
        <DashboardCard
          title="Transactions"
          description="Track your financial transactions."
          stats={[
            { label: "Deposits", value: formatCurrency(transactions.deposits) },
            { label: "Payments", value: formatCurrency(transactions.payments) },
            { label: "Refunds", value: formatCurrency(transactions.refunds) },
            { label: "Total", value: formatCurrency(transactions.total) },
          ]}
          action="View All"
        />
      </div>
      <Tabs defaultValue="estimates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="estimates">Recent Estimates</TabsTrigger>
          <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="estimates">
          {/* Render recent estimates here */}
        </TabsContent>
        <TabsContent value="invoices">
          {/* Render recent invoices here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton />
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
