#! /usr/bin/env node

console.log(
  'This script populates some test customers, drivers, vehicles and missions to your database. Specified database as argument'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Customer = require("./models/customer");
const Driver = require("./models/driver");
const Vehicle = require("./models/vehicle");
const Mission = require("./models/mission");

const customers = [];
const drivers = [];
const vehicles = [];
const missions = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCustomers();
  await createDrivers();
  await createVehicles();
  await createMissions();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// customer[0] will always be "CMA CGM", regardless of the order
// in which the elements of promise.all's argument complete.
async function customerCreate(index, name) {
  const customer = new Customer({ name: name });
  await customer.save();
  customers[index] = customer;
  console.log(`Added customer: ${name}`);
}

async function driverCreate(index, first_name, family_name, age) {
  const driverdetail = { first_name: first_name, family_name: family_name };
  if (age != false) driverdetail.age = age;

  const driver = new Driver(driverdetail);

  await driver.save();
  drivers[index] = driver;
  console.log(`Added driver: ${first_name} ${family_name}`);
}

async function vehicleCreate(index, registration_number, type) {
  const vehicle = new Vehicle({
    registration_number: registration_number,
    vehicle_type: type,
  });
  await vehicle.save();
  vehicles[index] = vehicle;
  console.log(`Added vehicle: ${registration_number}`);
}

async function missionCreate(index, start_date, end_date, customer, driver, vehicle) {
  const mission = new Mission({
    start_date: start_date,
    end_date: end_date,
    customer: customer,
    driver: driver,
    vehicle: vehicle,
  });
  await mission.save();
  missions[index] = mission;
  console.log(`Added mission: ${index}`);
}

async function createCustomers() {
  console.log("Adding Customers");
  await Promise.all([
    customerCreate(0, "CMA CGM"),
    customerCreate(1, "Maersk"),
    customerCreate(2, "Evergreen"),
  ]);
}

async function createDrivers() {
  console.log("Adding Drivers");
  await Promise.all([
    driverCreate(0, "Patrick", "Rothfuss", 50),
    driverCreate(1, "Ben", "Bova", 35),
    driverCreate(2, "Charles", "Henry"),
    driverCreate(3, "Bob", "Billings", 44),
    driverCreate(4, "Jim", "Jones", 27),
  ]);
}

async function createVehicles() {
  console.log("Adding Vehicles");
  await Promise.all([
    vehicleCreate(0, "211896", "Truck"),
    vehicleCreate(1, "352836", "Truck"),
    vehicleCreate(2, "11336", "Car"),
    vehicleCreate(3, "79528", "Car"),
    vehicleCreate(4, "379504", "Truck"),
    vehicleCreate(5, "111111", "Truck"),
  ]);
}

async function createMissions() {
  console.log("Adding Missions");
  await Promise.all([
    missionCreate(0, "2023-12-06", "2023-12-10", customers[0], drivers[0], vehicles[0]),
    missionCreate(1, "2023-12-07", "2023-12-09", customers[1], drivers[1], vehicles[1]),
    missionCreate(2, "2023-12-06", "2023-12-07", customers[2], drivers[2], vehicles[2]),
    missionCreate(3, "2023-12-07", "2023-12-09", customers[1], drivers[3], vehicles[3]),
    missionCreate(4, "2023-12-08", "2023-12-08", customers[1], drivers[3], vehicles[3]),
    missionCreate(5, "2023-12-06", "2023-12-07", customers[1], drivers[3], vehicles[3]),
    missionCreate(6, "2023-12-10", "2023-12-14", customers[2], drivers[4], vehicles[4]),
    missionCreate(7, "2023-12-06", "2023-12-12", customers[2], drivers[4], vehicles[4]),
    missionCreate(8, "2023-12-07", "2023-12-08", customers[2], drivers[4], vehicles[4]),
    missionCreate(9, "2023-12-07", "2023-12-09", customers[0], drivers[0], vehicles[0]),
    missionCreate(10, "2023-12-12", "2023-12-12", customers[1], drivers[1], vehicles[1]),
  ]);
}