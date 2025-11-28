const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model("Batch", batchSchema);
