import Shop from "../models/Shop.js";
import Product from "../models/productModel.js";
import User from "../models/User.js";
import slugify from "slugify";

/**
 * @desc    Create a new shop for logged-in user
 * @route   POST /api/shops
 * @access  Private
 */
export const createShop = async (req, res) => {
  const userId = req.user._id;
  const { name, description } = req.body;
  const logoUrl = req.file ? req.file.path : "";

  if (!name) {
    return res.status(400).json({ message: "Shop name is required." });
  }

  try {
    // check if user already owns a shop
    const existingShop = await Shop.findOne({ owner: userId });
    if (existingShop) {
      return res.status(400).json({
        message: "You already own a shop. A user can only create one shop.",
      });
    }

    // create unique slug
    let baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Shop.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newShop = await Shop.create({
      owner: userId,
      name,
      slug,
      logoUrl,
      description,
    });

    res.status(201).json({
      message: "Shop created successfully!",
      shop: newShop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during shop creation." });
  }
};

/**
 * @desc    Get shop by slug
 * @route   GET /api/shops/:slug
 * @access  Public
 */
export const getShopBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const shop = await Shop.findOne({ slug }).populate("owner", "name email");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found." });
    }

    const products = await Product.find({
      shop: shop._id,
      isAvailable: true,
    }).select("-__v");

    res.status(200).json({
      shop: {
        name: shop.name,
        slug: shop.slug,
        logoUrl: shop.logoUrl,
        description: shop.description,
        owner: shop.owner,
        products,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error retrieving shop data." });
  }
};

/**
 * @desc    Update shop details for logged-in user
 * @route   PUT /api/shops
 * @access  Private
 */
export const updateShop = async (req, res) => {
  const userId = req.user._id;

  try {
    const shop = await Shop.findOne({ owner: userId });
    if (!shop) {
      return res.status(404).json({
        message: "You don't have a shop yet. Create one before updating.",
      });
    }

    const updateData = { ...req.body };

    // handle name change -> new slug
    if (req.body.name) {
      updateData.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      shop._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Shop updated successfully.",
      shop: updatedShop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during shop update." });
  }
};
