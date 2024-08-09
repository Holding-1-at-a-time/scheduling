// convex/services.ts

import { query } from "./_generated/server";

export const list = query({
    handler: async (ctx) => {
        return await ctx.db.query("services").collect();
    },
});
