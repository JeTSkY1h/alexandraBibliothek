export interface User {
    username: string,
    email: string,
    password: string,
}

export interface UserWithId extends User {
    id: string,
}

export interface jwtDTO {
    access_token: string;
}