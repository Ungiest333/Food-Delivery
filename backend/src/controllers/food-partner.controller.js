const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");

async function getFoodPartnerById(req, res) {
  try {
    const { id } = req.params;

    // Fetch partner
    const foodPartner = await foodPartnerModel.findById(id);
    if (!foodPartner) {
      return res.status(404).json({
        message: "Food partner not found",
      });
    }

    // Fetch all food items uploaded by this partner
    const foodItems = await foodModel.find({ foodPartner: id });

    res.status(200).json({
      message: "Food partner fetched successfully",
      foodPartner: {
        ...foodPartner.toObject(),
        videos: foodItems.map((item) => ({
          url: item.video,
          name: item.name,
          description: item.description,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching food partner:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = { getFoodPartnerById };
