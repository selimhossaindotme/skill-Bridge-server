
import type { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../../lib/auth";


export enum UserRole {
   STUDENT = "student",
   TUTOR = "tutor",
    ADMIN = "admin"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: UserRole;
                name: string;
                verified: boolean;
            }
        }
    }
}

export const auth = (...role: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
           // get user session
           const session = await betterAuth.api.getSession({
                headers: req.headers as any
           })  


           // check if user not authenticated
           if(!session){
            return res.status(401)
            .json({
                success: false,
                message: "Unauthorized: No valid session found."
            })
           }

           if( !session.user.emailVerified){
            return res.status(403)
            .json({
                success: false,
                message: "Forbidden: Email not verified."
            })
           }

           req.user = {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role as UserRole,
            name: session.user.name,
            verified: session.user.emailVerified,
           }

           if(role.length && !role.includes(req.user.role)){
            return res.status(403)
            .json({
                success: false,
                message: "Forbidden: You do not have the required permissions to access this resource."
            })
           }

           next();

        } catch (error) {
          next(error);
        }
    }
}