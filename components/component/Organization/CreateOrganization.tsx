import React, { useState } from "react";
import { useOrganizationList } from "@clerk/nextjs";

interface OrganizationData {
  name: string;
  detailingServices: string[];
  address: string;
  phone: string;
}

export const CreateOrganization: React.FC = () => {
  const { createOrganization } = useOrganizationList();
  const [orgData, setOrgData] = useState<OrganizationData>({
    name: "",
    detailingServices: [],
    address: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrgData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setOrgData((prev) => ({
      ...prev,
      detailingServices: prev.detailingServices.includes(service)
        ? prev.detailingServices.filter((s) => s !== service)
        : [...prev.detailingServices, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrganization({
        name: orgData.name,
        privateMetadata: {
          detailingServices: orgData.detailingServices,
          address: orgData.address,
          phone: orgData.phone,
        },
      });
      // Handle successful creation (e.g., show success message, redirect)
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Failed to create organization:", error);
    }
  };

  const detailingServiceOptions = [
    "Full Detail",
    "Exterior Wash",
    "Interior Cleaning",
    "Paint Correction",
    "Ceramic Coating",
  ];

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
          value={orgData.name}
          onChange={handleInputChange}
          required
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
                checked={orgData.detailingServices.includes(service)}
                onChange={() => handleServiceToggle(service)}
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
          value={orgData.address}
          onChange={handleInputChange}
          required
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
          value={orgData.phone}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Auto Detailing Business
      </button>
    </form>
  );
};
