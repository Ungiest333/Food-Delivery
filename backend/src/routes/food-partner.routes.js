const express = require('express');
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// ✅ Correct route
router.get("/:id",
    authMiddleware.authFoodPartnerMiddleware,
    foodPartnerController.getFoodPartnerById
);

module.exports = router;
