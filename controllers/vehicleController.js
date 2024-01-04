const Vehicle = require("../models/vehicle");
const Mission = require("../models/mission");
const asyncHandler = require("express-async-handler");

// displays all vehicles
exports.vehicle_list = asyncHandler(async (req, res, next) => {
  const vehicles = await Vehicle.find().sort({ vehicle_type: 1 }).exec();

  res.render('vehicle_list', {
    title: 'List of vehicles',
    types: Vehicle.schema.path('vehicle_type').enumValues,
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
    type: vehicle.vehicle_type,
    missions_assigned: missions
  });
});

// display vehicle create form on GET
exports.vehicle_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Vehicle create GET");
});

// handle vehicle create form on POST
exports.vehicle_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Vehicle create POST");
});

// display vehicle update form on GET 
exports.vehicle_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Vehicle update GET");
});

// handler vehicle update form on POST
exports.vehicle_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Vehicle update POST");
});

// display vehicle delete form on GET
exports.vehicle_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Vehicle delete GET");
});

// handle vehicle delete form on POST
exports.vehicle_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Vehicle delete POST");
});
