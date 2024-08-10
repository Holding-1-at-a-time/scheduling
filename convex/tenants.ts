// convex/tenants.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "./_generated/dataModel";
import { getUser } from "./users";

export const createTenant = mutation({
    args: {
        name: v.string(),
        subdomain: v.string(),
    },
    handler: async (ctx, args) => {
        const tenantId = await ctx.db.insert('tenants', {
            name: args.name,
            subdomain: args.subdomain,
            createdAt: new Date().toISOString(),
        });
        return { id: tenantId };
    },
});

export const updateTenantDomain = mutation({
    args: {
        tenantId: v.id('tenants'),
        domain: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.tenantId, {
            verifiedDomain: args.domain,
        });
    },
});

export const getTenantConfig = query({
    args: {},
    handler: async (ctx) => {
        const user = await getUser(ctx);
        if (!user) throw new ConvexError("Unauthorized");

        const tenant = await ctx.db
            .query("tenants")
            .filter((q) => q.eq(q.field("id"), user.tenantId))
            .first();
        if (!tenant) throw new ConvexError("Tenant not found");

        return {
            allowedVehicleTypes: tenant.allowedVehicleTypes,
            maxImages: tenant.maxImages,
            maxVideos: tenant.maxVideos,
        };
    },
});

export const updateTenantConfig = mutation({
    args: {
        allowedVehicleTypes: v.optional(v.array(v.string())),
        maxImages: v.number(v.number()),
        maxVideos: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx);
        if (!user) throw new ConvexError("Unauthorized");

        const tenant = await ctx.db
            .query("tenants")
            .filter((q) => q.eq(q.field("id"), user.tenantId))
            .first();
        if (!tenant) throw new ConvexError("Tenant not found");

        await ctx.db.patch(tenant._id, {
            ...(args.allowedVehicleTypes && { allowedVehicleTypes: args.allowedVehicleTypes }),
            ...(args.maxImages && { maxImages: args.maxImages }),
            ...(args.maxVideos && { maxVideos: args.maxVideos }),
        });

        return true;
    },
});