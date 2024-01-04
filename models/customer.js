const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: { type: String, required: true }
});

// Virtual for customer's URL
CustomerSchema.virtual("url").get(function () {
  return `/schedule/customers/${this._id}`;
});

module.exports = mongoose.model("Customer", CustomerSchema);