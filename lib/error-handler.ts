export class AppError extends Error {
    statusCode: number;

    field?:
        | "email"
        | "password"
        | "currentPassword"
        | "newPassword"
        | "general";

    constructor(
        message: string,
        statusCode = 500,
        field?:
            | "email"
            | "password"
            | "currentPassword"
            | "newPassword"
            | "general"
    ) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;
        this.field = field;
    }
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    return "Something went wrong. Please try again.";
}