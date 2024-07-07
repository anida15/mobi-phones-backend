import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, TokenExpiredError, Secret } from 'jsonwebtoken';
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET as string;  

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, jwtSecret as Secret, (err: VerifyErrors | TokenExpiredError | null, user: any) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).json({ message: 'Unauthorized: Token expired' });
      }
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    next(); // Pass the execution to the next middleware or route handler

  });
};
