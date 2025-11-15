import { UserPayload } from "../types/RequestPayload";

declare global {
    namespace Express {
        interface Request {
            user: UserPayload;
        }
    }
}
