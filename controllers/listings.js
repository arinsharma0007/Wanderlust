const Listing = require("../models/listing");

const mbxGoecoding = require("@mapbox/mapbox-sdk/services/geocoding");
const ExpressError = require("../utils/ExpressError");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGoecoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};

module.exports.search = async (req, res) => {
  let search = req.query.search;

  let allListings = await Listing.find({
    $or: [
      { title: { $regex: search } },
      { catagory: { $regex: search } },
      { country: { $regex: search, $options: "i" } },
      { location: { $regex: search } },
    ],
  });

  // const cityListings = search
  //   ? allListings.filter(
  //       (listing) => listing.country.toLowerCase() === country.toLowerCase()
  //     )
  //   : allListings;

  // if (cityListings.length === 0) {
  //   req.flash("error", "OOPS! No listing available");
  //   res.redirect("/listings");
  // } else {
  //   res.render("listings/index.ejs", { allListings: cityListings });
  // }

  let btnValue = search;
  res.render("listings/category.ejs", { allListings, btnValue });
};

module.exports.categoryListing = async (req, res) => {
  let { btnValue } = req.body;

  const allListings = await Listing.find({ category: btnValue });
  console.log(allListings);
  res.render("listings/category.ejs", { allListings, btnValue });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })

    .populate("owner");
  if (!listing) {
    req.flash("error", "The listing you requested for doesn't exist!");
    res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  // console.log(savedListing);

  req.flash("success", "New Listing Created!");

  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you requested for doesn't exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_220");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if (!req.body.listing) {
    new ExpressError(400, "Please send valid data for listing");
  }
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };

    // console.log(response);
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
