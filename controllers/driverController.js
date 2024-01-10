const Driver = require("../models/driver");
const Mission = require("../models/mission");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
    driver: driver,
    missions_assigned: missions
  });
});

// display driver create form on GET
exports.driver_create_get = asyncHandler(async (req, res, next) => {
  res.render('driver_form', { title: "Create driver" })
});

// handle driver create form on POST
exports.driver_create_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('age', 'Minimum age is 18')
    .optional({ values: 'falsy' })
    .isInt({ min: 18 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const driver = new Driver({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      age: req.body.age
    });

    if (!errors.isEmpty()) {
      res.render('driver_form', {
        title: 'Create driver',
        driver: driver,
        errors: errors.array()
      });
      return;
    }
    else {
      await driver.save();
      res.redirect(driver.url);
    }
  })
];

// display driver update form on GET 
exports.driver_update_get = asyncHandler(async (req, res, next) => {
  const driver = await Driver.findById(req.params.id).exec();

  if (driver === null) {
    let err = new Error('Driver not found');
    err.status = 404;
    next(err);
  }

  res.render('driver_form', {
    title: 'Update driver',
    driver: driver
  });
});

// handler driver update form on POST
exports.driver_update_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('age', 'Minimum age is 18')
    .optional({ values: 'falsy' })
    .isInt({ min: 18 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const driver = new Driver({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      age: req.body.age,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      res.render('driver_form', {
        title: 'Update driver',
        driver: driver,
        errors: errors.array()
      });
      return;
    }
    else {
      const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, driver);
      res.redirect(updatedDriver.url);
    }
  })
];

// display driver delete form on GET
exports.driver_delete_get = asyncHandler(async (req, res, next) => {
  const [driver, driverMissions] = await Promise.all([
    Driver.findById(req.params.id).exec(),
    Mission.find({ driver: req.params.id }).exec()
  ]);

  if (driver === null) {
    let err = new Error('Driver not found');
    err.status = 404;
    next(err);
  }

  res.render('driver_delete', {
    title: 'Delete driver',
    driver: driver,
    mission_list: driverMissions
  });
});

// handle driver delete form on POST
exports.driver_delete_post = asyncHandler(async (req, res, next) => {
  const [driver, driverMissions] = await Promise.all([
    Driver.findById(req.params.id).exec(),
    Mission.find({ driver: req.params.id }).exec()
  ]);

  if (driver === null) {
    let err = new Error('Driver not found');
    err.status = 404;
    next(err);
  }

  if (driverMissions.length > 0) {
    res.render('driver_delete', {
      title: 'Delete driver',
      driver: driver,
      mission_list: driverMissions
    });
    return;
  }

  await Driver.findByIdAndDelete(req.params.id);
  res.redirect('/schedule/drivers');
});
