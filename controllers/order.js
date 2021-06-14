import asyncHandler from 'express-async-handler';
import { Order } from '../models';
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
    user,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: mongoose.Types.ObjectId(user),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
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
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
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

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
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

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
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

export {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
