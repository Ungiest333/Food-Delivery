const express =  require('express');
const authController = require("../controllers/auth.controllers")

const router = express.Router();

//User auth api
router.post('/user/register',authController.registerUser)
router.post('/user/login',authController.loginUser)
router.get("/user/logout",authController.logoutUser)

//partner auth api
router.post('/foodpartner/register',authController.registerFoodPartner)
router.post('/foodpartner/login', authController.loginFoodPartner)
router.get('/foodpartner/logout', authController.logoutFoodPartner)




module.exports = router;