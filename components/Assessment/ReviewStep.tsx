// File: components/assessment/ReviewStep.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AssessmentData } from "@/types/assessment";

interface ReviewStepProps {
  assessmentData: AssessmentData;
  onSubmit: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  assessmentData,
  onSubmit,
}) => {
  const { toast } = useToast();
  const submitAssessment = useMutation(api.assessments.create);

  const handleSubmit = async () => {
    try {
      await submitAssessment(assessmentData);
      onSubmit();
      toast({
        title: "Assessment Submitted",
        description: "Your assessment has been successfully submitted.",
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2>Review Your Assessment</h2>

      <section>
        <h3>Vehicle Details</h3>
        <pre>{JSON.stringify(assessmentData.vehicleDetails, null, 2)}</pre>
      </section>

      <section>
        <h3>Selected Services</h3>
        <ul>
          {assessmentData.selectedServices.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Reported Issues</h3>
        <ul>
          {assessmentData.hotspots.map((hotspot, index) => (
            <li key={index}>
              {hotspot.part}: {hotspot.issue}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Uploaded Files</h3>
        <p>Exterior Photos: {assessmentData.exteriorPhotos.length}</p>
        <p>Interior Photos: {assessmentData.interiorPhotos.length}</p>
      </section>

      <Button onClick={handleSubmit}>Submit Assessment</Button>
    </div>
  );
};
