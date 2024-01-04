const mongoose = require("mongoose");
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MissionSchema = new Schema({
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  driver: { type: Schema.Types.ObjectId, ref: "Driver" },
  vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle" },
});

// -- VIRTUALS
// Virtual for mission's URL
MissionSchema.virtual("url").get(function () {
  return `/schedule/missions/${this._id}`;
});
// Virtual for formatted start date
MissionSchema.virtual('formatted_start_date').get(function () {
  return DateTime.fromJSDate(this.start_date).toISODate();
});
// Virtual for formatted end date
MissionSchema.virtual('formatted_end_date').get(function () {
  return DateTime.fromJSDate(this.end_date).toISODate();
});
// Virtual for formatted span of the mission
MissionSchema.virtual('span').get(function () {
  let span_string = DateTime.fromJSDate(this.start_date).toISODate() +
    ' - ' + DateTime.fromJSDate(this.end_date).toISODate();
  return span_string;
});

module.exports = mongoose.model("Mission", MissionSchema);