const Roles = [
    "user",
    "moderator",
    "admin",
    "superadmin",
] as const 

export type Roles = typeof Roles[number]