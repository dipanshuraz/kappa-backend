import { Schema, model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { SECRET } from '../constants';
import { randomBytes } from 'crypto';
import { pick } from 'lodash';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    country: { type: String, required: false, default: '' },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpiresIn: { type: Date, required: false },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    shippingAddress: [
      {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        default: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  let user = this;
  if (!user.isModified('password')) return next();
  user.password = await hash(user.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

UserSchema.methods.generateJWT = async function () {
  let payload = {
    email: this.email,
    id: this._id,
  };
  return await sign(payload, SECRET, { expiresIn: '1 day' });
};

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordExpiresIn = Date.now() + 36000000;
  this.resetPasswordToken = randomBytes(20).toString('hex');
};

UserSchema.methods.getUserInfo = function () {
  return pick(this, ['_id', 'email', 'name', 'verified', 'role', 'country']);
};

const User = model('users', UserSchema);
export default User;
