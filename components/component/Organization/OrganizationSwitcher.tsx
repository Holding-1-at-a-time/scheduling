import React from "react";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { Organization } from "@clerk/nextjs/server";

interface OrganizationItemProps {
  organization: Organization;
  isActive: boolean;
  onSelect: (organization: Organization) => void;
}

const OrganizationItem: React.FC<OrganizationItemProps> = ({
  organization,
  isActive,
  onSelect,
}) => (
  <li
    className={`py-2 px-4 cursor-pointer ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`}
    onClick={() => onSelect(organization)}
  >
    {organization.name}
  </li>
);

export const OrganizationSwitcher: React.FC = () => {
  const { organizationList, setActive } = useOrganizationList();
  const { organization: activeOrganization } = useOrganization();

  const handleOrganizationSelect = async (org: Organization) => {
    await setActive({ organization: org.id });
  };

  return (
    <div className="border rounded-md shadow-sm">
      <h2 className="text-lg font-semibold p-4 border-b">
        Your Auto Detailing Businesses
      </h2>
      <ul>
        {organizationList.map((org) => (
          <OrganizationItem
            key={org.id}
            organization={org}
            isActive={org.id === activeOrganization?.id}
            onSelect={handleOrganizationSelect}
          />
        ))}
      </ul>
    </div>
  );
};
