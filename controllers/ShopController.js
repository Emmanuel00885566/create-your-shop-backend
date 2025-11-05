import {
  createShopService,
  getShopBySlugService,
  updateShopService,
  getAllShopsService,
} from "../services/shopService.js";

export const createShop = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, description } = req.body;
    const logoUrl = req.file ? req.file.path : "";

    const newShop = await createShopService(userId, name, description, logoUrl);

    res.status(201).json({
      message: "Shop created successfully!",
      shop: newShop,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getShopBySlug = async (req, res) => {
  try {
    const shopData = await getShopBySlugService(req.params.slug);
    res.status(200).json({ shop: shopData });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateShop = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = { ...req.body };
    if (req.file) {
      updates.logoUrl = req.file.path;
    }

    const updatedShop = await updateShopService(userId, updates);

    res.status(200).json({
      message: "Shop updated successfully.",
      shop: updatedShop,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllShops = async (req, res) => {
  try {
    const shops = await getAllShopsService();
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
