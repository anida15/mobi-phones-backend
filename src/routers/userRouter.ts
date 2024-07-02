// routes/users.ts

import express from 'express';
import { body } from 'express-validator';
import { UserController } from  '../controllers/userController';

const router = express.Router();

// token refreshing
router.post('/refresh', UserController.refreshToken);


// Define routes for users
router.post('/login',
[
  body('username')
  .trim()
  .matches(/^[a-zA-Z0-9_\-]+$/).withMessage('Username must contain only letters, numbers, underscores, or hyphens'),
  body('password')
  .trim().notEmpty().withMessage('Password is required'),
  body('username').notEmpty().withMessage('Username or email is required'),

],

UserController.loginUser);

router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
      .matches(/^[a-zA-Z0-9_\-]+$/).withMessage('Username must contain only letters, numbers, underscores, or hyphens'),
    body('email')
      .isEmail().withMessage('Email is not valid')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
      .matches(/^[a-zA-Z0-9!@#$%^&*]+$/).withMessage('Password must contain only letters, numbers, or special characters like !@#$%^&*'),
  ],
  UserController.registerUser
);


router.get('/:id', UserController.getUserById);

router.put('/:id', UserController.updateUserById);

router.delete('/:id', UserController.deleteUserById);

export default router;
