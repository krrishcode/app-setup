const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'first_name',
      validate: {
        notEmpty: { msg: 'First name is required' },
        len: { args: [2, 50], msg: 'First name must be between 2 and 50 characters' },
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'last_name',
      validate: {
        notEmpty: { msg: 'Last name is required' },
        len: { args: [2, 50], msg: 'Last name must be between 2 and 50 characters' },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { msg: 'Email address already in use' },
      field: 'email',
      validate: {
        isEmail: { msg: 'Please provide a valid email address' },
        notEmpty: { msg: 'Email is required' },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
        len: { args: [6, 255], msg: 'Password must be at least 6 characters' },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'phone',
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'avatar',
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      field: 'role',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at',
    },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  // Instance method to compare passwords
  User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  // Instance method to return user without sensitive data
  User.prototype.toSafeObject = function () {
    const { password, ...userObject } = this.toJSON();
    return userObject;
  };

  // Associations
  User.associate = (models) => {
    // Add associations here as you add more models
    // Example: User.hasMany(models.Post, { foreignKey: 'userId' });
  };

  return User;
};
