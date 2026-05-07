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

    const orders = await Order.find({ shop: shopId }).select("status total createdAt");

    let totalOrders = 0, completedOrders = 0, pendingOrders = 0, totalRevenue = 0;

orders.forEach(order => {
  totalOrders++;
  if (order.status === "completed") {
    completedOrders++;
    totalRevenue += order.total;
  } else if (order.status === "pending") {
    pendingOrders++;
  }
});


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
]).then(data =>
  data.map(item => ({
    month: new Date(0, item._id - 1).toLocaleString("default", { month: "short" }),
    totalRevenue: item.totalRevenue,
    orders: item.orders,
  }))
);


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
    console.error("Error fetching dashboard stats:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard stats.",
    });
  }
};
