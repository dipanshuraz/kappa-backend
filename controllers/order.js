import asyncHandler from 'express-async-handler';
import { Order, Cart } from '../models';
import mongoose from 'mongoose';

/**
 * @description Create new order
 * @api /api/orders
 * @access Private
 * @type POST
 */

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res
      .status(400)
      .json({ message: 'No order items', success: false, data: [] });
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt,
    });

    await order.save();
    let orders = await Order.find({}).populate({
      path: 'orderItems.product',
      populate: {
        path: 'category',
        model: 'Category',
      },
    });

    let cart = await Cart.findOneAndDelete({
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: orders });
  }
});

/**
 * @description Get order by ID
 * @api /api/orders/:id
 * @access Private
 * @type GET
 */

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate({
    path: 'orderItems.product',
    populate: {
      path: 'category',
      model: 'Category',
    },
  });

  if (order) {
    res.status(200).json({ success: true, data: order });
  } else {
    res
      .status(404)
      .json({ success: true, data: [], message: 'Order not found' });
  }
});

/**
 * @description Update order to paid
 * @api /api/orders/:id/pay
 * @access Private
 * @type GET
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    await order.save();
    let orders = await Order.find({}).populate({
      path: 'orderItems.product',
      populate: {
        path: 'category',
        model: 'Category',
      },
    });

    res.status(200).json({ success: true, data: orders });
  } else {
    res
      .status(404)
      .json({ success: false, data: [], message: 'Order Not Found' });
  }
});

/**
 * @description Update order to delivered
 * @api /api/orders/:id/deliver
 * @access Private/Admin
 * @type GET
 */

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    await order.save();
    let orders = await Order.find({}).populate({
      path: 'orderItems.product',
      populate: {
        path: 'category',
        model: 'Category',
      },
    });

    res.status(200).json({ success: true, data: orders });
  } else {
    res
      .status(404)
      .json({ success: false, data: [], message: 'Order Not Found' });
  }
});

/**
 * @description Get all orders
 * @api /api/orders
 * @access Private/Admin
 * @type GET
 */

const getOrders = asyncHandler(async (req, res) => {
  res.status(200).json({ data: res.advancedResults });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user._id }).populate({
    path: 'orderItems.product',
    populate: {
      path: 'category',
      model: 'Category',
    },
  });

  if (order && order.length) {
    res.status(200).json({ success: true, data: order });
  } else {
    res
      .status(200)
      .json({ success: true, data: [], message: 'Orders not found' });
  }
});

export {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getMyOrders,
};
