import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {}

export const handleError = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res
        .status(err instanceof ValidationError ? 400 : 500)
        .json({message: err instanceof ValidationError ? err.message : 'Sorry, try again later'})
}

