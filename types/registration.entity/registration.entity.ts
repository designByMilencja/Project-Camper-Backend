export interface RegistrationEntity {
    id?:string;
    name: string;
    email: string;
    login: string;
    password: string;
    emailVerified?: boolean;
    verificationKey?: string | null;
}
