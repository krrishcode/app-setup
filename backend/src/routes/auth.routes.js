const router = require('express').Router();
const { validationResult } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
} = require('../middleware/validate.middleware');

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

// Public routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.put('/change-password', authenticate, changePasswordValidation, validate, authController.changePassword);

module.exports = router;
