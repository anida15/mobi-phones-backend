import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import jwt from 'jsonwebtoken';
require('dotenv').config();
 
const jwtSecret =  process.env.JWT_SECRET as string;
const jwtExpiry = 24 * 60 * 60; // 5 minutes in seconds


export class UserController {

  // Grab username and userid from request to refresh tokens 
  static async refreshToken(req: Request, res: Response) {
    const { username, userId } = req.body;

    if (!username || !userId) {
      return res.status(400).json({ message: 'Username and user ID are required' });
    }

    // Generate new JWT
    const token = jwt.sign(
      { userId, username },
      jwtSecret,
      { expiresIn: jwtExpiry }
    );

    res.status(200).json({ message: 'Token refreshed', token });
  }


  // Login class
  static async loginUser(req: Request, res: Response) {
    const errors = validationResult(req);
     
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const [users] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [username, username]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = users[0];

      // Compare passwords
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

     
      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        jwtSecret,
        { expiresIn: jwtExpiry }
      );

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

 
  // Register class
  static async registerUser(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, privilege, password } = req.body;


    try {
      // Check if the user already exists
      const [existingUser] = await pool.execute(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [email, username]
      );

      if (Array.isArray(existingUser) && existingUser.length > 0) {
        return res.status(400).json({ message: 'User with this email or username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user object
      const user = new User(username, email, privilege, hashedPassword);

      // Store user in the database
     
      const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO users (username, email,privilege, password) VALUES (?, ?,?, ?)',
        [user.username, user.email,user.privilege, user.password]
      );




      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static getUserById(req: Request, res: Response) {
    res.send(`Fetching user with ID ${req.params.id}`);
  }

  static updateUserById(req: Request, res: Response) {
    res.send(`Updating user with ID ${req.params.id}`);
  }

  static deleteUserById(req: Request, res: Response) {
    res.send(`Deleting user with ID ${req.params.id}`);
  }
}
