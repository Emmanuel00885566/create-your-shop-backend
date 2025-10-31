import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user._id; 

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    product.averageRating = avgRating.toFixed(1);
    await product.save();

    res.status(201).json({
      message: 'Review added successfully',
      review,
      averageRating: product.averageRating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this product' });
    }

    res.status(200).json({ count: reviews.length, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
