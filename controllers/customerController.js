const Customer = require("../models/customer");
const Mission = require('../models/mission');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  res.render('customer_form', { title: "Create customer" });
});

// handle customer create form on POST
exports.customer_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.')
    .isAlphanumeric()
    .withMessage('Name has non-alphanumeric characters.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const customer = new Customer({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render('customer_form', {
        title: "Create customer",
        customer: customer,
        errors: errors.array()
      });
      return;
    }
    else {
      await customer.save();
      res.redirect(customer.url);
    }
  })
];

// display customer update form on GET 
exports.customer_update_get = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id).exec();

  if (customer == null) {
    let err = new Error('Customer not found');
    err.status = 404;
    next(err);
  }

  res.render('customer_form', {
    title: 'Update customer',
    customer: customer
  });
});

// handler customer update form on POST
exports.customer_update_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.')
    .isAlphanumeric()
    .withMessage('Name has non-alphanumeric characters.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const customer = new Customer({
      name: req.body.name,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      res.render('customer_form', {
        title: "Create customer",
        customer: customer,
        errors: errors.array()
      });
      return;
    }
    else {
      const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, customer);
      res.redirect(updatedCustomer.url);
    }
  })
];

// display customer delete form on GET
exports.customer_delete_get = asyncHandler(async (req, res, next) => {
  const [customer, customerMissions] = await Promise.all([
    Customer.findById(req.params.id).exec(),
    Mission.find({ customer: req.params.id }).exec()
  ]);

  if (customer === null) {
    let err = new Error('Customer not found');
    err.status = 404;
    next(err);
  }

  res.render('customer_delete', {
    title: 'Delete customer',
    customer: customer,
    mission_list: customerMissions
  });
});

// handle customer delete form on POST
exports.customer_delete_post = asyncHandler(async (req, res, next) => {
  const [customer, customerMissions] = await Promise.all([
    Customer.findById(req.params.id).exec(),
    Mission.find({ customer: req.params.id }).exec()
  ]);

  if (customer === null) {
    let err = new Error('Customer not found');
    err.status = 404;
    next(err);
  }

  if (customerMissions.length > 0) {
    res.render('customer_delete', {
      title: 'Delete customer',
      customer: customer,
      mission_list: customerMissions
    });
    return;
  }

  await Customer.findByIdAndDelete(req.params.id);
  res.redirect('/schedule/customers');
});
