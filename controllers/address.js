import { User } from '../models';
import asyncHandler from 'express-async-handler';

/**
 * @description Update user profile
 * @api /api/users/profile
 * @access Private
 * @type PUT
 */

const getAddresses = asyncHandler(async (req, res) => {
  console.log(req.user, 'enter in address');
  const user = await User.findById(req.user._id);
  res.status(200).json({ shippingAddress: user.shippingAddress });
});

const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.default) {
    user.shippingAddress.forEach((elem) => {
      elem.default = false;
    });
  }

  user.shippingAddress.push(req.body);

  let result = user.shippingAddress.filter((elem) => elem.default === false);

  if (result && result.length === user.shippingAddress.length) {
    user.shippingAddress[0].default = true;
  }

  await user.save();
  res.status(200).json({ shippingAddress: user.shippingAddress });
});

const updateAddress = asyncHandler(async (req, res) => {
  console.log(req.params, 'hello', req.user, 'req.user');

  const user = await User.findById(req.user._id);
  const { id } = req.params;
  const {
    address,
    city,
    state,
    country,
    postalCode,
    default: makeDefault,
  } = req.body;

  if (makeDefault) {
    user.shippingAddress.forEach((elem) => {
      elem.default = false;
    });
  }

  user.shippingAddress.forEach((item) => {
    if (item._id.toString() === id) {
      (item.address = address),
        (item.city = city),
        (item.state = state),
        (item.country = country),
        (item.postalCode = postalCode),
        (item.default = makeDefault);
    }
  });

  let result = user.shippingAddress.filter((elem) => elem.default === false);

  if (result && result.length === user.shippingAddress.length) {
    user.shippingAddress[0].default = true;
  }

  await user.save();
  res.status(200).json({ shippingAddress: user.shippingAddress });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { id } = req.params;

  let addresses = user.shippingAddress.filter((elem) => {
    return elem._id.toString() !== id.toString();
  });

  user.shippingAddress = addresses;

  let result = user.shippingAddress.filter((elem) => elem.default === false);

  if (result && result.length === user.shippingAddress.length) {
    user.shippingAddress[0].default = true;
  }
  await user.save();
  res.status(200).json({ shippingAddress: user.shippingAddress });
});

export { getAddresses, addAddress, updateAddress, deleteAddress };
