export declare const ROLE: {
    readonly admin: "ADMIN";
    readonly student: "STUDENT";
};
export type Role = (typeof ROLE)[keyof typeof ROLE];
export declare class User {
    user_id: string;
    name: string;
    email: string;
    student_school_id: string | null;
    password: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
