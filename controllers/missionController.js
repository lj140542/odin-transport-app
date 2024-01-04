const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Customer = require("../models/customer");
const Driver = require("../models/driver");
const Mission = require("../models/mission");
const Vehicle = require("../models/vehicle");



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
  res.send("NOT IMPLEMENTED: Mission create GET");
});

// handle mission create form on POST
exports.mission_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Mission create POST");
});

// display mission update form on GET 
exports.mission_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Mission update GET");
});

// handler mission update form on POST
exports.mission_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Mission update POST");
});

// display mission delete form on GET
exports.mission_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Mission delete GET");
});

// handle mission delete form on POST
exports.mission_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Mission delete POST");
});
