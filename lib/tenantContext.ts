import { createContext, useContext } from 'react';

interface TenantContextType {
    id: string;
    slug: string;
    description: string;
    logoUrl: string;
    basePrice: number;
    defaultService: string;
    name: string;
    allowedVehicleTypes: string[];
    // TODO: Add other relevant tenant information
}

export const TenantContext = createContext<TenantContextType | null>(null);

export function useTenant() {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
}