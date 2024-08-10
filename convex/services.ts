// File: convex/services.ts

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByTenant = query({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const { tenantId } = args;
        return await ctx.db
            .query("services")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .collect();
    },
});

export const create = mutation({
    args: {
        tenantId: v.id("tenants"),
        name: v.string(),
        description: v.string(),
        basePrice: v.number(),
    },
    handler: async (ctx, args) => {
        const { tenantId, name, description, basePrice } = args;
        return await ctx.db.insert("services", {
            tenantId,
            name,
            description,
            basePrice,
        });
    },
});

export const update = mutation({
    args: {
        serviceId: v.id("services"),
        tenantId: v.id("tenants"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        basePrice: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { serviceId, tenantId, ...updateFields } = args;
        const existingService = await ctx.db.get(serviceId);
        if (!existingService || existingService.tenantId !== tenantId) {
            throw new Error("Service not found or unauthorized");
        }
        return await ctx.db.patch(serviceId, updateFields);
    },
});

export const remove = mutation({
    args: { serviceId: v.id("services"), tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const { serviceId, tenantId } = args;
        const existingService = await ctx.db.get(serviceId);
        if (!existingService || existingService.tenantId !== tenantId) {
            throw new Error("Service not found or unauthorized");
        }
        await ctx.db.delete(serviceId);
    },
});