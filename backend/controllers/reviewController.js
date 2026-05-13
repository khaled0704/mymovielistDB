const Review = require('../models/Review');
const Movie = require('../models/Movie');


const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const movieId = req.params.movieId;
    const userId = req.user.id;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    const existing = await Review.findOne({ userId, movieId });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this movie' });
    }
    const review = await Review.create({ userId, movieId, rating, comment });
    const allReviews = await Review.find({ movieId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Movie.findByIdAndUpdate(movieId, { averageRating: avg.toFixed(1) });
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMovieReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('userId', 'username avatar'); // gets username instead of just the id
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { rating, comment } = req.body;
    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();
    const allReviews = await Review.find({ movieId: review.movieId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Movie.findByIdAndUpdate(review.movieId, { averageRating: avg.toFixed(1) });
    res.json({ message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    const allReviews = await Review.find({ movieId: review.movieId });
    const avg = allReviews.length
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    await Movie.findByIdAndUpdate(review.movieId, { averageRating: avg });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addReview, getMovieReviews, updateReview, deleteReview };