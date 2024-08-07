// app/organizations/manage/page.tsx
import { OrganizationList, OrganizationSwitcher } from "@clerk/nextjs";

/**
 * OrganizationManagementPage is the page where the user can manage their organizations.
 * It allows the user to switch between organizations and view their list of organizations.
 */
export default function OrganizationManagementPage() {
    // Render the OrganizationManagementPage component with a container, a heading, and two divs.
    return (
        <div className="container mx-auto p-4">
            {/* Heading */}
            <h1 className="text-2xl font-bold mb-4">Manage Organizations</h1>
            
            {/* Div for switching organizations */}
            <div className="mb-8">
                {/* Heading for switching organizations */}
                <h2 className="text-xl font-semibold mb-2">Switch Organization</h2>
                {/* Render the OrganizationSwitcher component */}
                <OrganizationSwitcher />
            </div>
            
            {/* Div for viewing organizations */}
            <div>
                {/* Heading for viewing organizations */}
                <h2 className="text-xl font-semibold mb-2">Your Organizations</h2>
                {/* Render the OrganizationList component */}
                <OrganizationList
                    /**
                     * The URL to navigate to after creating a new organization.
                     * Defaults to "/dashboard".
                     */
                    afterCreateOrganizationUrl="/dashboard"
                    /**
                     * The URL to navigate to after selecting an organization.
                     * Defaults to "/dashboard".
                     */
                    afterSelectOrganizationUrl="/dashboard"
                />
            </div>
        </div>
    );
}
