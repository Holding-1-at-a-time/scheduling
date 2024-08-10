// File: convex/vehicles.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const VEHICLE_DETAILS_API = "https://vehicle-details-api.com/vehicle-details";

export const getVehicleDetailsByVIN = query({
    args: { vin: v.string() },
    handler: async (ctx, args) => {
        const response = await fetch(`${VEHICLE_DETAILS_API}/${args.vin}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch vehicle details for VIN ${args.vin}`);
        }
        return await response.json();
    },
});

export const validateVIN = mutation({
    args: { vin: v.string() },
    handler: async (ctx, args) => {
        // VIN validation algorithm from https://en.wikipedia.org/wiki/Vehicle_identification_number#Validity_of_VINs
        const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
        if (!vinRegex.test(args.vin)) {
            return false;
        }

        const checksum = args.vin.charAt(8);
        const computedChecksum = args.vin
            .split('')
            .slice(0, 7)
            .map((char, index) => {
                const weight = (index % 2 === 0) ? 1 : 3;
                return char.charCodeAt(0) - 64 * weight;
            })
            .reduce((acc, cur) => acc + cur, 0)
            .toString(36);

        return checksum === computedChecksum;
    },
});
