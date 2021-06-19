import { User } from '../models';
import asyncHandler from 'express-async-handler';
import { randomBytes } from 'crypto';
import sendMail from '../functions/email-sender';
import { DOMAIN, JWT_COOKIE_EXPIRE, NODE_ENV } from '../constants';

/**
 * @description To create a new user account
 * @api /users/api/register
 * @access Public
 * @type POST
 */

const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body, 'req.body');
  let { email, password, name, country } = req.body;

  // Check if the user exists with that email
  console.log(email, 'entry');

  let user = await User.findOne({ email });

  if (user) {
    return res.status(200).json({
      success: false,
      message:
        'Email is already registered. Did you forget the password. Try resetting it.',
    });
  }

  user = new User({
    email,
    password,
    name,
    country,
    verificationCode: randomBytes(20).toString('hex'),
  });

  await user.save();

  let html = `
        <div>
            <h1>Hello, ${user.name}</h1>
            <p>Please click the following link to verify your account</p>
            <a href="${DOMAIN}verify/${user.verificationCode}">Verify Now</a>
        </div>
    `;

  await sendMail(
    user.email,
    'Verify Account',
    'Please verify Your Account.',
    html
  );

  return res.status(201).json({
    success: true,
    message:
      'Hurray! your account is created please verify your email address.',
  });
});

/**
 * @description To verify a new user account
 * @api /users/verify-now/:verificationCode
 * @access Public <Only Via Email>
 * @type GET
 */

const verifyUser = asyncHandler(async (req, res) => {
  let { verificationCode } = req.params;
  let user = await User.findOne({ verificationCode });

  if (!user) {
    return res.status(401).json({
      message: 'Unauthorized access. Invalid verification code',
      success: false,
    });
  }

  user.verified = true;
  user.verificationCode = undefined;
  await user.save();

  // return res.sendFile(
  //   join(__dirname, '../templates/verification-success.html')
  // );
  return res.status(200).json({
    success: true,
    message: 'Hurray! your account is successfully verified.',
  });
});

/**
 * @description To aiuthenticate an user and get auth token
 * @api /users/api/authenticate
 * @access PUBLIC
 * @type POST
 */

const authenticateUser = asyncHandler(async (req, res) => {
  let { email, password, role } = req.body;
  console.log(email, password, role, 'email, password, role ');

  let user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  if (user.role !== role) {
    return res.status(200).json({
      success: false,
      message: 'Incorrect Details.',
    });
  }

  if (!(await user.comparePassword(password))) {
    return res.status(200).json({
      success: false,
      message: 'Incorrect password.',
    });
  }

  let token = await user.generateJWT();

  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (NODE_ENV === 'production') {
    options.secure = true;
  }

  return res
    .status(200)
    .cookie('token', `Bearer ${token}`, options)
    .json({
      success: true,
      user: user.getUserInfo(),
      token: `Bearer ${token}`,
      message: 'Hurray! You are now logged in.',
    });
});

/**
 * @description To get the authenticated user's profile
 * @api /users/api/authenticate
 * @access Private
 * @type GET
 */

const authenticate = asyncHandler(async (req, res) => {
  return res.status(200).json({
    user: req.user,
    success: true,
  });
});

/**
 * @description To initiate the password reset process
 * @api /users/api/reset-password
 * @access Public
 * @type POST
 */

const resetPassword = asyncHandler(async (req, res) => {
  console.log(req.body, 'req.body resetPassword');

  let { email } = req.body;

  let user = await User.findOne({ email });

  console.log(user, 'user');

  if (!user) {
    return res.status(200).json({
      success: false,
      message: 'User with the email is not found.',
    });
  }
  let resetPassword = user.generatePasswordReset();

  console.log(resetPassword, 'resetPassword');

  let result = await user.save();


  // Sent the password reset Link in the email.
  let html = `
        <div>
            <h1>Hello, ${user.name}</h1>
            <p>Please click the following link to reset your password.</p>
            <p>If this password reset request is not created by your then you can inore this email.</p>
            <a href="${DOMAIN}?resetToken=${user.resetPasswordToken}">Reset Now</a>
        </div>`;

  await sendMail(
    user.email,
    'Reset Password',
    'Please reset your password.',
    html
  );

  console.log(`${DOMAIN}resetPasswordNow/${user.resetPasswordToken}`,'mail sent');

  return res.status(200).json({
    success: true,
    message: 'Password reset link is sent your email.',
  });
});

// /**
//  * @description To resnder reset password page
//  * @api /users/reset-password/:resetPasswordToken
//  * @access Restricted via email
//  * @type GET
//  */

// const resetPasswordToken = asyncHandler(async (req, res) => {
//   let { resetPasswordToken } = req.params;

//   let user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpiresIn: { $gt: Date.now() },
//   });

//   if (!user) {
//     return res.status(401).json({
//       success: false,
//       message: 'Password reset token is invalid or has expired.',
//     });
//   }
//   return res.sendFile(join(__dirname, '../templates/password-reset.html'));
//   // } catch (err) {
//   //   return res.sendFile(join(__dirname, '../templates/errors.html'));
//   // }
// });

/**
 * @description To reset the password
 * @api /users/api/reset-password-now
 * @access Restricted via email
 * @type POST
 */

const resetPasswordNow = asyncHandler(async (req, res) => {
  console.log(req.body,'req.body');
  

  let { resetPasswordToken, password } = req.body;
  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiresIn: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Password reset token is invalid or has expired.',
    });
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresIn = undefined;
  await user.save();
  // Send notification email about the password reset successfull process
  let html = `
        <div>
            <h1>Hello, ${user.name}</h1>
            <p>Your password is resetted successfully.</p>
            <p>If this rest is not done by you then you can contact our team.</p>
        </div>
      `;
  await sendMail(
    user.email,
    'Reset Password Successful',
    'Your password is changed.',
    html
  );
  return res.status(200).json({
    success: true,
    message:
      'Your password reset request is complete and your password is reset successfully. Login into your account with your new password.',
  });
});

export {
  registerUser,
  verifyUser,
  authenticateUser,
  authenticate,
  resetPassword,
  // resetPasswordToken,
  resetPasswordNow,
};
