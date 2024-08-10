// components/admin/TenantRegistration.tsx

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { createSubdomain, verifyDomain } from "../../lib/vercelApi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

const tenantSchema = z.object({
  name: z.string().min(3).max(50),
  subdomain: z
    .string()
    .min(3)
    .max(63)
    .regex(/^[a-z0-9-]+$/),
});

type TenantFormData = z.infer<typeof tenantSchema>;

export function TenantRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTenant = useMutation(api.tenants.createTenant);
  const updateTenantDomain = useMutation(api.tenants.updateTenantDomain);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
  });

  const onSubmit = async (data: TenantFormData) => {
    setIsSubmitting(true);
    try {
      const newTenant = await createTenant(data);

      const domain = await createSubdomain(
        data.subdomain,
        process.env.NEXT_PUBLIC_ROOT_DOMAIN!
      );
      await verifyDomain(domain.name);

      await updateTenantDomain({ tenantId: newTenant.id, domain: domain.name });

      toast.success("Tenant created successfully with subdomain!");
      reset();
    } catch (error) {
      console.error("Error creating tenant:", error);
      toast.error("Error creating tenant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Tenant Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="subdomain"
          className="block text-sm font-medium text-gray-700"
        >
          Subdomain
        </label>
        <input
          id="subdomain"
          type="text"
          {...register("subdomain")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.subdomain && (
          <p className="mt-1 text-sm text-red-600">
            {errors.subdomain.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isSubmitting ? "Creating..." : "Create Tenant"}
      </button>
    </form>
  );
}
