const Driver = require("../models/driver");
const Mission = require("../models/mission");
const asyncHandler = require("express-async-handler");

// displays all drivers
exports.driver_list = asyncHandler(async (req, res, next) => {
  const drivers = await Driver.find().exec();
  res.render('driver_list', {
    title: 'List of drivers',
    driver_list: drivers
  });
});

// display detail page for a specific driver
exports.driver_detail = asyncHandler(async (req, res, next) => {
  const [driver, missions] = await Promise.all([
    Driver.findById(req.params.id).exec(),
    Mission.find({ 'driver': req.params.id }).exec()
  ]);

  if (driver === null) {
    let err = new Error('Driver not found');
    err.status = 404;
    next(err);
  }

  res.render('driver_detail', {
    title: driver.full_name,
    age: driver.age,
    missions_assigned: missions
  });
});

// display driver create form on GET
exports.driver_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Driver create GET");
});

// handle driver create form on POST
exports.driver_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Driver create POST");
});

// display driver update form on GET 
exports.driver_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Driver update GET");
});

// handler driver update form on POST
exports.driver_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Driver update POST");
});

// display driver delete form on GET
exports.driver_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Driver delete GET");
});

// handle driver delete form on POST
exports.driver_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Driver delete POST");
});
