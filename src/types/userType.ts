export interface UserState {
    name: string | null;
    role: string | null;
}

export interface UserToken {
    sub: string;
    role: string;
    iat: number;
    exp: number;
}
