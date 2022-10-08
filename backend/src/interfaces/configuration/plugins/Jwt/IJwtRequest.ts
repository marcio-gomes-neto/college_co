import { Request } from "hapi";

export interface IJwtRequest extends Request {
    authId: {
        adminId: string;
    }
}