export interface AuthType {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin";
}