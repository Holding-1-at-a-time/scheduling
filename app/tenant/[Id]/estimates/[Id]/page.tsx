// File: src/pages/estimates/index.tsx

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { MoreHorizontal, Plus, Search } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function EstimatesList() {
  const { userId, orgId } = useAuth();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const estimatesQuery = useQuery(api.estimates.list, {
    orgId: orgId as Id<"organizations">,
    page,
    itemsPerPage: ITEMS_PER_PAGE,
    searchTerm,
  });

  const deleteEstimate = useMutation(api.estimates.deleteEstimate);

  if (!userId || !orgId) {
    return <div>Please log in to view estimates.</div>;
  }

  const handleDelete = async (estimateId: Id<"estimates">) => {
    try {
      await deleteEstimate({ estimateId, orgId: orgId as Id<"organizations"> });
      toast({
        title: "Estimate deleted",
        description: "The estimate has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the estimate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const renderEstimateStatus = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Estimates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search estimates..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Estimate
          </Button>
        </div>

        {estimatesQuery === undefined ? (
          <div className="space-y-2">
            {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : estimatesQuery instanceof Error ? (
          <div>Error: {estimatesQuery.message}</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estimate Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimatesQuery.estimates.map((estimate) => (
                  <TableRow key={estimate._id}>
                    <TableCell>{estimate.estimateNumber}</TableCell>
                    <TableCell>{estimate.clientName}</TableCell>
                    <TableCell>
                      {format(new Date(estimate.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>${estimate.total.toFixed(2)}</TableCell>
                    <TableCell>
                      {renderEstimateStatus(estimate.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              console.log("View estimate", estimate._id)
                            }
                          >
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              console.log("Edit estimate", estimate._id)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(estimate._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  />
                </PaginationItem>
                {[...Array(estimatesQuery.totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setPage(index + 1)}
                      isActive={page === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((p) => Math.min(estimatesQuery.totalPages, p + 1))
                    }
                    disabled={page === estimatesQuery.totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </CardContent>
    </Card>
  );
}
