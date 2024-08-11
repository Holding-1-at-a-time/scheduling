// convex/users.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const createUserProfile = mutation({
    args: {
        clerkId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await ctx.db.insert('users', {
            clerkId: args.clerkId,
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            createdAt: new Date().toISOString(),
        });
        return userId;
    },
});