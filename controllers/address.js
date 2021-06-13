import { User } from '../models';
import asyncHandler from 'express-async-handler';

/**
 * @description Update user profile
 * @api /api/users/profile
 * @access Private
 * @type PUT
 */

const getAddresses = asyncHandler(async (req, res) => {
  let id;
  if (req.user) {
    id = req.user._id;
  } else {
    id = '60b91c696807c4197c691214';
  }
  const user = await User.findById(id);
  res.status(200).json({ shippingAddress: user.shippingAddress });
});

const addAddress = asyncHandler(async (req, res) => {
  console.log('enter in address');

  let id;
  if (req.user) {
    id = req.user._id;
  } else {
    id = '60b91c696807c4197c691214';
  }

  console.log(id, 'id');

  // mongoose.Types.ObjectId()
  const user = await User.findById(id);

  console.log(user, 'user');

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
  console.log(req.params, 'hello', req.body, 'req.user');

  let userId;
  if (req.user) {
    userId = req.user._id;
  } else {
    userId = '60b91c696807c4197c691214';
  }

  const { id } = req.params;

  const {
    address,
    city,
    state,
    country,
    postalCode,
    default: makeDefault,
  } = req.body;

  console.log(id, 'id');

  const user = await User.findById(userId);

  if (makeDefault) {
    user.shippingAddress.forEach((elem) => (elem.default = false));
  }

  user.shippingAddress.forEach((item) => {
    console.log(item._id, 'item', id, 'id');
    if (item._id.toString() === id.toString()) {
      console.log(id, 'object');
      (item.address = address),
        (item.city = city),
        (item.state = state),
        (item.country = country),
        (item.postalCode = postalCode),
        (item.default = makeDefault);
    }
    return item;
  });

  let result = user.shippingAddress.filter((elem) => elem.default === false);

  if (result && result.length === user.shippingAddress.length) {
    console.log('asdfghj');
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
