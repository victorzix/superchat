import 'express';

declare module 'express' {
  export interface Request {
    user: {
      sub: string;
      username: string;
    };
  }
}