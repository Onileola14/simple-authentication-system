import { TokenUserPayload } from "../../shared/types";

declare global {
  namespace Express {
    interface Request {
      user?: TokenUserPayload;
    }
  }
}

export {};