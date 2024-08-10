// File: convex/estimates.ts

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';

export const list = query({
    args: {
        orgId: v.id('organizations'),
        page: v.number(),
        itemsPerPage: v.number(),
        searchTerm: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { orgId, page, itemsPerPage, searchTerm } = args;

        let estimatesQuery = ctx.db
            .query('estimates')
            .withIndex('by_orgId', (q) => q.eq('orgId', orgId))
            .order('desc');

        if (searchTerm) {
            estimatesQuery = estimatesQuery.filter((q) =>
                q.or(
                    q.like(q.field('estimateNumber'), `%${searchTerm}%`),
                    q.like(q.field('clientName'), `%${searchTerm}%`)
                )
            );
        }

        const totalCount = await estimatesQuery.collect().length;
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        const estimates = await estimatesQuery
            .paginate({ pageSize: itemsPerPage })
            .page(page - 1)
            .collect();

        return { estimates, totalPages };
    },
});

export const deleteEstimate = mutation({
    args: { estimateId: v.id('estimates'), orgId: v.id('organizations') },
    handler: async (ctx, args) => {
        const { estimateId, orgId } = args;

        const estimate = await ctx.db.get(estimateId);
        if (!estimate || estimate.orgId !== orgId) {
            throw new Error('Estimate not found or you do not have permission to delete it');
        }

        await ctx.db.delete(estimateId);
    },
});

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