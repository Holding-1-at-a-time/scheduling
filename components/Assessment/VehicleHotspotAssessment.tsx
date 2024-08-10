// File: components/assessment/VehicleHotspotAssessment.tsx

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface VehicleHotspotAssessmentProps {
  onAssessment: (hotspots: Hotspot[]) => void;
}

interface Hotspot {
  part: string;
  issue: string;
  severity: "low" | "medium" | "high";
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

  const handleIssueChange = (
    part: string,
    issue: string,
    severity: "low" | "medium" | "high"
  ) => {
    setHotspots((prev) => {
      const index = prev.findIndex((h) => h.part === part);
      if (index >= 0) {
        return [
          ...prev.slice(0, index),
          { part, issue, severity },
          ...prev.slice(index + 1),
        ];
      } else {
        return [...prev, { part, issue, severity }];
      }
    });
  };

  const handleSubmit = () => {
    if (hotspots.length === 0) {
      toast({
        title: "No issues reported",
        description: "Are you sure there are no issues to report?",
        variant: "warning",
      });
    }

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
          <Label htmlFor={`${part._id}-issue`}>{part.name}</Label>
          <Input
            id={`${part._id}-issue`}
            value={hotspots.find((h) => h.part === part.name)?.issue ?? ""}
            onChange={(e) =>
              handleIssueChange(
                part.name,
                e.target.value,
                hotspots.find((h) => h.part === part.name)?.severity ?? "low"
              )
            }
            placeholder={`Describe any issues with ${part.name}`}
          />
          <Select
            onValueChange={(value: "low" | "medium" | "high") =>
              handleIssueChange(
                part.name,
                hotspots.find((h) => h.part === part.name)?.issue ?? "",
                value
              )
            }
            defaultValue="low"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
      <Button onClick={handleSubmit}>Next</Button>
    </div>
  );
};
