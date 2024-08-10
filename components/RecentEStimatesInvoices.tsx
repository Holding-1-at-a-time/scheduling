import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Estimate {
  _id: string;
  number: string;
  clientName: string;
  total: number;
  status: "pending" | "approved" | "declined";
  createdAt: number;
}

interface Invoice {
  _id: string;
  number: string;
  clientName: string;
  total: number;
  status: "paid" | "unpaid" | "overdue";
  dueDate: number;
}

const EstimateCard: React.FC<{ estimate: Estimate }> = ({ estimate }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex justify-between">
        <span>Estimate #{estimate.number}</span>
        <Badge>{estimate.status}</Badge>
      </CardTitle>
      <CardDescription>{estimate.clientName}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">${estimate.total.toFixed(2)}</p>
      <p className="text-sm text-muted-foreground">
        Created on {new Date(estimate.createdAt).toLocaleDateString()}
      </p>
    </CardContent>
    <CardFooter>
      <Button className="w-full">View Details</Button>
    </CardFooter>
  </Card>
);

const InvoiceCard: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex justify-between">
        <span>Invoice #{invoice.number}</span>
        <Badge>{invoice.status}</Badge>
      </CardTitle>
      <CardDescription>{invoice.clientName}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">${invoice.total.toFixed(2)}</p>
      <p className="text-sm text-muted-foreground">
        Due on {new Date(invoice.dueDate).toLocaleDateString()}
      </p>
    </CardContent>
    <CardFooter>
      <Button className="w-full">View Details</Button>
    </CardFooter>
  </Card>
);

export const RecentEstimatesInvoices: React.FC = () => {
  const recentEstimates = useQuery(api.estimates.listRecent) || [];
  const recentInvoices = useQuery(api.invoices.listRecent) || [];

  return (
    <Tabs defaultValue="estimates" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="estimates">Recent Estimates</TabsTrigger>
        <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
      </TabsList>
      <TabsContent value="estimates">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentEstimates.map((estimate) => (
            <EstimateCard key={estimate._id} estimate={estimate} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="invoices">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentInvoices.map((invoice) => (
            <InvoiceCard key={invoice._id} invoice={invoice} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
