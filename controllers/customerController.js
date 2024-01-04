const Customer = require("../models/customer");
const Mission = require('../models/mission');
const asyncHandler = require("express-async-handler");

// displays all customers
exports.customer_list = asyncHandler(async (req, res, next) => {
  const customers = await Customer.find().exec();

  res.render('customer_list', {
    title: 'Customer List',
    customer_list: customers
  });
});

// display detail page for a specific customer
exports.customer_detail = asyncHandler(async (req, res, next) => {
  const [
    customer,
    customerMissions
  ] = await Promise.all([
    Customer.findById(req.params.id).exec(),
    Mission.find({ customer: req.params.id }).populate('driver').populate('vehicle').exec()
  ]);

  if (customer === null) {
    let err = new Error('Customer not found');
    err.status = 404;
    next(err);
  }

  res.render('customer_detail', {
    title: customer.name,
    customer: customer,
    mission_list: customerMissions
  });
});

// display customer create form on GET
exports.customer_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Customer create GET");
});

// handle customer create form on POST
exports.customer_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Customer create POST");
});

// display customer update form on GET 
exports.customer_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Customer update GET");
});

// handler customer update form on POST
exports.customer_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Customer update POST");
});

// display customer delete form on GET
exports.customer_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Customer delete GET");
});

// handle customer delete form on POST
exports.customer_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Customer delete POST");
});
