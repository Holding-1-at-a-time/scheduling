import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface AIEstimationProps {
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    condition: string;
  };
  selectedServices: Array<{ id: string; name: string }>;
  customizations: Array<{ id: string; name: string }>;
  uploadedFiles: Array<{ id: string; url: string }>;
}

export function AIEstimation({
  vehicleDetails,
  selectedServices,
  customizations,
  uploadedFiles,
}: AIEstimationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const tenant = useQuery(api.tenants.getCurrentTenant);
  const generateAnalysis = useMutation(api.aiAnalysis.generate);
  const aiAnalysis = useQuery(
    api.aiAnalysis.getLatest,
    tenant ? { tenantId: tenant._id } : null
  );
  const estimatedTotal = useQuery(
    api.estimates.calculateTotal,
    tenant && aiAnalysis
      ? { tenantId: tenant._id, analysisId: aiAnalysis._id }
      : null
  );

  const handleGenerateAnalysis = useCallback(async () => {
    if (!tenant) {
      setError("Tenant information not available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await generateAnalysis({
        tenantId: tenant._id,
        vehicleDetails,
        selectedServices: selectedServices.map((s) => s.id),
        customizations: customizations.map((c) => c.id),
        uploadedFileIds: uploadedFiles.map((f) => f.id),
      });

      toast({
        title: "Analysis generated successfully",
        description: "Your AI-powered estimation is ready.",
      });
    } catch (err) {
      setError("Failed to generate AI analysis. Please try again.");
      toast({
        title: "Error",
        description: "Failed to generate analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    tenant,
    vehicleDetails,
    selectedServices,
    customizations,
    uploadedFiles,
    generateAnalysis,
    toast,
  ]);

  useEffect(() => {
    if (
      tenant &&
      vehicleDetails.make &&
      selectedServices.length > 0 &&
      uploadedFiles.length > 0
    ) {
      handleGenerateAnalysis();
    }
  }, [
    tenant,
    vehicleDetails,
    selectedServices,
    customizations,
    uploadedFiles,
    handleGenerateAnalysis,
  ]);

  if (!tenant) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Tenant information not available</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Estimation</CardTitle>
        <CardDescription>
          Our AI analyzes your vehicle's condition and selected services to
          provide a detailed estimate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="font-semibold">AI Analysis</Label>
            {isLoading ? (
              <Skeleton className="w-full h-20" />
            ) : error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : aiAnalysis ? (
              <p className="text-sm mt-1">{aiAnalysis.analysis}</p>
            ) : (
              <p className="text-sm mt-1">
                No analysis available. Click 'Generate Analysis' to start.
              </p>
            )}
          </div>
          <div>
            <Label className="font-semibold">Estimated Total</Label>
            {estimatedTotal ? (
              <p className="text-lg font-bold mt-1">
                ${estimatedTotal.toFixed(2)}
              </p>
            ) : (
              <Skeleton className="w-24 h-8" />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateAnalysis} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Analysis"}
        </Button>
      </CardFooter>
    </Card>
  );
}
