var express = require('express');
var router = express.Router();

// Require controller modules
const mission_controller = require('../controllers/missionController');
const customer_controller = require('../controllers/customerController');
const driver_controller = require('../controllers/driverController');
const vehicle_controller = require('../controllers/vehicleController');

// MISSION ROUTES //

// GET schedule home page
router.get('/', mission_controller.index);

// GET request for creating a Mission
router.get('/missions/create', mission_controller.mission_create_get);

// POST request for creating a Mission
router.post('/missions/create', mission_controller.mission_create_post);

// GET request for deleting a Mission
router.get('/missions/:id/delete', mission_controller.mission_delete_get);

// POST request for deleting a Mission
router.post('/missions/:id/delete', mission_controller.mission_delete_post);

// GET request for updating a Mission
router.get('/missions/:id/update', mission_controller.mission_update_get);

// POST request for updating a Mission
router.post('/missions/:id/update', mission_controller.mission_update_post);

// GET request for one Mission
router.get('/missions/:id', mission_controller.mission_detail);

// GET request for list of all Missions
router.get('/missions', mission_controller.mission_list);


// CUSTOMER ROUTES //

// GET request for creating a Customer
router.get('/customers/create', customer_controller.customer_create_get);

// POST request for creating a Customer
router.post('/customers/create', customer_controller.customer_create_post);

// GET request for deleting a Customer
router.get('/customers/:id/delete', customer_controller.customer_delete_get);

// POST request for deleting a Customer
router.post('/customers/:id/delete', customer_controller.customer_delete_post);

// GET request for updating a Customer
router.get('/customers/:id/update', customer_controller.customer_update_get);

// POST request for updating a Customer
router.post('/customers/:id/update', customer_controller.customer_update_post);

// GET request for one Customer
router.get('/customers/:id', customer_controller.customer_detail);

// GET request for list of all Customers
router.get('/customers', customer_controller.customer_list);


// DRIVER ROUTES //

// GET request for creating a Driver
router.get('/drivers/create', driver_controller.driver_create_get);

// POST request for creating a Driver
router.post('/drivers/create', driver_controller.driver_create_post);

// GET request for deleting a Driver
router.get('/drivers/:id/delete', driver_controller.driver_delete_get);

// POST request for deleting a Driver
router.post('/drivers/:id/delete', driver_controller.driver_delete_post);

// GET request for updating a Driver
router.get('/drivers/:id/update', driver_controller.driver_update_get);

// POST request for updating a Driver
router.post('/drivers/:id/update', driver_controller.driver_update_post);

// GET request for one Driver
router.get('/drivers/:id', driver_controller.driver_detail);

// GET request for list of all Drivers
router.get('/drivers', driver_controller.driver_list);


// VEHICLE ROUTES //

// GET request for creating a Vehicle
router.get('/vehicles/create', vehicle_controller.vehicle_create_get);

// POST request for creating a Vehicle
router.post('/vehicles/create', vehicle_controller.vehicle_create_post);

// GET request for deleting a Vehicle
router.get('/vehicles/:id/delete', vehicle_controller.vehicle_delete_get);

// POST request for deleting a Vehicle
router.post('/vehicles/:id/delete', vehicle_controller.vehicle_delete_post);

// GET request for updating a Vehicle
router.get('/vehicles/:id/update', vehicle_controller.vehicle_update_get);

// POST request for updating a Vehicle
router.post('/vehicles/:id/update', vehicle_controller.vehicle_update_post);

// GET request for one Vehicle
router.get('/vehicles/:id', vehicle_controller.vehicle_detail);

// GET request for list of all Vehicles
router.get('/vehicles', vehicle_controller.vehicle_list);


module.exports = router;