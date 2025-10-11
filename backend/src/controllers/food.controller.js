const foodModel = require('../models/food.model');
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const commentModel = require('../models/comment.model');
const storageService = require("../services/storage.services");
const { v4: uuid } = require("uuid");

// -------------------- Food CRUD --------------------

async function createFood(req, res) {
  try {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id
    });

    res.status(201).json({ message: "Food created successfully", food: foodItem });
  } catch (err) {
    console.error("Error creating food:", err);
    res.status(500).json({ message: err.message });
  }
}

async function getFoodItems(req, res) {
  try {
    const foodItems = await foodModel.find({});
    res.status(200).json({ message: "Food items fetched successfully", foodItems });
  } catch (err) {
    console.error("Error fetching food items:", err);
    res.status(500).json({ message: err.message });
  }
}

// -------------------- Like --------------------

async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({ user: user._id, food: foodId });

    if (isAlreadyLiked) {
      await likeModel.deleteOne({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
      return res.status(200).json({ message: "Food unliked successfully" });
    }

    const like = await likeModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

    res.status(201).json({ message: "Food liked successfully", like });
  } catch (err) {
    console.error("Error liking food:", err);
    res.status(500).json({ message: err.message });
  }
}

// -------------------- Save --------------------

async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({ user: user._id, food: foodId });

    if (isAlreadySaved) {
      await saveModel.deleteOne({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });
      return res.status(200).json({ message: "Food unsaved successfully" });
    }

    const save = await saveModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

    res.status(201).json({ message: "Food saved successfully", save });
  } catch (err) {
    console.error("Error saving food:", err);
    res.status(500).json({ message: err.message });
  }
}

async function getSaveFood(req, res) {
  try {
    const user = req.user;
    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
      return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({ message: "Saved foods retrieved successfully", savedFoods });
  } catch (err) {
    console.error("Error fetching saved foods:", err);
    res.status(500).json({ message: err.message });
  }
}

// -------------------- Comments --------------------

// Get all comments for a food item
async function getComments(req, res) {
  const { id: foodId } = req.params;

  try {
    const comments = await commentModel.find({ food: foodId }).populate('user', 'name');
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: err.message });
  }
}

// Add a comment
async function addComment(req, res) {
  const { id: foodId } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  try {
    // Optional: check if food exists
    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food item not found' });

    const comment = await commentModel.create({
      text,
      user: req.user._id,
      food: foodId
    });

    const populatedComment = await comment.populate('user', 'name');
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: err.message });
  }
}

// Delete a comment
async function deleteComment(req, res) {
  const { commentId } = req.params;

  try {
    const comment = await commentModel.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await comment.remove();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: err.message });
  }
}

// Update a comment
async function updateComment(req, res) {
  const { commentId } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: 'Text required' });

  try {
    const comment = await commentModel.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    comment.text = text;
    await comment.save();

    const populatedComment = await comment.populate('user', 'name');
    res.status(200).json(populatedComment);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ message: err.message });
  }
}

// -------------------- Export --------------------
module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
  getComments,
  addComment,
  deleteComment,
  updateComment
};
