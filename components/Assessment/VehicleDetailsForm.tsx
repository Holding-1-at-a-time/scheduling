// File: components/assessment/VehicleDetailsForm.tsx

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  color: z.string().min(1, "Color is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  vin: z.string().optional(),
  bodyType: z.enum(["sedan", "suv", "truck", "van", "other"]),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleDetailsFormProps {
  onSubmit: (data: VehicleFormData) => void;
  initialData?: Partial<VehicleFormData>;
}

export const VehicleDetailsForm: React.FC<VehicleDetailsFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData,
  });

  const onSubmitForm = (data: VehicleFormData) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error("Error submitting vehicle details:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting the vehicle details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <Label htmlFor="make">Make</Label>
        <Controller
          name="make"
          control={control}
          render={({ field }) => <Input {...field} id="make" />}
        />
        {errors.make && <p className="text-red-500">{errors.make.message}</p>}
      </div>

      <div>
        <Label htmlFor="model">Model</Label>
        <Controller
          name="model"
          control={control}
          render={({ field }) => <Input {...field} id="model" />}
        />
        {errors.model && <p className="text-red-500">{errors.model.message}</p>}
      </div>

      <div>
        <Label htmlFor="year">Year</Label>
        <Controller
          name="year"
          control={control}
          render={({ field }) => <Input {...field} id="year" type="number" />}
        />
        {errors.year && <p className="text-red-500">{errors.year.message}</p>}
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <Controller
          name="color"
          control={control}
          render={({ field }) => <Input {...field} id="color" />}
        />
        {errors.color && <p className="text-red-500">{errors.color.message}</p>}
      </div>

      <div>
        <Label htmlFor="licensePlate">License Plate</Label>
        <Controller
          name="licensePlate"
          control={control}
          render={({ field }) => <Input {...field} id="licensePlate" />}
        />
        {errors.licensePlate && (
          <p className="text-red-500">{errors.licensePlate.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="vin">VIN (Optional)</Label>
        <Controller
          name="vin"
          control={control}
          render={({ field }) => <Input {...field} id="vin" />}
        />
        {errors.vin && <p className="text-red-500">{errors.vin.message}</p>}
      </div>

      <div>
        <Label htmlFor="bodyType">Body Type</Label>
        <Controller
          name="bodyType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.bodyType && (
          <p className="text-red-500">{errors.bodyType.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Controller
          name="condition"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.condition && (
          <p className="text-red-500">{errors.condition.message}</p>
        )}
      </div>

      <Button type="submit">Next</Button>
    </form>
  );
};
