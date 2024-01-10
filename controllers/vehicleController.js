const Vehicle = require("../models/vehicle");
const Mission = require("../models/mission");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const vehicle_types = Vehicle.schema.path('vehicle_type').enumValues;

// displays all vehicles
exports.vehicle_list = asyncHandler(async (req, res, next) => {
  const vehicles = await Vehicle.find().sort({ vehicle_type: 1 }).exec();

  res.render('vehicle_list', {
    title: 'List of vehicles',
    types: vehicle_types,
    vehicle_list: vehicles
  });
});

// display detail page for a specific vehicle
exports.vehicle_detail = asyncHandler(async (req, res, next) => {
  const [vehicle, missions] = await Promise.all([
    Vehicle.findById(req.params.id).exec(),
    Mission.find({ 'vehicle': req.params.id }).exec()
  ]);

  if (vehicle === null) {
    let err = new Error('Vehicle not found');
    err.status = 404;
    next(err);
  }

  res.render('vehicle_detail', {
    title: vehicle.registration_number,
    vehicle: vehicle,
    missions_assigned: missions
  });
});

// display vehicle create form on GET
exports.vehicle_create_get = asyncHandler(async (req, res, next) => {
  res.render('vehicle_form', { title: "Create vehicle", vehicle_types: vehicle_types });
});

// handle vehicle create form on POST
exports.vehicle_create_post = [
  body('registration_number')
    .trim()
    .isLength({ min: 1, max: 10 })
    .escape()
    .withMessage('Registration number must be between 1 and 10 characters.')
    .isAlphanumeric()
    .withMessage('Registration number has non-alphanumeric characters.'),
  body('vehicle_type', 'Vehicle type must be selected.')
    .isIn(vehicle_types),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const vehicle = new Vehicle({
      registration_number: req.body.registration_number,
      vehicle_type: req.body.vehicle_type
    });

    if (!errors.isEmpty()) {
      res.render('vehicle_form', {
        title: 'Create vehicle',
        vehicle_types: vehicle_types,
        vehicle: vehicle,
        errors: errors.array()
      });
      return;
    }
    else {
      await vehicle.save();
      res.redirect(vehicle.url);
    }
  })
];

// display vehicle update form on GET 
exports.vehicle_update_get = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).exec();

  if (vehicle === null) {
    let err = new Error('Vehicle not found');
    err.status = 404;
    next(err);
  }

  res.render('vehicle_form', {
    title: "Update vehicle",
    vehicle_types: vehicle_types,
    vehicle: vehicle
  });
});

// handler vehicle update form on POST
exports.vehicle_update_post = [
  body('registration_number')
    .trim()
    .isLength({ min: 1, max: 10 })
    .escape()
    .withMessage('Registration number must be between 1 and 10 characters.')
    .isAlphanumeric()
    .withMessage('Registration number has non-alphanumeric characters.'),
  body('vehicle_type', 'Vehicle type must be selected.')
    .isIn(vehicle_types),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const vehicle = new Vehicle({
      registration_number: req.body.registration_number,
      vehicle_type: req.body.vehicle_type,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      res.render('vehicle_form', {
        title: 'Create vehicle',
        vehicle_types: vehicle_types,
        vehicle: vehicle,
        errors: errors.array()
      });
      return;
    }
    else {
      const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, vehicle);
      res.redirect(updatedVehicle.url);
    }
  })
];

// display vehicle delete form on GET
exports.vehicle_delete_get = asyncHandler(async (req, res, next) => {
  const [vehicle, vehicleMissions] = await Promise.all([
    Vehicle.findById(req.params.id).exec(),
    Mission.find({ vehicle: req.params.id }).exec()
  ]);

  if (vehicle === null) {
    let err = new Error('Vehicle not found');
    err.status = 404;
    next(err);
  }

  res.render('vehicle_delete', {
    title: 'Delete vehicle',
    vehicle: vehicle,
    mission_list: vehicleMissions
  });
});

// handle vehicle delete form on POST
exports.vehicle_delete_post = asyncHandler(async (req, res, next) => {
  const [vehicle, vehicleMissions] = await Promise.all([
    Vehicle.findById(req.params.id).exec(),
    Mission.find({ vehicle: req.params.id }).exec()
  ]);

  if (vehicle === null) {
    let err = new Error('Vehicle not found');
    err.status = 404;
    next(err);
  }

  if (vehicleMissions.length > 0) {
    res.render('vehicle_delete', {
      title: 'Delete vehicle',
      vehicle: vehicle,
      mission_list: vehicleMissions
    });
    return;
  }

  await Vehicle.findByIdAndDelete(req.params.id);
  res.redirect('/schedule/vehicles');
});
