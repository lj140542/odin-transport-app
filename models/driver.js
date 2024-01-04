const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DriverSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  age: { type: Number, min: 18 }
});

// Virtual for driver's full name
DriverSchema.virtual("full_name").get(function () {
  let full_name = "";
  if (this.first_name && this.family_name) {
    full_name = `${this.family_name}, ${this.first_name}`;
  }
  return full_name;
});

// Virtual for driver's URL
DriverSchema.virtual("url").get(function () {
  return `/schedule/drivers/${this._id}`;
});

module.exports = mongoose.model("Driver", DriverSchema);