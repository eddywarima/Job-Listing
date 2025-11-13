import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/handleResponse.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    successResponse(res, 200, user, 'Profile retrieved successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, companyName, phone, bio, location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        companyName,
        phone,
        bio,
        location,
      },
      { new: true, runValidators: true }
    ).select('-password');

    successResponse(res, 200, user, 'Profile updated successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    successResponse(res, 200, users, 'Users retrieved successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};


