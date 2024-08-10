import { query } from "./_generated/server"

export const listRecent = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("estimates")
            .order("desc")
            .take(6);
    },
});

export const listEstimates = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("estimates").collect();
    },
});

export const getEstimate = query({
    args: {
        id: "id",
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("estimates")
            .filter((q) => q.eq(q.field("id"), args.id))
            .first();
    },
});

export const createEstimate = query({
    args: {
        clientName: "string",
        total: "number",
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("estimates")
            .insert({
                clientName: args.clientName,
                total: args.total,
                createdAt: new Date().getTime(),
            })
            .single();
    },
});

export const updateEstimate = query({
    args: {
        id: "id",
        clientName: "string",
        total: "number",
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("estimates")
            .filter((q) => q.eq(q.field("id"), args.id))
            .update({
                clientName: args.clientName,
                total: args.total,
            })
            .single();
    },
});

export const deleteEstimate = query({
    args: {
        id: "id",
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("estimates")
            .filter((q) => q.eq(q.field("id"), args.id))
            .delete();
    },
});
