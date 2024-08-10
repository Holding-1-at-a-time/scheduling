// File: convex/assessments.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        vehicleDetails: v.object({
            make: v.string(),
            model: v.string(),
            year: v.number(),
            color: v.string(),
            licensePlate: v.string(),
            vin: v.optional(v.string()),
            bodyType: v.string(),
            condition: v.string(),
        }),
        selectedServices: v.array(v.string()),
        hotspots: v.array(v.object({
            part: v.string(),
            issue: v.string(),
            severity: v.string(),
        })),
        exteriorPhotos: v.array(v.string()),
        interiorPhotos: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) throw new Error("Unauthenticated");
        return await ctx.db.insert("assessments", { ...args, userId: userId.subject, status: "pending" });
    },
});

export const get = query({
    args: { id: v.id("assessments") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const listUserAssessments = query({
    handler: async (ctx) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) throw new Error("Unauthenticated");
        return await ctx.db
            .query("assessments")
            .filter(q => q.eq(q.field("userId"), userId.subject))
            .order("desc")
            .collect();
    },
});

export const update = mutation({
    args: {
        id: v.id("assessments"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const { id, status } = args;
        await ctx.db.patch(id, { status });
        return { success: true };
    },
});