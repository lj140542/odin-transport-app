const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Customer = require("../models/customer");
const Driver = require("../models/driver");
const Mission = require("../models/mission");
const Vehicle = require("../models/vehicle");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numCustomer,
    numDriver,
    numMission,
    numVehicle
  ] = await Promise.all([
    Customer.countDocuments().exec(),
    Driver.countDocuments().exec(),
    Mission.countDocuments().exec(),
    Vehicle.countDocuments().exec()
  ]);

  res.render('index', {
    title: "Schedule Homepage",
    customer_count: numCustomer,
    driver_count: numDriver,
    mission_count: numMission,
    vehicle_count: numVehicle
  });
});

// displays all missions
exports.mission_list = asyncHandler(async (req, res, next) => {
  const missions = await Mission.find().sort({ start_date: 1, end_date: 1 }).populate('customer').populate('driver').populate('vehicle').exec();
  res.render('mission_list', {
    title: 'List of missions',
    mission_list: missions
  });
});

// display detail page for a specific mission
exports.mission_detail = asyncHandler(async (req, res, next) => {
  const mission = await Mission.findById(req.params.id).populate('customer').populate('driver').populate('vehicle').exec();

  if (mission === null) {
    let err = new Error('Mission not found');
    err.status = 404;
    return next(err);
  }

  res.render('mission_detail', {
    title: mission.id,
    mission: mission
  });
});

// display mission create form on GET
exports.mission_create_get = asyncHandler(async (req, res, next) => {
  const [customers, drivers, vehicles] = await Promise.all([
    Customer.find().sort({ name: 1 }).exec(),
    Driver.find().sort({ family_name: 1, first_name: 1 }).exec(),
    Vehicle.find().sort({ registration_number: 1 }).exec(),
  ]);

  res.render('mission_form', {
    title: 'Create mission',
    customers: customers,
    drivers: drivers,
    vehicles: vehicles
  });
});

// handle mission create form on POST
exports.mission_create_post = [
  body('start_date', 'Invalid start date')
    .isISO8601()
    .toDate(),
  body('end_date', 'Invalid end date')
    .isISO8601()
    .toDate()
    .custom((end_date, { req }) => {
      if (end_date < req.body.start_date) {
        throw new Error('Start date must be before end date');
      }
      return true;
    }),
  body('customer', 'Customer must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const mission = new Mission({
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      customer: req.body.customer,
      driver: req.body.driver,
      vehicle: req.body.vehicle
    });

    if (!errors.isEmpty()) {
      const [customers, drivers, vehicles] = await Promise.all([
        Customer.find().sort({ name: 1 }).exec(),
        Driver.find().sort({ family_name: 1, first_name: 1 }).exec(),
        Vehicle.find().sort({ registration_number: 1 }).exec(),
      ]);

      res.render('mission_form', {
        title: 'Create mission',
        mission: mission,
        customers: customers,
        drivers: drivers,
        vehicles: vehicles,
        errors: errors.array()
      });
      return;
    }
    else {
      await mission.save();
      res.redirect(mission.url);
    }
  })
];

// display mission update form on GET 
exports.mission_update_get = asyncHandler(async (req, res, next) => {
  const [mission, customers, drivers, vehicles] = await Promise.all([
    Mission.findById(req.params.id).exec(),
    Customer.find().sort({ name: 1 }).exec(),
    Driver.find().sort({ family_name: 1, first_name: 1 }).exec(),
    Vehicle.find().sort({ registration_number: 1 }).exec(),
  ]);

  res.render('mission_form', {
    title: 'Create mission',
    mission: mission,
    customers: customers,
    drivers: drivers,
    vehicles: vehicles
  });
});

// handler mission update form on POST
exports.mission_update_post = [
  body('start_date', 'Invalid start date')
    .isISO8601()
    .toDate(),
  body('end_date', 'Invalid end date')
    .isISO8601()
    .toDate()
    .custom((end_date, { req }) => {
      if (end_date < req.body.start_date) {
        throw new Error('Start date must be before end date');
      }
      return true;
    }),
  body('customer', 'Customer must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const mission = new Mission({
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      customer: req.body.customer,
      driver: req.body.driver,
      vehicle: req.body.vehicle,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      const [customers, drivers, vehicles] = await Promise.all([
        Customer.find().sort({ name: 1 }).exec(),
        Driver.find().sort({ family_name: 1, first_name: 1 }).exec(),
        Vehicle.find().sort({ registration_number: 1 }).exec(),
      ]);

      res.render('mission_form', {
        title: 'Create mission',
        mission: mission,
        customers: customers,
        drivers: drivers,
        vehicles: vehicles,
        errors: errors.array()
      });
      return;
    }
    else {
      const updatedMission = await Mission.findByIdAndUpdate(req.params.id, mission);
      res.redirect(updatedMission.url);
    }
  })
];

// display mission delete form on GET
exports.mission_delete_get = asyncHandler(async (req, res, next) => {
  const mission = await Mission.findById(req.params.id).populate('customer').exec();

  if (mission == null) {
    let err = new Error('Mission not found');
    err.status = 404;
    return next(err);
  }

  res.render('mission_delete', {
    title: 'Delete mission',
    mission: mission
  });
});

// handle mission delete form on POST
exports.mission_delete_post = asyncHandler(async (req, res, next) => {
  const mission = await Mission.findById(req.params.id).populate('customer').exec();

  if (mission == null) {
    let err = new Error('Mission not found');
    err.status = 404;
    return next(err);
  }

  await Mission.findByIdAndDelete(req.params.id);
  res.redirect('/schedule/missions');
});
