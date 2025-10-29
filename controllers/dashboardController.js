import Product from "../models/Product.js";
import Order from "../models/Order.js";

/**
 * @desc   Get analytics stats for a shop
 * @route  GET /api/dashboard/stats
 * @access Private (Shop Owner)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const shopId = req.user.shop; 
    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "No shop found for this user.",
      });
    }

    const totalProducts = await Product.countDocuments({ shop: shopId });

    const orders = await Order.find({ shop: shopId });

    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === "completed").length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;

    
    const totalRevenue = orders
      .filter(o => o.status === "completed")
      .reduce((sum, order) => sum + order.total, 0);

    const monthlyStats = await Order.aggregate([
      { $match: { shop: shopId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard stats.",
    });
  }
};
