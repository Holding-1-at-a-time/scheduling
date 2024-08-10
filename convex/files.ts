// File: convex/files.ts

import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { storageHelper } from "./storageHelper";

export const generateUploadUrl = mutation({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        return await ctx.storage.generateUploadUrl();
    },
});

export const saveFile = mutation({
    args: {
        tenantId: v.id("tenants"),
        storageId: v.id("_storage"),
        fileName: v.string(),
        fileType: v.string(),
    },
    handler: async (ctx, args) => {
        const { tenantId, storageId, fileName, fileType } = args;
        return await ctx.db.insert("files", {
            tenantId,
            storageId,
            fileName,
            fileType,
            uploadedAt: new Date().toISOString(),
        });
    },
});

export const getSignedUrl = action({
    args: { fileId: v.id("files"), tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const { fileId, tenantId } = args;
        const file = await ctx.runQuery(api.files.getById, { fileId, tenantId });
        if (!file) {
            throw new Error("File not found or unauthorized");
        }
        return await ctx.storage.getStorageUrl(file.storageId);
    },
});

export const getById = query({
    args: { fileId: v.id("files"), tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const { fileId, tenantId } = args;
        const file = await ctx.db.get(fileId);
        if (!file || file.tenantId !== tenantId) {
            throw new Error("File not found or unauthorized");
        }
        return file;
    },
});

export const deleteFile = mutation({
    args: { fileId: v.id("files"), tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const { fileId, tenantId } = args;
        const file = await ctx.db.get(fileId);
        if (!file || file.tenantId !== tenantId) {
            throw new Error("File not found or unauthorized");
        }
        await ctx.Id<storage>().delete(file.storageId);
        await ctx.db.delete(fileId);
    },
});

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