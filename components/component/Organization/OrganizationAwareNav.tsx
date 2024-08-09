// components/OrganizationAwareNav.tsx
import { UserButton, OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import RoleBasedAuth from "./RoleBasedAuth";

export default function OrganizationAwareNav() {
    const { organization } = useOrganization();

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                            Logo
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/dashboard" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                                Dashboard
                            </Link>
                            <RoleBasedAuth allowedRoles={["org:admin", "org:manager_organization"]}>
                                <Link href="/organizations/manage" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                                    Manage Organization
                                </Link>
                            </RoleBasedAuth>
                            <RoleBasedAuth allowedRoles={["org:admin", "org:manager_organization", "org:member"]}>
                                <Link href="/clients" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                                    Clients
                                </Link>
                            </RoleBasedAuth>
                            <RoleBasedAuth allowedRoles={["org:admin", "org:manager_organization", "org:member"]}>
                                <Link href="/services" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                                    Services
                                </Link>
                            </RoleBasedAuth>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {organization && <OrganizationSwitcher />}
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </div>
        </nav>
    );
}