import { User } from '../models';
import asyncHandler from 'express-async-handler';

/**
 * @description Get User address
 * @api /api/users/address
 * @access Private
 * @type GET
 */

const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res
    .status(200)
    .json({ success: true, shippingAddress: user.shippingAddress });
});

const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (
    req.body.address &&
    req.body.city &&
    req.body.state &&
    req.body.postalCode &&
    req.body.country
  ) {
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
    res
      .status(200)
      .json({ success: true, shippingAddress: user.shippingAddress });
  } else {
    res.status(400).json({ success: false, message: 'Check all fields' });
  }
});

const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    address,
    city,
    state,
    country,
    postalCode,
    default: makeDefault,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (makeDefault) {
    user.shippingAddress.forEach((elem) => (elem.default = false));
  }

  user.shippingAddress.forEach((item) => {
    if (item._id.toString() === id.toString()) {
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
    user.shippingAddress[0].default = true;
  }

  await user.save();

  res
    .status(200)
    .json({ success: true, shippingAddress: user.shippingAddress });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { id } = req.params;

  let addresses = user.shippingAddress.filter((elem) => {
    return elem._id.toString() !== id.toString();
  });

  user.shippingAddress = addresses;

  if (user.shippingAddress && user.shippingAddress.length > 0) {
    let result = user.shippingAddress.filter((elem) => elem.default === false);

    if (result && result.length === user.shippingAddress.length) {
      user.shippingAddress[0].default = true;
    }
  }

  await user.save();
  res
    .status(200)
    .json({ success: true, shippingAddress: user.shippingAddress });
});

export { getAddresses, addAddress, updateAddress, deleteAddress };
