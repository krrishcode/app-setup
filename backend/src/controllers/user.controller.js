const { User } = require('../models');

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user: user.toSafeObject() },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    // Update allowed fields only
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully!',
      data: { user: user.toSafeObject() },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/users/profile
 * @access  Private
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    // Soft delete - deactivate account
    user.isActive = false;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Account deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          total: count,
          page,
          pages: Math.ceil(count / limit),
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
