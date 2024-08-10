import React, { useState } from "react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { OrganizationMembershipResource } from "@clerk/types";

interface InviteFormData {
  email: string;
  role: string;
}

export const OrganizationMembers: React.FC = () => {
  const { organization, membership, membershipList, invitations, isLoaded } =
    useOrganization({ membershipList: {} });
  const { setActive } = useOrganizationList();
  const [inviteData, setInviteData] = useState<InviteFormData>({
    email: "",
    role: "org:member",
  });

  if (!isLoaded || !organization) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInviteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await organization.inviteMember({
        emailAddress: inviteData.email,
        role: inviteData.role,
      });
      setInviteData({ email: "", role: "org:member" });
      // Handle successful invite (e.g., show success message)
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Failed to invite member:", error);
    }
  };

  const handleRemoveMember = async (
    membership: OrganizationMembershipResource
  ) => {
    try {
      await membership.destroy();
      // Handle successful removal (e.g., show success message)
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Failed to remove member:", error);
    }
  };

  const canManageMembers = membership?.role === "org:admin";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Team Members</h2>

      {canManageMembers && (
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Invite New Member
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={inviteData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={inviteData.role}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="org:member">Member</option>
              <option value="org:admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send Invitation
          </button>
        </form>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-2">Current Members</h3>
        <ul className="space-y-2">
          {membershipList?.map((member) => (
            <li
              key={member.id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>
                {member.publicUserData?.identifier} - {member.role}
              </span>
              {canManageMembers && member.id !== membership?.id && (
                <button
                  onClick={() => handleRemoveMember(member)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {canManageMembers && invitations && invitations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Pending Invitations</h3>
          <ul className="space-y-2">
            {invitations.map((invitation) => (
              <li
                key={invitation.id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span>
                  {invitation.emailAddress} - {invitation.role}
                </span>
                <button
                  onClick={() => invitation.revoke()}
                  className="text-red-600 hover:text-red-800"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
