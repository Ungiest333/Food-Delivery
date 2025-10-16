const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"Login First"
        })
    }

    try{
         const decoded = jwt.verify(token, process.env.JWT_SECRET)
         const foodPartner = await foodPartnerModel.findById(decoded.id)
         req.foodPartner = foodPartner
         next()

    }catch (err){
        return res.status(401).json({
            message: "Invalid token"
        })

    }


}
async function authUserMiddleware(req,res,next){

    console.log('req.cookies', req.cookies)
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            messsage: "Please login first"
        })
    }

    try{
        console.log('process.env.JWT_SECRET', process.env.JWT_SECRET)
        const decoded =jwt.verify(token, process.env.JWT_SECRET)
        console.log('decoded', decoded)


         const user = await userModel.findById(decoded.id);

         req.user =user
         
         next()

    }catch (err){
        return res.status(401).json({
            message:"Invalid token"
        }) 

    }
      
}



module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}