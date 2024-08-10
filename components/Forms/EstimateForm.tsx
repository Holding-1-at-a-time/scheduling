// File: src/components/EstimateForm.tsx

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const estimateSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  estimateNumber: z.string().min(1, "Estimate number is required"),
  date: z.string().min(1, "Date is required"),
  expirationDate: z.string().min(1, "Expiration date is required"),
  status: z.enum(["pending", "approved", "rejected"]),
  subtotal: z.number().min(0, "Subtotal must be a positive number"),
  taxRate: z.number().min(0, "Tax rate must be a positive number"),
  total: z.number().min(0, "Total must be a positive number"),
  notes: z.string().optional(),
});

type EstimateFormData = z.infer<typeof estimateSchema>;

interface EstimateFormProps {
  orgId: Id<"organizations">;
  estimateId?: Id<"estimates">;
  initialData?: Partial<EstimateFormData>;
  onSuccess: () => void;
}

export function EstimateForm({
  orgId,
  estimateId,
  initialData,
  onSuccess,
}: EstimateFormProps) {
  const { toast } = useToast();
  const createEstimate = useMutation(api.estimates.create);
  const updateEstimate = useMutation(api.estimates.update);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EstimateFormData>({
    resolver: zodResolver(estimateSchema),
    defaultValues: initialData || {
      status: "pending",
      taxRate: 0,
      subtotal: 0,
      total: 0,
    },
  });

  const onSubmit = async (data: EstimateFormData) => {
    try {
      if (estimateId) {
        await updateEstimate({ estimateId, orgId, ...data });
        toast({ title: "Estimate updated successfully" });
      } else {
        await createEstimate({ orgId, ...data });
        toast({ title: "Estimate created successfully" });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the estimate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {estimateId ? "Edit Estimate" : "Create New Estimate"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Controller
                name="clientName"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.clientName && (
                <p className="text-red-500 text-sm">
                  {errors.clientName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimateNumber">Estimate Number</Label>
              <Controller
                name="estimateNumber"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.estimateNumber && (
                <p className="text-red-500 text-sm">
                  {errors.estimateNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => <Input type="date" {...field} />}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Controller
                name="expirationDate"
                control={control}
                render={({ field }) => <Input type="date" {...field} />}
              />
              {errors.expirationDate && (
                <p className="text-red-500 text-sm">
                  {errors.expirationDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtotal">Subtotal</Label>
              <Controller
                name="subtotal"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
              {errors.subtotal && (
                <p className="text-red-500 text-sm">
                  {errors.subtotal.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Controller
                name="taxRate"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
              {errors.taxRate && (
                <p className="text-red-500 text-sm">{errors.taxRate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total</Label>
              <Controller
                name="total"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
              {errors.total && (
                <p className="text-red-500 text-sm">{errors.total.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => <Textarea {...field} />}
            />
            {errors.notes && (
              <p className="text-red-500 text-sm">{errors.notes.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">
            {estimateId ? "Update Estimate" : "Create Estimate"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
