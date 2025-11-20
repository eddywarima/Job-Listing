import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/handleResponse.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    // Validation
    if (!name || !email || !password) {
      return errorResponse(res, 400, 'Please provide all required fields');
    }

    if (password.length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, 'Please provide a valid email address');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return errorResponse(res, 400, 'User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'job_seeker',
      companyName: role === 'employer' ? companyName : undefined,
    });

    if (user) {
      successResponse(res, 201, {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        token: generateToken(user._id),
      }, 'User registered successfully');
    } else {
      errorResponse(res, 400, 'Invalid user data');
    }
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return errorResponse(res, 400, messages);
    }
    errorResponse(res, 500, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      successResponse(res, 200, {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        token: generateToken(user._id),
      }, 'Login successful');
    } else {
      errorResponse(res, 401, 'Invalid email or password');
    }
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    successResponse(res, 200, user, 'User retrieved successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};


