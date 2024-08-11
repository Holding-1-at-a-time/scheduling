// File: components/dashboard/Dashboard.tsx

import { UserProfile } from "@/components/user/UserProfile";
import {
  useUser,
  useOrganization,
  OrganizationList,
  OrganizationProfile,
} from "@clerk/nextjs";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Dashboard = () => {
  const { useUser, isSignedIn, isLoaded } = useUser();
  const { organization } = useOrganization();
  const [activeTab, setActiveTab] = useState("profile");

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">User Profile</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          {organization && (
            <TabsTrigger value="org-settings">
              Organization Settings
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>

        <TabsContent value="organizations">
          <h2 className="text-2xl font-semibold mb-4">Your Organizations</h2>
          <OrganizationList
            afterCreateOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard"
          />
        </TabsContent>

        {organization && (
          <TabsContent value="org-settings">
            <h2 className="text-2xl font-semibold mb-4">
              Organization Settings
            </h2>
            <OrganizationProfile />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
