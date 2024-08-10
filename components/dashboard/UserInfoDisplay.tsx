// components/dashboard/UserInfoDisplay.tsx
import { UserInfo } from '@/types/auth';

interface UserInfoDisplayProps {
  userData: UserInfo;
}

export default function UserInfoDisplay({ userData }: Readonly <UserInfoDisplayProps>) {
  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Your Information</h2>
          <p>Full Name: {userData.fullName}</p>
          <p>Email: {userData.email}</p>
          <p>Organization: {userData.organizationName}</p>
          <p>Home Address: {userData.homeAddress}</p>
          <p>Role: {userData.role}</p>
    </div>
  );
}

