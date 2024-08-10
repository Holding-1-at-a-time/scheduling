import { query } from "./_generated/server";


export const listRecent = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("invoices")
            .order("desc")
            .take(6);
    },
});


export const listInvoices = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("invoices").collect();
    },
})

export const getInvoice = query({
    args: {
        id: "id",
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invoices")
            .filter((q) => q.eq(q.field("id"), args.id))
            .first();
    },
})

export const createInvoice = query({
    args: {
        clientName: "string",
        total: "number",
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invoices")
            .insert({
                clientName: args.clientName,
                total: args.total,
                createdAt: new Date().getTime(),
            })
            .single();
    },
})

export const updateInvoice = query({
    args: {
        id: "id",
        clientName: "string",
        total: "number",
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invoices")
            .filter((q) => q.eq(q.field("id"), args.id))
            .update({
                clientName: args.clientName,
                total: args.total,
            })
            .single();
    },
})

export const deleteInvoice = query({
    args: {
        id: "id",
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invoices")
            .filter((q) => q.eq(q.field("id"), args.id))
            .delete();
    },
})

