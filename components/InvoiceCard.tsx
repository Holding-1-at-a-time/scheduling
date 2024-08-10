// File: src/components/InvoiceCard.tsx
import React from "react";
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

interface Invoice {
  _id: string;
  number: string;
  clientName: string;
  total: number;
  status: "paid" | "unpaid" | "overdue";
  dueDate: number;
}

export const InvoiceCard: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
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
