import { User } from '../models';
import asyncHandler from 'express-async-handler';

/**
 * @description Update user profile
 * @api /api/users/profile
 * @access Private
 * @type PUT
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  console.log(req.user, 'req.user._id');

  let user = await User.findById(req.user._id);

  if (user) {
    if (user.email !== req.body.email) {
      user = await User.findOne({ email: req.user.email });

      if (user) {
        res.status(404).json({
          success: false,
          message: 'User already exists with this mail',
        });
      }
    }

    console.log('0');

    user.name = req.user.name || user.name;
    user.email = req.user.email || user.email;
    user.country = req.user.country || user.country;

    console.log('1');
    if (req.user.password) {
      console.log('2');
      user.password = req.user.password;
    }
    console.log('3');

    const updatedUser = await user.save();
    let token = await user.generateJWT();
    console.log('4');

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        country: updatedUser.country,
      },
      token: `Bearer ${token}`,
      message: 'Updated successfully.',
    });
    console.log('5');
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
});

/**
 * @description Get all users
 * @api /api/users
 * @access Private/Admin
 * @type GET
 */
const getUsers = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @description Delete user
 * @api /api/users/:id
 * @access Private/Admin
 * @type DELETE
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @description Get user by ID
 * @api /api/users/:id
 * @access Private/Admin
 * @type GET
 */

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @description Update user
 * @api /api/users/:id
 * @access Private/Admin
 * @type PUT
 */

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { updateUserProfile, getUsers, deleteUser, getUserById, updateUser };
