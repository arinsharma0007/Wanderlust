const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/brown-hut-near-body-of-water-oji_NGmBI5o",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/brown-hut-near-body-of-water-oji_NGmBI5o"
        : v,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
});

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
