// File: convex/estimates.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const listRecent = query({
    args: {
        tenantId: v.string(),
        page: v.number(),
        pageSize: v.number(),
    },
    handler: async (ctx, args) => {
        const { tenantId, page, pageSize } = args;

        // Basic security check
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        // Fetch total count for pagination
        const totalCount = await ctx.db
            .query("estimates")
            .filter(q => q.eq(q.field("tenantId"), tenantId))
            .count();

        // Fetch paginated estimates
        const estimates = await ctx.db
            .query("estimates")
            .filter(q => q.eq(q.field("tenantId"), tenantId))
            .order("desc")
            .paginate(page, pageSize);

        return {
            items: estimates,
            totalCount,
        };
    },
});