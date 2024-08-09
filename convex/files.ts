// File: convex/files.ts

import { mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) throw new Error("Unauthenticated");
        return await ctx.storage.generateUploadUrl();
    },
});

export const saveFile = mutation({
    args: { storageId: v.string(), fileName: v.string() },
    handler: async (ctx, args) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) throw new Error("Unauthenticated");
        const fileType = await getFileType(ctx, args.storageId);
        return await ctx.db.insert("files", {
            storageId: args.storageId,
            fileName: args.fileName,
            fileType,
            uploadedBy: userId.subject,
        });
    },
});

const getFileType = action({
    args: { storageId: v.string() },
    handler: async (ctx, args): Promise<string> => {
        const storage = ctx.storage;
        const file = await storage.getFile(args.storageId);
        if (!file) throw new Error("File not found");
        return file.type;
    },
});