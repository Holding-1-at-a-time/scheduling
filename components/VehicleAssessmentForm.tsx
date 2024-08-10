// File: components/VehicleAssessmentForm.tsx

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import VINScanner from "@/components/VINScanner";
import ServiceSelection from "@/components/ServiceSelectionComponent";
import FileUploads from "@/components/FileUploadsComponent";

const schema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  vin: z.string().length(17, "VIN must be 17 characters"),
  mileage: z.string().regex(/^\d+$/, "Mileage must be a number"),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  modifications: z.string().optional(),
  lastDetailingDate: z.string().optional(),
  selectedServices: z.record(z.boolean()),
  customizations: z.array(z.string()),
  images: z.array(z.any()),
  videos: z.array(z.any()),
});

type FormData = z.infer<typeof schema>;

interface VehicleAssessmentFormProps {
  tenantId: Id<"organizations">;
}

const VehicleAssessmentForm: React.FC<VehicleAssessmentFormProps> = ({
  tenantId,
}) => {
  const { toast } = useToast();
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      selectedServices: {},
      customizations: [],
      images: [],
      videos: [],
    },
  });

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = methods;

  const services = useQuery(api.services.listByTenant, { tenantId }) || [];
  const createAssessment = useMutation(api.assessments.create);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (services.length > 0) {
      const defaultSelectedServices = services.reduce(
        (acc, service) => {
          acc[service._id] = false;
          return acc;
        },
        {} as Record<Id<"services">, boolean>
      );
      setValue("selectedServices", defaultSelectedServices);
    }
  }, [services, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createAssessment({
        tenantId,
        vehicleDetails: {
          make: data.make,
          model: data.model,
          year: data.year,
          vin: data.vin,
          mileage: data.mileage,
          exteriorColor: data.exteriorColor,
          interiorColor: data.interiorColor,
          modifications: data.modifications,
          lastDetailingDate: data.lastDetailingDate,
        },
        selectedServices: Object.entries(data.selectedServices)
          .filter(([, isSelected]) => isSelected)
          .map(([serviceId]) => serviceId as Id<"services">),
        customizations: data.customizations,
        images: data.images,
        videos: data.videos,
      });
      toast({
        title: "Assessment submitted successfully",
        description: "We'll review your submission and get back to you soon.",
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Error submitting assessment",
        description:
          "Please try again later or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVINDecode = (info: Partial<FormData>) => {
    Object.entries(info).forEach(([key, value]) => {
      setValue(key as keyof FormData, value);
    });
  };

  if (services.length === 0) {
    return (
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No services available for this tenant. Please contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Vehicle Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="make">Make</Label>
                <Input id="make" {...methods.register("make")} />
                {errors.make && (
                  <p className="text-red-500">{errors.make.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input id="model" {...methods.register("model")} />
                {errors.model && (
                  <p className="text-red-500">{errors.model.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" {...methods.register("year")} />
                {errors.year && (
                  <p className="text-red-500">{errors.year.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="vin">VIN</Label>
                <Input id="vin" {...methods.register("vin")} />
                {errors.vin && (
                  <p className="text-red-500">{errors.vin.message}</p>
                )}
                <VINScanner onVINDecoded={handleVINDecode} />
              </div>
              {/* Add other vehicle detail fields here */}
            </div>

            <ServiceSelection services={services} />

            <FileUploads />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default VehicleAssessmentForm;
