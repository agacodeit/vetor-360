export enum UserProfile {
    GESTOR_ACESSEBANK = 'GESTOR_ACESSEBANK',
    PARCEIRO_ACESSEBANK = 'PARCEIRO_ACESSEBANK'
}

export interface ProfilePermission {
    component: string;
    route?: string;
    action?: string;
    condition?: (user: any) => boolean;
}

export interface ProfileConfig {
    profile: UserProfile;
    permissions: ProfilePermission[];
    description: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    userTypeEnum: UserProfile;
    cpfCnpj: string;
    cellphone: string;
    comercialPhone: string;
    userStatusEnum: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
    dateHourIncluded: string;
    documents: Document[];
    temporaryPass: boolean;
    masterAccessGrantedEnum: 'APPROVED' | 'PENDING' | 'REJECTED';
    notifyClientsByEmail: boolean;
    authorized: boolean;
    permissions?: string[];
}

export interface Document {
    id: string;
    description: string;
    initialDocument: boolean;
    files: DocumentFile[];
    dateHourIncluded: string;
    userIncludedId: string;
    documentStatusEnum: 'COMPLETED' | 'PENDING' | 'REJECTED';
    comments: any[];
}

export interface DocumentFile {
    id: string;
    fileName: string;
    code: string;
    opportunityId: string;
    documentId: string;
    dateHourIncluded: string;
    userIncludedId: string;
    urlDownload: string;
    active: boolean;
}
