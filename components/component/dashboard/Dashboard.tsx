import React from "react";
import { useUser, useOrganization } from "@clerk/nextjs";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { OrganizationProfile } from "./OrganizationProfile";
import { UserProfile } from "./UserProfile";
import { OrganizationMembers } from "./OrganizationMembers";
import { CreateOrganization } from "./CreateOrganization";

export const Dashboard: React.FC = () => {
  const { user, isSignedIn, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();

  if (!isUserLoaded || !isOrgLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Slick Solutions Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {organization ? (
            <>
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Organization Profile
                </h2>
                <OrganizationProfile />
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
                <OrganizationMembers />
              </section>
            </>
          ) : (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Create Your Auto Detailing Business
              </h2>
              <CreateOrganization />
            </section>
          )}
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
            <UserProfile />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Businesses</h2>
            <OrganizationSwitcher />
          </section>
        </div>
      </div>
    </div>
  );
};
