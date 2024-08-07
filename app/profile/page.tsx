// app/profile/page.tsx
import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
            <UserProfile />
        </div>
    );
}