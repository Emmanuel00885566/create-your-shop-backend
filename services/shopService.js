import Shop from "../models/shop.js";
import Product from "../models/Product.js";
import slugify from "slugify";

export const createShopService = async (userId, name, description, logoUrl) => {
  if (!name) throw new Error("Shop name is required.");

  const existingShop = await Shop.findOne({ owner: userId });
  if (existingShop)
    throw new Error("You already own a shop. A user can only create one shop.");

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

  return newShop;
};

export const getShopBySlugService = async (slug) => {
  const shop = await Shop.findOne({ slug }).populate("owner", "name email");
  if (!shop) throw new Error("Shop not found.");

  const products = await Product.find({
    shop: shop._id,
    isAvailable: true,
  }).select("-__v");

  return {
    name: shop.name,
    slug: shop.slug,
    logoUrl: shop.logoUrl,
    description: shop.description,
    owner: shop.owner,
    products,
  };
};

export const updateShopService = async (userId, updateData) => {
  const shop = await Shop.findOne({ owner: userId });
  if (!shop)
    throw new Error("You don't have a shop yet. Create one before updating.");

  const dataToUpdate = { ...updateData };
  if (updateData.name) {
    dataToUpdate.slug = slugify(updateData.name, { lower: true, strict: true });
  }

  const updatedShop = await Shop.findByIdAndUpdate(
    shop._id,
    { $set: dataToUpdate },
    { new: true, runValidators: true }
  );

  return updatedShop;
};

export const getAllShopsService = async () => {
  return await Shop.find();
};
