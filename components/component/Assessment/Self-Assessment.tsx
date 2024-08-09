// File: components/assessment/SelfAssessment.tsx

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VehicleDetailsForm } from "./VehicleDetailsForm";
import { ImageUpload } from "./ImageUpload";
import { ServiceSelection } from "./ServiceSelection";
import { VehicleHotspotAssessment } from "./VehicleHotspotAssessment";
import { ReviewStep } from "./ReviewStep";
import { AssessmentData, Step } from "@/types/assessment";

export const SelfAssessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>("vehicle-details");
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    vehicleDetails: null,
    exteriorPhotos: [],
    interiorPhotos: [],
    selectedServices: [],
    hotspots: [],
  });
  const { toast } = useToast();

  const createAssessment = useMutation(api.assessments.create);
  const updateAssessment = useMutation(api.assessments.update);

  const handleNext = () => {
    const steps: Step[] = [
      "vehicle-details",
      "exterior-photos",
      "interior-photos",
      "service-selection",
      "hotspot-assessment",
      "review",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: Step[] = [
      "vehicle-details",
      "exterior-photos",
      "interior-photos",
      "service-selection",
      "hotspot-assessment",
      "review",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await createAssessment(assessmentData);
      toast({
        title: "Assessment Submitted",
        description: "Your assessment has been submitted successfully.",
        variant: "success",
      });
      // Redirect to results page or schedule appointment page
      // router.push(`/assessment/${result.id}`);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "vehicle-details":
        return (
          <VehicleDetailsForm
            initialData={assessmentData.vehicleDetails}
            onSubmit={(details) => {
              setAssessmentData((prev) => ({
                ...prev,
                vehicleDetails: details,
              }));
              handleNext();
            }}
          />
        );
      case "exterior-photos":
        return (
          <ImageUpload
            onUpload={(photos) => {
              setAssessmentData((prev) => ({
                ...prev,
                exteriorPhotos: photos,
              }));
              handleNext();
            }}
            maxPhotos={5}
            title="Exterior Photos"
            description="Please upload up to 5 photos of your vehicle's exterior"
          />
        );
      case "interior-photos":
        return (
          <ImageUpload
            onUpload={(photos) => {
              setAssessmentData((prev) => ({
                ...prev,
                interiorPhotos: photos,
              }));
              handleNext();
            }}
            maxPhotos={5}
            title="Interior Photos"
            description="Please upload up to 5 photos of your vehicle's interior"
          />
        );
      case "service-selection":
        return (
          <ServiceSelection
            onSubmit={(services) => {
              setAssessmentData((prev) => ({
                ...prev,
                selectedServices: services,
              }));
              handleNext();
            }}
          />
        );
      case "hotspot-assessment":
        return (
          <VehicleHotspotAssessment
            onAssessment={(hotspots) => {
              setAssessmentData((prev) => ({ ...prev, hotspots }));
              handleNext();
            }}
          />
        );
      case "review":
        return (
          <ReviewStep assessmentData={assessmentData} onSubmit={handleSubmit} />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Self-Assessment</CardTitle>
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === "vehicle-details"}
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={currentStep === "review"}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};
