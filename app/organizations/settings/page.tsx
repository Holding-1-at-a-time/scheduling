// app/organizations/settings/page.tsx
import { OrganizationProfile } from "@clerk/nextjs";
import RoleBasedAuth from "@/components/RoleBasedAuth";

export default function OrganizationSettingsPage() {
    return (
        <RoleBasedAuth allowedRoles={["org:admin", "org:manager_organization"]}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Organization Settings</h1>
                <OrganizationProfile />
            </div>
        </RoleBasedAuth>
    );
}