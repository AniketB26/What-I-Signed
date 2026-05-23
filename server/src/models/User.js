import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    docCount: {
      type: Number,
      default: 0,
    },
    preferences: {
      alertEmail: {
        type: Boolean,
        default: true,
      },
      alertDaysBefore: {
        type: Number,
        default: 14,
      },
    },
  },
  { timestamps: true }
);

/**
 * Compare a candidate password against the stored hash.
 * @param {string} candidatePassword - The plaintext password to verify
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// googleId sparse index is created via sparse:true in schema definition

const User = mongoose.model('User', userSchema);

export default User;
