import React, { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";

interface OrganizationDetails {
  name: string;
  detailingServices: string[];
  address: string;
  phone: string;
}

export const OrganizationProfile: React.FC = () => {
  const { organization, isLoaded, membership } = useOrganization();
  const [orgDetails, setOrgDetails] = useState<OrganizationDetails>({
    name: "",
    detailingServices: [],
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (isLoaded && organization) {
      setOrgDetails({
        name: organization.name,
        detailingServices:
          (organization.privateMetadata.detailingServices as string[]) || [],
        address: (organization.privateMetadata.address as string) || "",
        phone: (organization.privateMetadata.phone as string) || "",
      });
    }
  }, [isLoaded, organization]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrgDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setOrgDetails((prev) => ({
      ...prev,
      detailingServices: prev.detailingServices.includes(service)
        ? prev.detailingServices.filter((s) => s !== service)
        : [...prev.detailingServices, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    try {
      await organization.update({
        name: orgDetails.name,
        privateMetadata: {
          detailingServices: orgDetails.detailingServices,
          address: orgDetails.address,
          phone: orgDetails.phone,
        },
      });
      // Handle successful update (e.g., show success message)
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Failed to update organization:", error);
    }
  };

  const detailingServiceOptions = [
    "Full Detail",
    "Exterior Wash",
    "Interior Cleaning",
    "Paint Correction",
    "Ceramic Coating",
  ];

  if (!isLoaded || !organization) {
    return <div>Loading...</div>;
  }

  const canEdit = membership?.role === "org:admin";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Business Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={orgDetails.name}
          onChange={handleInputChange}
          disabled={!canEdit}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Detailing Services
        </label>
        <div className="mt-2 space-y-2">
          {detailingServiceOptions.map((service) => (
            <label key={service} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={orgDetails.detailingServices.includes(service)}
                onChange={() => handleServiceToggle(service)}
                disabled={!canEdit}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2">{service}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Business Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={orgDetails.address}
          onChange={handleInputChange}
          disabled={!canEdit}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Business Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={orgDetails.phone}
          onChange={handleInputChange}
          disabled={!canEdit}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      {canEdit && (
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Business Profile
        </button>
      )}
    </form>
  );
};
