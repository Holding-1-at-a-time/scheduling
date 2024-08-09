// File: components/assessment/VehicleHotspotAssessment.tsx

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Hotspot {
  part: string;
  issue: string;
}

interface VehicleHotspotAssessmentProps {
  onAssessment: (hotspots: Hotspot[]) => void;
}

export const VehicleHotspotAssessment: React.FC<
  VehicleHotspotAssessmentProps
> = ({ onAssessment }) => {
  const vehicleParts = useQuery(api.vehicleParts.list);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const { toast } = useToast();

  const handleIssueChange = (part: string, issue: string) => {
    setHotspots((prev) => {
      const index = prev.findIndex((h) => h.part === part);
      if (index >= 0) {
        return [
          ...prev.slice(0, index),
          { part, issue },
          ...prev.slice(index + 1),
        ];
      } else {
        return [...prev, { part, issue }];
      }
    });
  };

  const handleSubmit = () => {
    try {
      onAssessment(hotspots);
    } catch (error) {
      console.error("Error submitting hotspot assessment:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting the hotspot assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!vehicleParts) return <div>Loading vehicle parts...</div>;

  return (
    <div className="space-y-4">
      <h2>Vehicle Assessment</h2>
      {vehicleParts.map((part) => (
        <div key={part._id} className="space-y-2">
          <Label htmlFor={part._id}>{part.name}</Label>
          <Input
            id={part._id}
            value={hotspots.find((h) => h.part === part.name)?.issue || ""}
            onChange={(e) => handleIssueChange(part.name, e.target.value)}
            placeholder={`Describe any issues with ${part.name}`}
          />
        </div>
      ))}
      <Button onClick={handleSubmit}>Next</Button>
    </div>
  );
};
