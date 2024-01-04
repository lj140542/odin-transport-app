const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
  registration_number: { type: String, required: true, maxLength: 10 },
  vehicle_type: { type: String, required: true, enum: ["Truck", "Car"], default: "Truck" }
});

// Virtual for vehicle's URL
VehicleSchema.virtual("url").get(function () {
  return `/schedule/vehicles/${this._id}`;
});

module.exports = mongoose.model("Vehicle", VehicleSchema);