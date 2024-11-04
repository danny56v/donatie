interface CustomError extends Error {
    statusCode?: number;
}

export const errorHandler = (statusCode: number, message: string): CustomError => {
    const err: CustomError = new Error(message);
    err.statusCode = statusCode;
    return err;
}