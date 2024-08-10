// Analysis of AssessmentWizard Component Limitations:
'use client';

import React, { useState, useCallback, useMemo } from "react";
import { useConvexAuth } from "convex/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "next-i18next";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AssessmentData {
  vehicleType: string;
  vehicleCondition: string;
  specificConcerns: string;
  images: File[];
}

interface TenantConfig {
  id: Id<"tenants">;
  name: string;
  allowedVehicleTypes: string[];
  maxImages: number;
}

// Define Zod schema for form validation
const assessmentSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required"),
  vehicleCondition: z
    .string()
    .min(10, "Please provide a more detailed description"),
  specificConcerns: z.string().optional(),
  images: z.array(z.instanceof(File)).max(5, "Maximum 5 images allowed"),
});

type AssessmentSchemaType = z.infer<typeof assessmentSchema>;

const AssessmentWizard: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const createAssessment = useMutation(api.assessments.create);
  const { t } = useTranslation("common");
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tenant configuration
  const tenantId = useQuery(api.tenants.getCurrentTenantId);
  const tenantConfig = useQuery(
    api.tenants.getTenantConfig,
    tenantId ? { id: tenantId } : "skip"
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<AssessmentSchemaType>({
    resolver: zodResolver(assessmentSchema),
    mode: "onBlur",
  });

  const handleNext = useCallback(async () => {
    const isValid = await trigger();
    if (isValid) setStep((prev) => Math.min(prev + 1, 3));
  }, [trigger]);

  const handlePrevious = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const onSubmit = useCallback(
    async (data: AssessmentSchemaType) => {
      if (!isAuthenticated) {
        toast({
          title: t("error"),
          description: t("notAuthenticated"),
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await createAssessment(data);
        toast({
          title: t("success"),
          description: t("assessmentCreated"),
        });
        // Handle success (e.g., redirect to results page)
      } catch (error) {
        console.error("Error creating assessment:", error);
        toast({
          title: t("error"),
          description: t("assessmentCreationFailed"),
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [isAuthenticated, createAssessment, t, toast]
  );

  const steps = useMemo(
    () => [
      {
        title: t("vehicleType"),
        field: "vehicleType",
        type: "select",
        options: tenantConfig?.allowedVehicleTypes || [],
      },
      {
        title: t("vehicleCondition"),
        field: "vehicleCondition",
        type: "textarea",
      },
      {
        title: t("specificConcerns"),
        field: "specificConcerns",
        type: "textarea",
      },
      {
        title: t("uploadImages"),
        field: "images",
        type: "file",
      },
    ],
    [t, tenantConfig]
  );

  const currentStep = steps[step];

  if (authLoading || !tenantConfig) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name={currentStep.field as keyof AssessmentSchemaType}
              control={control}
              render={({ field }) => {
                switch (currentStep.type) {
                  case "select":
                    return (
                      <select {...field} className="w-full p-2 border rounded">
                        <option value="">{t("selectVehicleType")}</option>
                        {currentStep.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    );
                  case "textarea":
                    return <Textarea {...field} />;
                  case "file":
                    return (
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          field.onChange(Array.from(e.target.files || []))
                        }
                      />
                    );
                  default:
                    return <Input {...field} />;
                }
              }}
            />
            {errors[currentStep.field as keyof AssessmentSchemaType] && (
              <Alert variant="destructive">
                <AlertTitle>{t("error")}</AlertTitle>
                <AlertDescription>
                  {
                    errors[currentStep.field as keyof AssessmentSchemaType]
                      ?.message
                  }
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        <CardFooter>
          {step > 0 && (
            <Button onClick={handlePrevious} disabled={isSubmitting}>
              {t("previous")}
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={isSubmitting}>
              {t("next")}
            </Button>
          ) : (
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? t("submitting") : t("submit")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AssessmentWizard;
