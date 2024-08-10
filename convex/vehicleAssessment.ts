// File: convex/vehicleAssessments.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        tenantId: v.id("tenants"),
        vehicleDetails: v.object({
            make: v.string(),
            model: v.string(),
            year: v.string(),
            vin: v.string(),
            mileage: v.string(),
            exteriorColor: v.optional(v.string()),
            interiorColor: v.optional(v.string()),
            modifications: v.optional(v.string()),
            lastDetailingDate: v.optional(v.string()),
        }),
        selectedServices: v.array(v.id("services")),
        customizations: v.array(v.string()),
        imageIds: v.array(v.id("_storage")),
        videoIds: v.array(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const { tenantId, vehicleDetails, selectedServices, customizations, imageIds, videoIds } = args;

        // Verify that all selected services belong to the tenant
        const servicesCheck = await ctx.db
            .query("services")
            .filter((q) => q.and(
                q.eq(q.field("tenantId"), tenantId),
                q.inArray(q.field("_id"), selectedServices)
            ))
            .collect();

        if (servicesCheck.length !== selectedServices.length) {
            throw new Error("Invalid services selected");
        }

        return await ctx.db.insert("vehicleAssessments", {
            tenantId,
            vehicleDetails,
            selectedServices,
            customizations,
            imageIds,
            videoIds,
            status: "pending",
            createdAt: new Date().toISOString(),
        });
    },
});

export const listByTenant = query({
    args: {
        tenantId: v.id("tenants"),
        status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
        limit: v.optional(v.number()),
        cursor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { tenantId, status, limit = 10, cursor } = args;
        let query = ctx.db
            .query("vehicleAssessments")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId));

        if (status) {
            query = query.filter((q) => q.eq(q.field("status"), status));
        }

        return await query
            .order("desc")
            .paginate({ limit, cursor });
    },
});

export const getById = query({
    args: { assessmentId: v.id("vehicleAssessments"), tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const { assessmentId, tenantId } = args;
        const assessment = await ctx.db.get(assessmentId);
        if (!assessment || assessment.tenantId !== tenantId) {
            throw new Error("Assessment not found or unauthorized");
        }
        return assessment;
    },
});

export const updateStatus = mutation({
    args: {
        assessmentId: v.id("vehicleAssessments"),
        tenantId: v.id("tenants"),
        status: v.union(v.literal("approved"), v.literal("rejected")),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { assessmentId, tenantId, status, notes } = args;
        const assessment = await ctx.db.get(assessmentId);
        if (!assessment || assessment.tenantId !== tenantId) {
            throw new Error("Assessment not found or unauthorized");
        }
        return await ctx.db.patch(assessmentId, { status, notes, updatedAt: new Date().toISOString() });
    },
});