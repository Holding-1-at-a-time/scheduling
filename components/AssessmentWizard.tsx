/**
 * AssessmentWizard component is a multi-step form for creating an assessment.
 * It uses React Hook Form with Zod for form validation and submission.
 */
'use client';

import React, { useState, useCallback, useMemo } from "react";
import { useAuth } from "clerk/nextjs";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "next-i18next";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Interface for the data entered in the assessment form.
 */
interface AssessmentData {
  vehicleType: string;
  vehicleCondition: string;
  specificConcerns: string;
  images: File[];
}

/**
 * Interface for the tenant configuration.
 */
interface TenantConfig {
  id: Id<"tenants">;
  name: string;
  allowedVehicleTypes: string[];
  maxImages: number;
}

// Define Zod schema for form validation
/**
 * Zod schema for form validation.
 */
const assessmentSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required"),
  vehicleCondition: z
    .string()
    .min(10, "Please provide a more detailed description"),
  specificConcerns: z.string().optional(),
  images: z.array(z.instanceof(File)).max(5, "Maximum 5 images allowed"),
});

/**
 * Type inferred from the assessment schema.
 */
type AssessmentSchemaType = z.infer<typeof assessmentSchema>;

/**
 * AssessmentWizard component.
 */
const AssessmentWizard: React.FC = () => {
  // Auth state
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Mutation for creating an assessment
  const createAssessment = useMutation(api.assessments.create);

  // Translation hook
  const { t } = useTranslation("common");

  // Toast notification hook
  const { toast } = useToast();

  // State for current step
  const [step, setStep] = useState(0);

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query for getting the current tenant ID
  const tenantId = useQuery(api.tenants.getCurrentTenantId);

  // Query for getting tenant configuration
  const tenantConfig = useQuery(
    api.tenants.getTenantConfig,
    tenantId ? { id: tenantId } : "skip"
  );

  // Hook for form management
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<AssessmentSchemaType>({
    resolver: zodResolver(assessmentSchema),
    mode: "onBlur",
  });

  // Handle next step
  const handleNext = useCallback(async () => {
    const isValid = await trigger();
    if (isValid) setStep((prev) => Math.min(prev + 1, 3));
  }, [trigger]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Handle form submission
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
      const handleAssessmentSubmit = useCallback(
        async (formData: AssessmentSchemaType) => {
          setIsSubmitting(true);

          try {
            const assessment = await createAssessment(formData);
            toast({
              title: t("success"),
              description: t("assessmentCreated"),
            });
            router.push(`/assessments/${assessment.id}`);
            setAssessmentData(assessment);
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
        [createAssessment, router, setAssessmentData, t, toast]
      );
      handleAssessmentSubmit(data);
    },
    [createAssessment, router, setAssessmentData, t, toast]
  );

  // Define form steps
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

  // Current step
  const currentStep = steps[step];

  // Check if data is loading
  if (authLoading || !tenantConfig) {
    return <div>{t("loading")}</div>;
  }

  // Render form
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
            )
            }
        <CardFooter className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === steps[0]}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps[steps.length - 1]}
          >
            Next
          </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


    