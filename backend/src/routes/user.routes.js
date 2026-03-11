const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { updateProfileValidation } = require('../middleware/validate.middleware');
const { validationResult } = require('express-validator');

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// All routes below require authentication
router.use(authenticate);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, validate, userController.updateProfile);
router.delete('/profile', userController.deleteAccount);

// Admin-only routes
router.get('/', authorize('admin'), userController.getAllUsers);

module.exports = router;
