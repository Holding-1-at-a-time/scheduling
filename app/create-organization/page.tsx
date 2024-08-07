import { OrganizationProfile } from '@clerk/nextjs';


/**
 * The CreateOrganizationPage component is a page that allows users to create
 * an organization profile. It uses the OrganizationProfile component from the
 * Clerk Next.js SDK to render the organization profile form.
 *
 * @return {JSX.Element} The CreateOrganizationPage component.
 */

export default function CreateOrganizationPage() {
    // Render the Create Organization page with a container, a heading, and the
    // OrganizationProfile component.
    return (
        <div className="container mx-auto p-4">
            {/* Heading */}
            <h1 className="text-2xl font-bold mb-4">Create Your Organization</h1>
            
            {/* Render the OrganizationProfile component */}
            <OrganizationProfile />
        </div>
    );
}
