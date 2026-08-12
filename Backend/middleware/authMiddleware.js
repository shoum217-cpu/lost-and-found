// Placeholder middleware for verifying JWT tokens
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  // To be implemented: extract token, verify, set req.user, call next()
  console.log('Protect middleware called (stub)');
  next();
};
