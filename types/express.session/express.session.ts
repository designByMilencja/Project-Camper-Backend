import {Session} from "express-session";
export interface CustomSession extends Session {
    token?: string;
    userId?: string;
}
