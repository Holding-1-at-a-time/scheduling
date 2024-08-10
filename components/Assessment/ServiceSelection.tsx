// File: components/assessment/ServiceSelection.tsx

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface ServiceSelectionProps {
  onSubmit: (selectedServices: string[]) => void;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onSubmit }) => {
  const services = useQuery(api.services.list);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { toast } = useToast();

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = () => {
    try {
      onSubmit(selectedServices);
    } catch (error) {
      console.error("Error submitting selected services:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting the selected services. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!services) return <div>Loading services...</div>;

  return (
    <div className="space-y-4">
      <h2>Select Services</h2>
      {services.map((service) => (
        <div key={service._id} className="flex items-center space-x-2">
          <Checkbox
            id={service._id}
            checked={selectedServices.includes(service._id)}
            onCheckedChange={() => handleServiceToggle(service._id)}
          />
          <Label htmlFor={service._id}>{service.name}</Label>
        </div>
      ))}
      <Button onClick={handleSubmit}>Next</Button>
    </div>
  );
};