// File: pages/assessment/[id].tsx

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AssessmentResult = () => {
  const router = useRouter();
  const { id } = router.query;
  const assessment = useQuery(api.assessments.get, { id: id as string });

  if (!assessment) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Assessment Result</CardTitle>
      </CardHeader>
      <CardContent>
        <h2>Vehicle Details</h2>
        <pre>{JSON.stringify(assessment.vehicleDetails, null, 2)}</pre>

        <h2>Selected Services</h2>
        <ul>
          {assessment.selectedServices.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>

        <h2>Reported Issues</h2>
        <ul>
          {assessment.hotspots.map((hotspot, index) => (
            <li key={index}>
              {hotspot.part}: {hotspot.issue} (Severity: {hotspot.severity})
            </li>
          ))}
        </ul>

        <h2>Uploaded Photos</h2>
        <p>Exterior Photos: {assessment.exteriorPhotos.length}</p>
        <p>Interior Photos: {assessment.interiorPhotos.length}</p>

        <h2>Status</h2>
        <p>{assessment.status}</p>
      </CardContent>
    </Card>
  );
};

export default AssessmentResult;
