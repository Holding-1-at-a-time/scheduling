// app/organizations/members/page.tsx
import { OrganizationMembershipList } from "@clerk/nextjs";
import RoleBasedAuth from "@/components/RoleBasedAuth";

export default function OrganizationMemberManagementPage() {
    return (
        <RoleBasedAuth allowedRoles={["org:admin", "org:manager_organization"]}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Manage Organization Members</h1>
                <OrganizationMembershipList />
            </div>
        </RoleBasedAuth>
    );
}