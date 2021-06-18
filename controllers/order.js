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
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res
      .status(400)
      .json({ message: 'No order items', success: false, data: [] });
  } else {
    console.log('0');
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    console.log('1');
    let cart = await Cart.findOneAndDelete({
      user: req.user._id,
    });
    console.log('2');

    console.log(cart, 'cart is deleted');

    res.status(201).json({ success: true, data: createdOrder });
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

    const updatedOrder = await order.save();

    res.status(200).json({ success: true, data: updatedOrder });
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

    const updatedOrder = await order.save();

    res.status(200).json({ success: true, data: updatedOrder });
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

export {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
