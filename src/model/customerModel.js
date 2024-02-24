const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  code: { type: String, required: true },
  state: { type: String, required: true },
  website: { type: String, required: true },
  is_delete: { type: Number, default : 0 },
});

module.exports = mongoose.model("Customer", customerSchema);
