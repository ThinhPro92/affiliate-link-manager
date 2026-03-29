import { Request } from "express";
import { Server } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
      io?: Server;
    }
  }
}

export {};
