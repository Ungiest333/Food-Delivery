const express = require('express');
const router = express.Router();
const multer = require('multer');
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middleware/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() });

// -------------------- Food CRUD --------------------
router.post('/', authMiddleware.authFoodPartnerMiddleware, upload.single("video"), foodController.createFood);

router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);

// -------------------- Like & Save --------------------
router.post('/like', authMiddleware.authUserMiddleware, foodController.likeFood);
router.post('/save', authMiddleware.authUserMiddleware, foodController.saveFood);
router.get('/save', authMiddleware.authUserMiddleware, foodController.getSaveFood);

// -------------------- Comments --------------------
router.get('/:id/comments', foodController.getComments);
router.post('/:id/comments', authMiddleware.authUserMiddleware, foodController.addComment);
router.delete('/:id/comments/:commentId', authMiddleware.authUserMiddleware, foodController.deleteComment);
router.put('/:id/comments/:commentId', authMiddleware.authUserMiddleware, foodController.updateComment);

module.exports = router;
