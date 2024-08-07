// types/auth.ts
export enum OrganizationRole {
    ADMIN = 'org:admin',
    MANAGER = 'org:manager_organization',
    MEMBER = 'org:member',
    CLIENT = 'org:clients',
}

export interface UserInfo {
    fullName: string;
    email: string;
    organizationName: string;
    role: OrganizationRole;
}