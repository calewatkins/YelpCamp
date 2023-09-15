const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeoCoding({ accessToken: mapboxToken });



module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.create = async (req, res, next) => {
  const geoData = await geoCoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  
  const campground = req.body.campground;
  campground.geometry = geoData.body.features[0].geometry;
  
  campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;

  const newCampground = await Campground.create(campground);
  
  req.flash('success', 'Successfully made a new campground');
  res.redirect(`campgrounds/${newCampground._id}`);
};

module.exports.getById = async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('author').populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }});

  if(!campground) {
    req.flash('error', 'Campground cannot be found');
    res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);

  if(!campground) {
    req.flash('error', 'Campground cannot be found');
    return res.redirect('/campgrounds');
  }

  res.render('campgrounds/edit', { campground });
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();


  if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
  }
  
  req.flash('success', 'Successfully updated campground');
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;

  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground');
  res.redirect('/campgrounds');
};